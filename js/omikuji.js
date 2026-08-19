(() => {
  const body = document.body;
  const drawButton = document.getElementById('drawButton');
  const drawAgainButton = document.getElementById('drawAgainButton');
  const resultSection = document.getElementById('resultSection');

  function revealDemo() {
    body.classList.add('is-drawing');
    drawButton.disabled = true;

    window.setTimeout(() => {
      resultSection.hidden = false;
      resultSection.classList.remove('reveal');
      void resultSection.offsetWidth;
      resultSection.classList.add('reveal');
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      drawButton.disabled = false;
      body.classList.remove('is-drawing');
    }, 1100);
  }

  drawButton?.addEventListener('click', revealDemo);
  drawAgainButton?.addEventListener('click', () => {
    resultSection.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
