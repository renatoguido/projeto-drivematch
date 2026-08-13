document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('acc-toggle');
  const closeBtn = document.getElementById('acc-close');
  const panel = document.getElementById('acc-panel');

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('acc-hidden');
      const isHidden = panel.classList.contains('acc-hidden');
      panel.setAttribute('aria-hidden', isHidden);
    });
  }

  if (closeBtn && panel) {
    closeBtn.addEventListener('click', () => {
      panel.classList.add('acc-hidden');
      panel.setAttribute('aria-hidden', 'true');
    });
  }
});

let fontSizeRatio = 100;

function updateUI() {
  const body = document.body;
  const html = document.documentElement; 

  // Atualiza botões de Fonte
  const btnPlus = document.getElementById('btn-font-plus');
  const btnMinus = document.getElementById('btn-font-minus');
  if (btnPlus) btnPlus.classList.toggle('is-active', fontSizeRatio > 100);
  if (btnMinus) btnMinus.classList.toggle('is-active', fontSizeRatio < 100);

  // Atualiza botões de Modificação Visual
  toggleCardState('btn-spacing', body.classList.contains('acc-wide-spacing'));
  toggleCardState('btn-line-height', body.classList.contains('acc-tall-line'));
  toggleCardState('btn-contrast', body.classList.contains('acc-contrast'));
  toggleCardState('btn-monochrome', html.classList.contains('acc-monochrome')); 
  toggleCardState('btn-hide-images', body.classList.contains('acc-hide-images'));

  // Atualiza bolinha flutuante
  const isAnyActive = fontSizeRatio !== 100 || html.classList.contains('acc-monochrome') || [
    'acc-wide-spacing', 'acc-tall-line', 'acc-contrast', 'acc-hide-images'
  ].some(cls => body.classList.contains(cls));

  body.classList.toggle('accessibility-active', isAnyActive);
}

function resetAccessibility() {
  fontSizeRatio = 100;
  document.documentElement.style.fontSize = '100%';
  document.documentElement.classList.remove('acc-monochrome');
  document.body.classList.remove(
    'acc-contrast',
    'acc-wide-spacing',
    'acc-tall-line',
    'acc-hide-images',
    'accessibility-active'
  );
  updateUI();
}

function toggleCardState(id, isActive) {
  const card = document.getElementById(id);
  if (card) {
    card.classList.toggle('is-active', isActive);
  }
}

// Funções dos Botões
function changeFontSize(direction) {
  fontSizeRatio += direction * 10;
  if (fontSizeRatio < 80) fontSizeRatio = 80;
  if (fontSizeRatio > 140) fontSizeRatio = 140;
  document.documentElement.style.fontSize = `${fontSizeRatio}%`;
  updateUI();
}

function toggleWideSpacing() {
  document.body.classList.toggle('acc-wide-spacing');
  updateUI();
}

function toggleLineHeight() {
  document.body.classList.toggle('acc-tall-line');
  updateUI();
}

function toggleHighContrast() {
  document.body.classList.toggle('acc-contrast');
  updateUI();
}

function toggleMonochrome() {
  document.documentElement.classList.toggle('acc-monochrome');
  updateUI();
}

function toggleHideImages() {
  document.body.classList.toggle('acc-hide-images');
  updateUI();
}

function resetAccessibility() {
  fontSizeRatio = 100;
  document.documentElement.style.fontSize = '100%';
  document.body.classList.remove(
    'acc-contrast',
    'acc-monochrome',
    'acc-wide-spacing',
    'acc-tall-line',
    'acc-hide-images',
    'accessibility-active'
  );
  updateUI();
}