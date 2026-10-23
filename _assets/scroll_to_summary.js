function scroll_to_summary() {
  const hash = decodeURIComponent(window.location.hash.slice(1)).trim();
  if (!hash) return;

  const summaries = document.querySelectorAll('details > summary');

  for (const summary of summaries) {
    const text = summary.textContent.trim();

    if (text.toLowerCase().includes(hash.toLowerCase())) {
      const details = summary.closest('details');
      if (details) {
        details.open = true;

        const yOffset = -60
        const y = details.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });

        break;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  scroll_to_summary();

  window.addEventListener("hashchange", () => {
    scroll_to_summary();
  });
});