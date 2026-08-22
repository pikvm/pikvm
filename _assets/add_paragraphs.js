document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector('summary');

    if (!summary) return;

    if (window.matchMedia('(hover: none)').matches) return;

    let linkEl;

    details.addEventListener('mouseenter', () => {
      if (details.open) return;

      const summaryText = summary.textContent.trim();
      console.log(`${summaryText}`);
      const hash = '#' + encodeURIComponent(summaryText);

      if (linkEl) return;

      linkEl = document.createElement('a');
      linkEl.href = hash;
      linkEl.textContent = '¶';
      linkEl.title = 'Permanent link';
      linkEl.className = 'hoverlink';

      summary.appendChild(linkEl);
    });

    details.addEventListener('mouseleave', () => {
      if (linkEl) {
        linkEl.remove();
        linkEl = null;
      }
    });
  });
});