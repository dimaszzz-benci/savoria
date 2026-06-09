// === INSTAN KONTROL SLIDER, SPIN WHEEL, MODAL UTAMA, DAN EVENT BINDINGS ===

function showModal(id) {
  document.getElementById(id).classList.add('show');
  if (id === 'checkout-modal') updateCartUI();
  if (id === 'profile-modal') {
    updateProfileUI();
    renderOrderHistory();
  }
  if (id === 'admin-modal') {
    renderAdminMenuList();
    renderAdminOrders();
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

function showCheckout() { showModal('checkout-modal'); }
function showProfile() {
  if (!currentUser) {
    showToast('Silakan masuk terlebih dahulu', 'error');
    return;
  }
  showModal('profile-modal');
}

// === SPIN WHEEL LOGIC ===
function showSpinWheel() {
  if (!currentUser) {
    showToast('Harap masuk terlebih dahulu!', 'error');
    return;
  }
  const now = Date.now();
  if (now - lastSpin < 86400000) {
    showToast("Anda sudah memutar hari ini! Kembali lagi besok.", "error");
    return;
  }
  showModal('spin-modal');
}

function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  const spinBtn = document.querySelector('.spin-btn');
  spinBtn.disabled = true;
  const wheel = document.getElementById('spin-wheel');
  const resultEl = document.getElementById('spin-result');
  const t = translations[currentLang];
  resultEl.innerHTML = "";
  
  const rotations = 5 + Math.random() * 5;
  const deg = rotations * 360 + Math.floor(Math.random() * 360);
  wheel.style.transform = `rotate(${deg}deg)`;
  
  setTimeout(() => {
    const rewardIndex = Math.floor(Math.random() * t.rewards.length);
    const finalReward = t.rewards[rewardIndex];
    let iconClass = "fas fa-gift";
    
    if (finalReward.includes("Diskon") || finalReward.includes("off")) iconClass = rewardIcons["Diskon 10%"];
    else if (finalReward.includes("minuman") || finalReward.includes("drink")) iconClass = rewardIcons["Gratis minuman"];
    else if (finalReward.includes("poin") || finalReward.includes("points")) iconClass = rewardIcons["Double poin"];
    else if (finalReward.includes("ulang tahun") || finalReward.includes("birthday")) iconClass = rewardIcons["Voucher ulang tahun"];
    else if (finalReward.includes("ongkir") || finalReward.includes("delivery")) iconClass = rewardIcons["Gratis ongkir"];
    else if (finalReward.includes("akses") || finalReward.includes("access")) iconClass = rewardIcons["Akses eksklusif"];
    
    resultEl.innerHTML = `<i class="${iconClass}"></i> ${t.spinResult} ${finalReward}`;
    
    userPoints += 50;
    currentUser.points = userPoints;
    saveUserToDB();
    updateProfileUI();
    
    lastSpin = Date.now();
    localStorage.setItem('lastSpin', lastSpin);
    spinBtn.disabled = false;
    isSpinning = false;
  }, 2500);
}

// === INTERACTION BINDINGS ===
document.getElementById('search-menu').addEventListener('input', renderMenu);
document.getElementById('filter-price').addEventListener('change', renderMenu);

document.getElementById('prev-btn').addEventListener('click', () => {
  document.getElementById('menu-slider').scrollBy({ left: -280, behavior: 'smooth' });
});
document.getElementById('next-btn').addEventListener('click', () => {
  document.getElementById('menu-slider').scrollBy({ left: 280, behavior: 'smooth' });
});

// ESC Key closes active modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach(modal => modal.classList.remove('show'));
  }
});

// Click outside modal container to close
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});

// === DOM INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
  currentLang = localStorage.getItem('language') || 'id';
  currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  userPoints = parseInt(localStorage.getItem('userPoints')) || 0;
  lastLogin = localStorage.getItem('lastLogin') || '';
  loginStreak = parseInt(localStorage.getItem('loginStreak')) || 0;
  lastSpin = localStorage.getItem('lastSpin') || 0;
  menuData = JSON.parse(localStorage.getItem('menuData')) || menuData;
  
  updateUITexts();
  renderMenu();
  updateCartUI();
  
  if (currentUser) {
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('main-page').classList.remove('hidden');
    if (currentUser.role === 'admin') {
      document.getElementById('admin-btn').classList.remove('hidden');
    }
    updateProfileUI();
    renderOrderHistory();
  }
});
