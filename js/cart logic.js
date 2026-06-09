// === LOGIKA KERANJANG BELANJA, QRIS CODE GENERATOR, & STRUK PEMBAYARAN ===

function addToCart(itemId) {
  if (currentUser && currentUser.role === 'admin') {
    showToast("Admin tidak dapat membeli produk!", "error");
    return;
  }
  const allItems = [...menuData.makanan, ...menuData.minuman, ...menuData.dessert, ...menuData.appetizer];
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;
  if (item.stock <= 0) {
    showToast("Maaf, stok menu habis!", "error");
    return;
  }
  
  const existing = cart.find(i => i.id === itemId);
  if (existing) {
    if (existing.quantity >= item.stock) {
      showToast("Stok yang tersedia tidak mencukupi!", "error");
      return;
    }
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  showToast(`${getItemName(item)} telah ditambahkan ke keranjang`, 'success');
  
  userPoints += 10;
  currentUser.points = userPoints;
  saveUserToDB();
  updateProfileUI();
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  showToast("Item dihapus dari keranjang", "info");
}

function increaseQty(itemId) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;
  
  const allItems = [...menuData.makanan, ...menuData.minuman, ...menuData.dessert, ...menuData.appetizer];
  const menuStock = allItems.find(i => i.id === itemId)?.stock || 0;
  
  if (item.quantity >= menuStock) {
    showToast("Jumlah melebihi stok yang tersedia!", "error");
    return;
  }
  
  item.quantity += 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function decreaseQty(itemId) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;
  
  if (item.quantity <= 1) {
    removeFromCart(itemId);
    return;
  }
  
  item.quantity -= 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
  const cartItems = document.getElementById('cart-items');
  const emptyCart = document.getElementById('empty-cart');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '';
    emptyCart.classList.remove('hidden');
  } else {
    emptyCart.classList.add('hidden');
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item" style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #eee; align-items:center;">
        <img src="${item.img}" alt="${getItemName(item)}" style="width:55px; height:55px; object-fit:cover; border-radius:8px;">
        <div class="cart-info" style="flex:1;">
          <h4 style="font-size:0.95rem; font-weight:600;">${getItemName(item)}</h4>
          <p style="font-size:0.85rem; color:var(--primary); font-weight:700;">Rp${item.price.toLocaleString()}</p>
          <div class="quantity-control">
            <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
            <span style="font-size:0.9rem; font-weight:600;">${item.quantity}</span>
            <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
          </div>
        </div>
        <button class="cancel-order" style="padding: 6px 10px; font-size: 0.8rem;" onclick="removeFromCart(${item.id})" title="Hapus">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = `Rp${total.toLocaleString()}`;
  }
}

function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
  document.querySelector(`.payment-method[data-method="${method}"]`).classList.add('selected');
}

function confirmOrder() {
  if (cart.length === 0) {
    showToast('Keranjang belanja Anda masih kosong!', 'error');
    return;
  }
  
  showLoader();
  const allItems = [...menuData.makanan, ...menuData.minuman, ...menuData.dessert, ...menuData.appetizer];
  
  for (const cartItem of cart) {
    const menuIdx = allItems.findIndex(i => i.id === cartItem.id);
    if (menuIdx === -1 || allItems[menuIdx].stock < cartItem.quantity) {
      hideLoader();
      showToast(`Stok ${getItemName(cartItem)} tidak mencukupi!`, 'error');
      return;
    }
  }
  
  setTimeout(() => {
    for (const cartItem of cart) {
      let category = '';
      if (menuData.makanan.some(i => i.id === cartItem.id)) category = 'makanan';
      else if (menuData.minuman.some(i => i.id === cartItem.id)) category = 'minuman';
      else if (menuData.dessert.some(i => i.id === cartItem.id)) category = 'dessert';
      else if (menuData.appetizer.some(i => i.id === cartItem.id)) category = 'appetizer';
      
      const targetItem = menuData[category]?.find(i => i.id === cartItem.id);
      if (targetItem) {
        targetItem.stock -= cartItem.quantity;
      }
    }
    localStorage.setItem('menuData', JSON.stringify(menuData));
    
    const orderData = {
      id: 'ORD' + Date.now(),
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      payment: selectedPayment,
      customer: currentUser ? currentUser.name : 'Pelanggan Umum',
      timestamp: new Date().toLocaleString('id-ID'),
      status: 'Baru'
    };
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    renderOrderHistory();
    
    const receiptContent = document.getElementById('receipt-content');
    receiptContent.innerHTML = `
      <h3>SAVORIA RESTO</h3>
      <p style="font-size:0.8rem; color:#666;">Premium Culinary Experience</p>
      <p style="font-size:0.8rem; margin-top:5px;">${orderData.timestamp}</p>
      <p style="font-size:0.85rem; font-weight:bold;">ID Pesanan: ${orderData.id}</p>
      <hr>
      <div style="text-align: left; font-size: 0.85rem;">
        ${orderData.items.map(item => `
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>${getItemName(item)} x${item.quantity}</span>
            <span>Rp${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        `).join('')}
      </div>
      <hr>
      <p style="font-size: 1.05rem; font-weight: bold; text-align: right;">Total: Rp${orderData.total.toLocaleString()}</p>
      <p style="font-size: 0.85rem; text-align: left; margin-top: 10px;">Metode: ${selectedPayment === 'qris' ? 'QRIS' : selectedPayment === 'cash' ? 'Tunai' : 'Debit/Kredit'}</p>
      <canvas id="qr-code"></canvas>
      <p style="font-size:0.8rem; color:#888; margin-top:10px;">Silakan tunjukkan QR ini ke kasir.</p>
    `;
    
    setTimeout(() => {
      const qrCanvas = document.getElementById('qr-code');
      if (qrCanvas) {
        new QRious({
          element: qrCanvas,
          value: JSON.stringify({ id: orderData.id, total: orderData.total }),
          size: 150
        });
      }
    }, 150);
    
    hideLoader();
    closeModal('checkout-modal');
    showModal('receipt-modal');
    showToast('Pesanan Anda berhasil dikonfirmasi!', 'success');
  }, 1000);
}

function printReceipt() {
  const printContent = document.getElementById('receipt-content').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Struk Pembayaran SAVORIA</title>
        <style>
          body { font-family: monospace; text-align: center; padding: 20px; line-height: 1.4; color: #000; }
          hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
          canvas { display: none; }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function renderOrderHistory() {
  if (!currentUser) return;
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const userOrders = orders.filter(o => o.customer === currentUser.name).sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  const historyList = document.getElementById('order-history-list');
  if (userOrders.length === 0) {
    historyList.innerHTML = '<p style="text-align:center; color:#888;">Belum ada pesanan</p>';
    return;
  }
  
  historyList.innerHTML = userOrders.slice(0, 5).map(order => `
    <div class="order-item-history">
      <strong>ID: ${order.id}</strong><br>
      Total: Rp${order.total.toLocaleString()}<br>
      Tanggal: ${order.timestamp}<br>
      Status: ${order.status || 'Selesai'}
    </div>
  `).join('');
}
