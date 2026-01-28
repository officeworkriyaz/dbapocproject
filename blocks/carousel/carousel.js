import { fetchPlaceholders } from '../../scripts/placeholders.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    const button = indicator.querySelector('button');
    if (idx !== slideIndex) {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    } else {
      button.setAttribute('disabled', true);
      button.setAttribute('aria-current', true);
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  const isCardsVariant = block.classList.contains('cards');

  if (isCardsVariant) {
    // For cards variant, scroll by groups of 3
    const totalSlides = slides.length;
    const maxIndex = Math.max(0, totalSlides - 3);
    let realSlideIndex = slideIndex < 0 ? 0 : slideIndex;
    if (slideIndex > maxIndex) realSlideIndex = maxIndex;

    const scrollPosition = slides[realSlideIndex].offsetLeft;
    block.querySelector('.carousel-slides').scrollTo({
      top: 0,
      left: scrollPosition,
      behavior: 'smooth',
    });

    block.dataset.activeSlide = realSlideIndex;
  } else {
    // Full-width variant - original behavior
    let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
    if (slideIndex >= slides.length) realSlideIndex = 0;
    const activeSlide = slides[realSlideIndex];

    activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
    block.querySelector('.carousel-slides').scrollTo({
      top: 0,
      left: activeSlide.offsetLeft,
      behavior: 'smooth',
    });
  }
}

function bindEvents(block) {
  const isCardsVariant = block.classList.contains('cards');
  const slideIndicators = block.querySelector('.carousel-slide-indicators');

  if (slideIndicators && !isCardsVariant) {
    slideIndicators.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const slideIndicator = e.currentTarget.parentElement;
        showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
      });
    });
  }

  const prevButton = block.querySelector('.slide-prev');
  const nextButton = block.querySelector('.slide-next');

  if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
      const current = parseInt(block.dataset.activeSlide, 10);
      if (isCardsVariant) {
        showSlide(block, current - 1);
      } else {
        showSlide(block, current - 1);
      }
    });

    nextButton.addEventListener('click', () => {
      const current = parseInt(block.dataset.activeSlide, 10);
      if (isCardsVariant) {
        showSlide(block, current + 1);
      } else {
        showSlide(block, current + 1);
      }
    });
  }

  // Auto scroll every 5 seconds (only for full-width variant)
  if (!isCardsVariant) {
    setInterval(() => {
      const current = parseInt(block.dataset.activeSlide || 0, 10);
      showSlide(block, current + 1);
    }, 5000);

    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) updateActiveSlide(entry.target);
      });
    }, { threshold: 0.5 });
    block.querySelectorAll('.carousel-slide').forEach((slide) => {
      slideObserver.observe(slide);
    });
  }
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isCardsVariant = block.classList.contains('cards');

  

  // For cards variant, first row with single column is the title
  let titleRow = null;
  let slideRows = rows;
  if (isCardsVariant && rows.length > 0) {
    const firstRow = rows[0];
    const firstRowCols = firstRow.querySelectorAll(':scope > div');
    if (firstRowCols.length === 1) {
      titleRow = firstRow;
      slideRows = Array.from(rows).slice(1);
    }
  }

  const isSingleSlide = slideRows.length < 2;

  const placeholders = await fetchPlaceholders();

  // Default placeholder values
  const defaultPlaceholders = {
    carousel: 'Carousel',
    carouselSlideControls: 'Carousel Slide Controls',
    previousSlide: 'Previous Slide',
    nextSlide: 'Next Slide',
    showSlide: 'Show Slide',
    of: 'of',
  };

  // Merge with fetched placeholders
  Object.keys(defaultPlaceholders).forEach((key) => {
    if (!placeholders[key]) {
      placeholders[key] = defaultPlaceholders[key];
    }
  });

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel);

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');

  let slideIndicators;
  // For cards variant, show nav buttons if more than 3 cards
  // For full-width variant, show indicators and nav buttons if more than 1 slide
  const showControls = isCardsVariant ? slideRows.length > 3 : !isSingleSlide;

  if (showControls) {
    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide}"></button>
    `;

    if (isCardsVariant) {
      // For cards, nav buttons will be moved to header later
      container.append(slideNavButtons);
    } else {
      // For full-width, add nav buttons to container
      const slideIndicatorsNav = document.createElement('nav');
      slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls);
      slideIndicators = document.createElement('ol');
      slideIndicators.classList.add('carousel-slide-indicators');
      slideIndicatorsNav.append(slideIndicators);
      block.append(slideIndicatorsNav);

      container.append(slideNavButtons);
    }
  }

  slideRows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide} ${idx + 1} ${placeholders.of} ${slideRows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  // Create title header for cards variant AFTER container is added
  if (isCardsVariant && titleRow) {
    const header = document.createElement('div');
    header.classList.add('carousel-header');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('carousel-title');
    const titleContent = titleRow.querySelector('div');
    if (titleContent) {
      titleDiv.innerHTML = titleContent.innerHTML;
    }

    const headerNav = document.createElement('div');
    headerNav.classList.add('carousel-header-nav');

    // Add nav buttons to header if they were created
    if (showControls && slideRows.length > 3) {
      const slideNavButtons = block.querySelector('.carousel-navigation-buttons');
      if (slideNavButtons) {
        headerNav.append(slideNavButtons);
      }
    }

    header.append(titleDiv);
    header.append(headerNav);
    block.prepend(header);
    titleRow.remove();
  }

  // Initialize active slide
  block.dataset.activeSlide = '0';

  if (showControls) {
    bindEvents(block);
  }
}
