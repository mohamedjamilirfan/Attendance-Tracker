document.addEventListener('DOMContentLoaded', () => {
  // Navigation bar visibility based on scroll
  let lastScrollTop = 0; // Tracks the last scroll position
  const navBar = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 50) {
      // User is scrolling down and has scrolled past 50px, hide the navbar
      navBar.style.transform = 'translateY(-100%)';
    } else {
      // User is scrolling up, show the navbar
      navBar.style.transform = 'translateY(0)';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Avoid negative values
  });

  const toggleCheckbox = document.getElementById('hide-checkbox');
  const body = document.body;

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleCheckbox.checked = false;
  }

  toggleCheckbox.addEventListener('change', () => {
    if (!toggleCheckbox.checked) {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });
});
