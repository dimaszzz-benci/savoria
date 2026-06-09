// === LOGIKA MANAGEMENT MENU ADMIN & DAFTAR TRANSAKSI ===

function showAdminPanel() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast("Akses khusus admin ditolak!", "error");
    return;
  }
  showModal('admin-modal');
}

function renderAdminMenuList() {
  const category = document.getElementById('admin-category').value;
  const items = menuData[category] || [];
  const listEl = document.getElementById('admin-menu-list');
  if (items.length === 0) {
    listEl.innerHTML = '<p style="text-align:center; color:#888;">Tidak ada item dalam kategori ini</p>';
    return;
  }
  listEl.innerHTML = items.map(item => `
    <div class="admin-item">
      <div style="font-size:0.9rem;">
        <strong>${item.name.id}</strong><br>
        <span style="color:var(--primary); font-weight:bold;">Rp${item.price.toLocaleString()}</span> | Stok: ${item.stock} | ID: ${item.id}
      </div>
      <div class="admin-actions">
        <button class="admin-btn edit" onclick="editMenuItem(${item.id}, '${category}')">Edit</button>
        <button class="admin-btn delete" onclick="deleteMenuItem(${item.id}, '${category}')">Hapus</button>
      </div>
    </div>
  `).join('');
}

function renderAdminOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const listEl = document.getElementById('admin-orders-list');
  if (orders.length === 0) {
    listEl.innerHTML = '<p style="text-align:center; color:#888;">Belum ada pesanan masuk.</p>';
    return;
  }
  listEl.innerHTML = orders.map(order => `
    <div class="order-item" style="font-size:0.85rem;">
      <div>
        <strong>ID: ${order.id}</strong><br>
        Pelanggan: ${order.customer}<br>
        Metode: ${order.payment.toUpperCase()}<br>
        Total: Rp${order.total.toLocaleString()} | Status: ${order.status}<br>
        <span style="color:#666;">Items: ${order.items.map(i => `${getItemName(i)} (x${i.quantity})`).join(', ')}</span>
      </div>
    </div>
  `).join('');
}

function saveMenuItem() {
  const category = document.getElementById('admin-category').value;
  const nameId = sanitizeInput(document.getElementById('admin-item-name-id').value.trim());
  const nameEn = sanitizeInput(document.getElementById('admin-item-name-en').value.trim());
  const nameEs = sanitizeInput(document.getElementById('admin-item-name-es').value.trim());
  const price = parseInt(document.getElementById('admin-item-price').value);
  const img = sanitizeInput(document.getElementById('admin-item-img').value.trim());
  const stock = parseInt(document.getElementById('admin-item-stock').value);
  
  if (!nameId || !nameEn || !nameEs || isNaN(price) || !img || isNaN(stock) || stock < 0) {
    showToast("Harap isi semua kolom formulir dengan benar!", "error");
    return;
  }
  
  let nextId = 1;
  const allCategories = ['makanan', 'minuman', 'dessert', 'appetizer'];
  const allIds = [];
  allCategories.forEach(cat => {
    if (menuData[cat]) {
      menuData[cat].forEach(item => allIds.push(item.id));
    }
  });
  if (allIds.length > 0) {
    nextId = Math.max(...allIds) + 1;
  }
  
  const newItem = {
    id: nextId,
    name: { id: nameId, en: nameEn, es: nameEs },
    price: price,
    img: img,
    stock: stock,
    createdAt: new Date().toISOString()
  };
  
  if (!menuData[category]) {
    menuData[category] = [];
  }
  menuData[category].push(newItem);
  localStorage.setItem('menuData', JSON.stringify(menuData));
  
  renderAdminMenuList();
  renderMenu();
  showToast("Item menu berhasil disimpan!", "success");
  
  // Clear inputs
  document.getElementById('admin-item-name-id').value = '';
  document.getElementById('admin-item-name-en').value = '';
  document.getElementById('admin-item-name-es').value = '';
  document.getElementById('admin-item-price').value = '';
  document.getElementById('admin-item-img').value = '';
  document.getElementById('admin-item-stock').value = '10';
}

function editMenuItem(id, category) {
  const item = menuData[category].find(i => i.id === id);
  if (!item) return;
  
  document.getElementById('admin-category').value = category;
  document.getElementById('admin-item-name-id').value = item.name.id;
  document.getElementById('admin-item-name-en').value = item.name.en;
  document.getElementById('admin-item-name-es').value = item.name.es;
  document.getElementById('admin-item-price').value = item.price;
  document.getElementById('admin-item-img').value = item.img;
  document.getElementById('admin-item-stock').value = item.stock;
  
  menuData[category] = menuData[category].filter(i => i.id !== id);
  localStorage.setItem('menuData', JSON.stringify(menuData));
  renderAdminMenuList();
  showToast("Edit mode aktif. Jangan lupa simpan kembali!", "info");
}

function deleteMenuItem(id, category) {
  if (!confirm("Hapus item ini secara permanen?")) return;
  menuData[category] = menuData[category].filter(i => i.id !== id);
  localStorage.setItem('menuData', JSON.stringify(menuData));
  renderAdminMenuList();
  renderMenu();
  showToast("Item berhasil dihapus!", "success");
}
