(() => {
  let theme;
  try { theme = localStorage.getItem('code-geeks-theme'); } catch {}
  document.documentElement.dataset.theme = theme === 'dark' || theme === 'light'
    ? theme : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
})();
