(() => {
  try {
    const storedTheme = localStorage.getItem('portfolio_theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  } catch (error) {
    // noop
  }
})();
