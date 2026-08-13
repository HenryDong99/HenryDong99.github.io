(() => {
  const nav = document.querySelector('.greedy-nav');
  const navButton = nav?.querySelector('button[type="button"]:not(.theme-switch)');
  const menu = nav?.querySelector('.visible-links');

  if (nav && navButton && menu) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      navButton.classList.remove('close');
      navButton.setAttribute('aria-expanded', 'false');
    };

    navButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navButton.classList.toggle('close', isOpen);
      navButton.setAttribute('aria-expanded', String(isOpen));
    });

    menu.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const themeButton = document.getElementById('theme-switch');
  const themeLabel = themeButton?.querySelector('.theme-switch__label');
  if (!themeButton || !themeLabel) return;

  const THEME_KEY = 'site-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  const supportsStorage = (() => {
    try {
      const k = '__test_theme__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  })();

  const systemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT);
  const readStoredTheme = () => {
    if (!supportsStorage) return null;
    const value = window.localStorage.getItem(THEME_KEY);
    return value === DARK || value === LIGHT ? value : null;
  };

  const writeTheme = (theme) => {
    if (supportsStorage) {
      window.localStorage.setItem(THEME_KEY, theme);
    }
    document.documentElement.setAttribute('data-theme', theme);
    const isDark = theme === DARK;
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute(
      'aria-label',
      isDark ? '切换到白天模式' : '切换到黑夜模式'
    );
    themeLabel.textContent = isDark ? '☀️ 白天' : '🌙 黑夜';

    const themeColor = isDark ? '#0f1117' : '#ffffff';
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', themeColor);
  };

  const initTheme = readStoredTheme() || systemTheme();
  writeTheme(initTheme);

  themeButton.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === DARK ? LIGHT : DARK;
    writeTheme(next);
  });

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    if (readStoredTheme() === null) {
      writeTheme(systemTheme());
    }
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else {
    mediaQuery.addListener(handleSystemThemeChange);
  }
})();
