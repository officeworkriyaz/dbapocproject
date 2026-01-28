export default function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');

  rows.forEach((row, index) => {
    // Check if this row has a button-container with a link
    const buttonContainer = row.querySelector('.button-container');

    if (buttonContainer) {
      // This row has a button - convert it to a link but keep other content
      const link = buttonContainer.querySelector('a');

      if (link) {
        // Create a completely new link element
        const newLink = document.createElement('a');
        newLink.href = link.href;
        if (link.title) newLink.title = link.title;
        newLink.textContent = `${link.textContent.trim()} >`;
        newLink.classList.add('main_content_text-a');

        // Replace the entire button-container paragraph with just the link
        const newLinkPara = document.createElement('p');
        newLinkPara.classList.add('marintobottom-aboutuslink');
        newLinkPara.append(newLink);
        buttonContainer.replaceWith(newLinkPara);
      }
    }

    // Apply standard row styling based on index
    if (index === 0) {
      row.classList.add('main_content_text-div');
    } else if (index === 1) {
      row.classList.add('main_content_text-div');
    }
  });
  block.classList.add('main_content_text_link-div', 'marintobottom-aboutus');
}
