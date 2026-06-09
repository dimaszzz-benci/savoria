// === LOGIKA SISTEM FILTER DAN RENDERING MENU ===

function getItemName(item) {
  return item.name[currentLang] || item.name.id || item.name.en || 'Item';
}

function filterMenu() {
  const searchTerm = document.getElementById('search-menu').value.toLowerCase().trim();
  const priceFilter = document.getElementById('filter-price').value;
  
  let items = menuData[currentCategory] || [];
  
  if (searchTerm) {
    items = items.filter(item => 
      getItemName(item).toLowerCase().includes(searchTerm) ||
      item.name.id.toLowerCase().includes(searchTerm) ||
      item.name.en.toLowerCase().includes(searchTerm) ||
      item.name.es.toLowerCase().includes(searchTerm)
    );
  }
  
  if (priceFilter !== 'all') {
    if (priceFilter === 'low') {
      items = items.filter(item => item.price < 50000);
    } else if (priceFilter === 'mid') {
      items = items.filter(item => item.price >= 50000 && item.price <= 100000);
    } else if (priceFilter === 'high') {
      items = items.filter(item => item.price > 100000);
    }
  }
  
  return items;
}

function renderMenu() {
  const items = filterMenu();
  const slider = document.getElementById('menu-slider');
  const t = translations[currentLang];
  const isAdmin = currentUser && currentUser.role === 'admin';
  
  if (items.length === 0) {
    slider.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-utensils fa-3x"></i>
        <h3>${t.emptyMenu}</h3>
        <p>${t.emptyMenuDesc}</p>
      </div>
    `;
    return;
  }
  
  slider.innerHTML = items.map(item => `
    <div class="slider-item">
      <img src="${item.img}" alt="${getItemName(item)}">
      <div class="slider-info">
        <h3>${getItemName(item)}</h3>
        <p class="price">Rp${item.price.toLocaleString()} ${item.stock !== undefined ? `(Stok: ${item.stock})` : ''}</p>
        ${isAdmin ? '' : `<button class="add-to-cart" onclick="addToCart(${item.id})">${t.addToCart}</button>`}
      </div>
    </div>
  `).join('');
}

function showMenu(category) {
  currentCategory = category;
  updateUITexts();
  renderMenu();
  window.scrollTo({ top: document.querySelector('.menu-section').offsetTop - 80, behavior: 'smooth' });
}

function updateUITexts() {
  const t = translations[currentLang];
  document.querySelector('.hero h1').textContent = t.welcome;
  document.querySelector('.hero p').textContent = t.desc;
  document.querySelectorAll('.hero-btn')[0].textContent = t.exploreFood;
  document.querySelectorAll('.hero-btn')[1].textContent = t.exploreDrink;
  document.querySelectorAll('.hero-btn')[2].textContent = t.dailySpin;
  
  let title = t.foodTitle;
  if (currentCategory === 'minuman') title = t.drinkTitle;
  else if (currentCategory === 'dessert') title = t.dessertTitle;
  else if (currentCategory === 'appetizer') title = t.appetizerTitle;
  
  document.getElementById('menu-title').textContent = title;
  document.querySelector('.section-header p').textContent = t.subtitle;
  localStorage.setItem('language', currentLang);
}

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  updateUITexts();
  renderMenu();
}
