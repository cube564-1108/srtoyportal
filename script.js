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

const PROJECT_STORAGE_KEY = 'stroyportal_projects';

const defaultProjects = [
  {
    id: 1,
    title: 'Загородный дом в Зельницево',
    type: 'Жилой дом',
    area: 120,
    floors: 2,
    rooms: 4,
    price: 3000000,
    city: 'Новосибирск',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    description: 'Уютный загородный дом с современной планировкой и просторной террасой.'
  },
  {
    id: 2,
    title: 'Современный коттедж на окраине',
    type: 'Коттедж',
    area: 145,
    floors: 2,
    rooms: 5,
    price: 4200000,
    city: 'Новосибирск',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    description: 'Яркий коттедж с панорамными окнами и грамотным зонированием.'
  },
  {
    id: 3,
    title: 'Таунхаус с отделкой под ключ',
    type: 'Таунхаус',
    area: 95,
    floors: 2,
    rooms: 3,
    price: 2600000,
    city: 'Новосибирск',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    description: 'Компактный таунхаус в экологичном районе с собственным садом.'
  }
];

function loadProjects() {
  const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(defaultProjects));
    return defaultProjects.slice();
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return defaultProjects.slice();
  }
}

function saveProjects(projects) {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

function formatPrice(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function renderProjects(projects) {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  if (!projects.length) {
    grid.innerHTML = '<div class="empty-state">Проекты не найдены. Попробуйте изменить фильтры.</div>';
    return;
  }

  grid.innerHTML = projects.map((project) => `
    <article class="project-card">
      <div class="project-card__image" style="background-image: url('${project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'}')"></div>
      <div class="project-card__body">
        <a href="#" class="project-card__title">${project.title}</a>
        <p class="project-card__meta">${project.type}, ${project.area} м², ${project.rooms} комн., ${project.floors} эт.</p>
        <p class="project-card__meta">${project.city}</p>
        <p class="project-card__description">${project.description || 'Описание проекта отсутствует.'}</p>
        <div class="project-card__footer">
          <span>от ${formatPrice(project.price)} руб.</span>
          <button class="project-card__button">В избранное</button>
        </div>
      </div>
    </article>
  `).join('');
}

function getSelectedOptionText(id) {
  const select = document.getElementById(id);
  return select ? select.value : 'Любой';
}

function parseNumber(str) {
  const match = str.replace(/\s/g, '').match(/\d+/);
  return match ? Number(match[0]) : null;
}

function filterProjects(projects) {
  const type = getSelectedOptionText('filterType');
  const floors = getSelectedOptionText('filterFloors');
  const priceFrom = parseNumber(getSelectedOptionText('filterPriceFrom'));
  const priceTo = parseNumber(getSelectedOptionText('filterPriceTo'));
  const areaFrom = parseNumber(getSelectedOptionText('filterAreaExact')) || parseNumber(getSelectedOptionText('filterAreaFrom'));
  const areaTo = parseNumber(getSelectedOptionText('filterAreaTo'));
  const rooms = getSelectedOptionText('filterRooms');

  return projects.filter((project) => {
    if (type !== 'Любой' && project.type !== type) return false;
    if (floors !== 'Любая') {
      if (!project.floors || `${project.floors} этаж` !== floors) return false;
    }
    if (priceFrom && project.price < priceFrom) return false;
    if (priceTo && project.price > priceTo) return false;
    if (areaFrom && project.area < areaFrom) return false;
    if (areaTo && project.area > areaTo) return false;
    if (rooms !== 'Любое') {
      if (!project.rooms) return false;
      if (rooms === '4+' && project.rooms < 4) return false;
      if (rooms !== '4+' && project.rooms !== Number(rooms)) return false;
    }
    return true;
  });
}

function applyFilters() {
  const projects = loadProjects();
  const filtered = filterProjects(projects);
  renderProjects(filtered);
}

function resetFilters() {
  const selects = document.querySelectorAll('#projectFilters select');
  selects.forEach((select) => { if (select.options.length) select.selectedIndex = 0; });
  applyFilters();
}

function renderAdminList() {
  const list = document.getElementById('adminProjectList');
  if (!list) return;

  const projects = loadProjects();
  list.innerHTML = projects.map((project) => `
    <div class="admin-item">
      <div>
        <strong>${project.title}</strong>
        <p>${project.type}, ${project.area} м², ${project.rooms} комн., ${project.floors} эт., ${project.city}</p>
      </div>
      <button class="button button--outline admin-remove" data-id="${project.id}">Удалить</button>
    </div>
  `).join('');

  list.querySelectorAll('.admin-remove').forEach((button) => {
    button.addEventListener('click', (event) => {
      const projectId = Number(event.target.dataset.id);
      const projects = loadProjects().filter((project) => project.id !== projectId);
      saveProjects(projects);
      renderAdminList();
      applyFilters();
    });
  });
}

function addProjectFromAdmin(event) {
  if (event) event.preventDefault();

  const title = document.getElementById('projectTitle')?.value.trim();
  const type = document.getElementById('projectType')?.value;
  const area = parseNumber(document.getElementById('projectArea')?.value) || 0;
  const price = parseNumber(document.getElementById('projectPrice')?.value) || 0;
  const city = document.getElementById('projectCity')?.value.trim();
  const image = document.getElementById('projectImage')?.value.trim();
  const description = document.getElementById('projectDescription')?.value.trim();

  if (!title || !type || !area || !price || !city) {
    alert('Заполните, пожалуйста, все обязательные поля.');
    return;
  }

  const projects = loadProjects();
  const newProject = {
    id: Date.now(),
    title,
    type,
    area,
    floors: 2,
    rooms: 4,
    price,
    city,
    image: image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    description: description || 'Описание проекта будет добавлено позже.'
  };

  projects.unshift(newProject);
  saveProjects(projects);
  renderAdminList();
  applyFilters();
  document.getElementById('projectForm')?.reset();
}

function initProjectPage() {
  if (document.getElementById('projectGrid')) {
    renderProjects(loadProjects());
    document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters);
  }
}

function initAdminPage() {
  if (document.getElementById('projectForm')) {
    document.getElementById('projectForm').addEventListener('submit', addProjectFromAdmin);
    renderAdminList();
  }
}

initProjectPage();
initAdminPage();
