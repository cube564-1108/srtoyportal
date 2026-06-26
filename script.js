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

const authTabs = document.querySelectorAll('[data-auth-tab]');
const authPanels = document.querySelectorAll('[data-auth-panel]');

if (authTabs.length && authPanels.length) {
  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.authTab;

      authTabs.forEach((item) => item.classList.toggle('auth-tab--active', item === tab));
      authPanels.forEach((panel) => panel.classList.toggle('auth-pane--active', panel.dataset.authPanel === target));
    });
  });
}
