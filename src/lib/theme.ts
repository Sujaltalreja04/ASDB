export function initTheme(): 'dark' | 'light' {
  const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
  const preference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const active = saved || preference;
  setThemeClass(active);
  return active;
}

export function setThemeClass(theme: 'dark' | 'light') {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  localStorage.setItem('theme', theme);
}
