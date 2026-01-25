export default function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row, index) => {
    if (index === 0) {
      // H1
      row.classList.add('main_content_text-div');
      const layout = document.createElement('div');
      layout.classList.add('main_content_text-layout');
      layout.append(...row.children);
      row.append(layout);
    } else if (index === 1) {
      // H2
      row.classList.add('main_content_text-div');
      const layout = document.createElement('div');
      layout.classList.add('main_content_text-layout');
      layout.append(...row.children);
      row.append(layout);
    } else if (index === 2) {
      // Link
      row.classList.add('main_content_text-div_a');
      const linkDiv = document.createElement('div');
      linkDiv.classList.add('marintobottom-aboutuslink');
      const link = row.querySelector('a');
      if (link) {
        link.classList.add('main_content_text-a');
        linkDiv.append(link);
        // Add > symbol
        const arrow = document.createElement('span');
        arrow.textContent = ' >';
        arrow.style.marginLeft = '8px';
        linkDiv.append(arrow);
      }
      row.append(linkDiv);
    }
  });
  block.classList.add('main_content_text_link-div', 'marintobottom-aboutus');
}
