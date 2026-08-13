(() => {
  const nav = document.querySelector('.greedy-nav');
  const button = nav?.querySelector('button');
  const menu = nav?.querySelector('.visible-links');

  if (!nav || !button || !menu) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    button.classList.remove('close');
    button.setAttribute('aria-expanded', 'false');
  };

  button.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    button.classList.toggle('close', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
  });

  menu.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
})();
