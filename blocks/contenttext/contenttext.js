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
        // Add SVG arrow
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '7');
        svg.setAttribute('height', '12');
        svg.setAttribute('viewBox', '0 0 7 12');
        svg.setAttribute('fill', 'none');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M5.29238 5.99525L0.692383 1.39525L1.40013 0.6875L6.70788 5.99525L1.40013 11.303L0.692383 10.5953L5.29238 5.99525Z');
        path.setAttribute('fill', '#4053FC');
        svg.append(path);
        linkDiv.append(svg);
      }
      row.append(linkDiv);
    }
  });
  block.classList.add('main_content_text_link-div', 'marintobottom-aboutus');
}