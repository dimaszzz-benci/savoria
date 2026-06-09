// === LOGIKA AUTENTIKASI EMAIL, REGISTER, DAN SIMULASI GOOGLE SIGN-IN ===

function showGoogleAccountSelector() {
  showModal('google-modal');
}

function selectGoogleAccount(email, name) {
  if (email === 'custom') {
    document.getElementById('custom-google-input').classList.remove('hidden');
    return;
  }
  closeModal('google-modal');
  proceedGoogleLogin(email, name);
}

function submitCustomGoogleAccount() {
  const email = sanitizeInput(document.getElementById('custom-gmail').value.trim());
  const name = sanitizeInput(document.getElementById('custom-gname').value.trim());
  
  if (!email || !name) {
    showToast("Email dan nama wajib diisi!", "error");
    return;
  }
  if (!email.endsWith('@gmail.com')) {
    showToast("Silakan gunakan email berekstensi @gmail.com", "error");
    return;
  }
  
  closeModal('google-modal');
  proceedGoogleLogin(email, name);
  
  // Reset input custom
  document.getElementById('custom-gmail').value = '';
  document.getElementById('custom-gname').value = '';
  document.getElementById('custom-google-input').classList.add('hidden');
}

function proceedGoogleLogin(email, name) {
  showLoader();
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    // Auto-register jika akun gmail baru pertama kali digunakan
    if (!users[email]) {
      const gAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
      users[email] = {
        name: name,
        email: email,
        password: "google-linked-account",
        avatar: gAvatar,
        provider: "google",
        role: "user",
        joinedAt: new Date().toISOString(),
        points: 0,
        memberLevel: "Bronze"
      };
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    currentUser = users[email];
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    handleLoginSuccess();
    hideLoader();
  }, 1000);
}

function loginWithEmail() {
  const email = sanitizeInput(document.getElementById('login-email').value.trim());
  const password = sanitizeInput(document.getElementById('login-password').value.trim());
  if (!email || !password) {
    showToast("Email dan password wajib diisi!", "error");
    return;
  }
  if (!isValidEmail(email)) {
    showToast("Format email tidak valid!", "error");
    return;
  }
  showLoader();
  setTimeout(() => {
    // Admin login bypass
    if (email === 'admin@savoria.com' && password === 'admin123') {
      currentUser = {
        name: "Admin Savoria",
        email: "admin@savoria.com",
        password: "admin123",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        provider: "email",
        role: "admin",
        points: 0,
        memberLevel: "Admin",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      handleLoginSuccess();
      hideLoader();
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[email];
    if (user && user.password === password) {
      currentUser = user;
      currentUser.role = currentUser.role || 'user';
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      handleLoginSuccess();
    } else {
      showToast("Email atau password Anda salah!", "error");
    }
    hideLoader();
  }, 800);
}

function registerAccount() {
  const name = sanitizeInput(document.getElementById('reg-name').value.trim());
  const email = sanitizeInput(document.getElementById('reg-email').value.trim());
  const password = sanitizeInput(document.getElementById('reg-password').value.trim());
  
  if (!name || !email || !password) {
    showToast("Semua kolom pendaftaran wajib diisi!", "error");
    return;
  }
  if (!isValidEmail(email)) {
    showToast("Format email tidak valid!", "error");
    return;
  }
  if (password.length < 6) {
    showToast("Kata sandi minimal 6 karakter!", "error");
    return;
  }
  
  showLoader();
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[email]) {
      showToast("Email ini sudah terdaftar!", "error");
      hideLoader();
      return;
    }
    
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    users[email] = {
      name: name,
      email: email,
      password: password,
      avatar: defaultAvatar,
      provider: "email",
      role: "user",
      joinedAt: new Date().toISOString(),
      points: 0,
      memberLevel: "Bronze"
    };
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = users[email];
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    handleLoginSuccess();
    hideLoader();
  }, 800);
}

function handleLoginSuccess() {
  const today = new Date().toDateString();
  if (lastLogin !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastLogin === yesterday.toDateString()) {
      loginStreak++;
    } else {
      loginStreak = 1;
    }
    localStorage.setItem('loginStreak', loginStreak);
    localStorage.setItem('lastLogin', today);
  }
  userPoints = currentUser.points || 0;
  localStorage.setItem('userPoints', userPoints);
  
  const savedUser = localStorage.getItem('currentUserEmail');
  if (savedUser !== currentUser.email) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('currentUserEmail', currentUser.email);
  }
  
  document.getElementById('auth-page').classList.add('hidden');
  document.getElementById('main-page').classList.remove('hidden');
  
  if (currentUser.role === 'admin') {
    document.getElementById('admin-btn').classList.remove('hidden');
  } else {
    document.getElementById('admin-btn').classList.add('hidden');
  }
  
  showToast(`Selamat datang kembali, ${currentUser.name}!`, 'success');
  updateProfileUI();
  updateCartUI();
  renderOrderHistory();
}

function showRegisterForm() {
  document.getElementById('auth-main-panel').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
}

function showLoginForm() {
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('auth-main-panel').classList.remove('hidden');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserEmail');
  document.getElementById('main-page').classList.add('hidden');
  document.getElementById('auth-page').classList.remove('hidden');
  document.getElementById('admin-btn').classList.add('hidden');
  closeModal('profile-modal');
  showToast('Anda telah keluar dari aplikasi', 'info');
}

function updateProfileUI() {
  if (!currentUser) return;
  document.getElementById('login-provider').textContent = currentUser.provider.charAt(0).toUpperCase() + currentUser.provider.slice(1);
  document.getElementById('user-points').textContent = userPoints;
  
  const tier = calculateMemberTier(userPoints);
  currentUser.memberLevel = tier.tier;
  document.getElementById('member-badge').textContent = tier.tier + " Member";
  document.getElementById('member-badge').style.background = tier.color;
  
  document.getElementById('edit-name').value = currentUser.name;
  document.getElementById('profile-avatar').src = currentUser.avatar;
  document.getElementById('streak-count').textContent = loginStreak;
  
  const streakDisplay = document.getElementById('streak-display');
  streakDisplay.innerHTML = '';
  for (let i = 1; i <= 7; i++) {
    const day = document.createElement('div');
    day.className = 'streak-day';
    if (i <= loginStreak) day.classList.add('active');
    day.textContent = i;
    streakDisplay.appendChild(day);
  }
}

function saveProfile() {
  const newName = sanitizeInput(document.getElementById('edit-name').value.trim());
  if (!newName) {
    showToast("Nama tidak boleh kosong!", "error");
    return;
  }
  currentUser.name = newName;
  saveUserToDB();
  updateProfileUI();
  showToast("Profil Anda berhasil diperbarui!", "success");
}

function previewAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      showToast("File harus berupa berkas gambar!", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      currentUser.avatar = e.target.result;
      saveUserToDB();
      document.getElementById('profile-avatar').src = e.target.result;
      showToast("Foto profil berhasil diperbarui!", "success");
    };
    reader.readAsDataURL(file);
  }
}

function saveUserToDB() {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  users[currentUser.email] = currentUser;
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}
