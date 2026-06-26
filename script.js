const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('mobile-menu--open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.addEventListener('click', (event) => {
    if (event.target === mobileMenu) {
      mobileMenu.classList.remove('mobile-menu--open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
