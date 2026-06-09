// === KONFIGURASI TRANSLATION & DATA STATIS MENU ===

const rewardIcons = {
  "Diskon 10%": "fas fa-percent",
  "Gratis minuman": "fas fa-glass-martini-alt",
  "Double poin": "fas fa-coins",
  "Voucher ulang tahun": "fas fa-gift",
  "Gratis ongkir": "fas fa-shipping-fast",
  "Akses eksklusif": "fas fa-crown"
};

const translations = {
  id: {
    welcome: "Selamat Datang di SAVORIA!",
    desc: "Restoran premium dengan bahan lokal & teknik internasional. Nikmati hidangan terbaik kami.",
    exploreFood: "Jelajahi Makanan",
    exploreDrink: "Jelajahi Minuman",
    dailySpin: "Putar Hadiah Harian",
    foodTitle: "Menu Makanan Premium",
    drinkTitle: "Koleksi Minuman Premium",
    dessertTitle: "Dessert Premium",
    appetizerTitle: "Appetizer Premium",
    subtitle: "Hidangan lezat dari koki berpengalaman dengan bahan segar pilihan",
    addToCart: "Tambah ke Keranjang",
    cart: "Keranjang Belanja",
    emptyCart: "Keranjang Anda kosong!",
    total: "Total:",
    payNow: "Bayar Sekarang",
    profile: "Profil Saya",
    settings: "Pengaturan",
    logout: "Keluar",
    spinReward: "Hadiah Harian",
    spinMsg: "Klaim hadiah harian Anda!",
    spinResult: "Anda mendapat: ",
    rewards: [
      "Diskon 10% untuk pesanan berikutnya!",
      "Gratis minuman signature!",
      "Double poin hari ini!",
      "Voucher ulang tahun spesial!",
      "Gratis ongkir untuk pengiriman!",
      "Akses eksklusif ke menu baru!"
    ],
    emptyMenu: "Menu sedang dalam pembaruan",
    emptyMenuDesc: "Silakan cek kembali nanti"
  },
  en: {
    welcome: "Welcome to SAVORIA!",
    desc: "Premium restaurant with local ingredients & international techniques. Enjoy our finest dishes.",
    exploreFood: "Explore Food",
    exploreDrink: "Explore Drinks",
    dailySpin: "Daily Spin Reward",
    foodTitle: "Premium Food Menu",
    drinkTitle: "Premium Drink Collection",
    dessertTitle: "Premium Dessert",
    appetizerTitle: "Premium Appetizer",
    subtitle: "Delicious dishes from experienced chefs with fresh selected ingredients",
    addToCart: "Add to Cart",
    cart: "Shopping Cart",
    emptyCart: "Your cart is empty!",
    total: "Total:",
    payNow: "Pay Now",
    profile: "My Profile",
    settings: "Settings",
    logout: "Logout",
    spinReward: "Daily Reward",
    spinMsg: "Claim your daily reward!",
    spinResult: "You got: ",
    rewards: [
      "10% off your next order!",
      "Free signature drink!",
      "Double points today!",
      "Special birthday voucher!",
      "Free delivery!",
      "Exclusive access to new menu!"
    ],
    emptyMenu: "Menu is being updated",
    emptyMenuDesc: "Please check again later"
  },
  es: {
    welcome: "¡Bienvenido a SAVORIA!",
    desc: "Restaurante premium con ingredientes locales y técnicas internacionales. Disfruta nuestros mejores platos.",
    exploreFood: "Explorar Comida",
    exploreDrink: "Explorar Bebidas",
    dailySpin: "¡Recompensa Diaria!",
    foodTitle: "Menú de Comida Premium",
    drinkTitle: "Colección de Bebidas Premium",
    dessertTitle: "Postres Premium",
    appetizerTitle: "Entrantes Premium",
    subtitle: "Platos deliciosos de chefs experimentados con ingredientes frescos seleccionados",
    addToCart: "Añadir al Carrito",
    cart: "Carrito de Compras",
    emptyCart: "¡Tu carrito está vacío!",
    total: "Total:",
    payNow: "Pagar Ahora",
    profile: "Mi Perfil",
    settings: "Ajustes",
    logout: "Cerrar Sesión",
    spinReward: "Recompensa Diaria",
    spinMsg: "¡Reclama tu recompensa diaria!",
    spinResult: "¡Obtuviste: ",
    rewards: [
      "¡10% de descuento en tu próximo pedido!",
      "¡Bebida signature gratis!",
      "¡Puntos dobles hoy!",
      "¡Vale de cumpleaños especial!",
      "¡Envío gratis!",
      "¡Acceso exclusivo al nuevo menú!"
    ],
    emptyMenu: "El menú se está actualizando",
    emptyMenuDesc: "Por favor, vuelve a comprobar más tarde"
  }
};

let currentLang = localStorage.getItem('language') || 'id';
let currentCategory = 'makanan';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;
let lastLogin = localStorage.getItem('lastLogin') || '';
let loginStreak = parseInt(localStorage.getItem('loginStreak')) || 0;
let selectedPayment = 'qris';
let isSpinning = false;
let lastSpin = localStorage.getItem('lastSpin') || 0;

// === MENU DATA ===
let menuData = JSON.parse(localStorage.getItem('menuData')) || {
  makanan: [
    { id: 1, name: { id: "Truffle Mushroom Risotto", en: "Truffle Mushroom Risotto", es: "Risotto de Champiñones con Trufa" }, price: 95000, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 10 },
    { id: 2, name: { id: "Grilled Wagyu Steak", en: "Grilled Wagyu Steak", es: "Filete de Wagyu a la Parrilla" }, price: 185000, img: "https://images.unsplash.com/photo-1626082927389-6cd68c5d6a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 8 },
    { id: 3, name: { id: "Seafood Paella", en: "Seafood Paella", es: "Paella de Mariscos" }, price: 130000, img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 12 },
    { id: 4, name: { id: "Duck Confit with Orange Glaze", en: "Duck Confit with Orange Glaze", es: "Confit de Pato con Glaseado de Naranja" }, price: 165000, img: "https://images.unsplash.com/photo-1603557386395-8d6a9e0e8c4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 6 },
    { id: 5, name: { id: "Lobster Thermidor", en: "Lobster Thermidor", es: "Langosta Thermidor" }, price: 220000, img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 5 },
    { id: 6, name: { id: "Beef Wellington", en: "Beef Wellington", es: "Wellington de Ternera" }, price: 195000, img: "https://images.unsplash.com/photo-1603557386395-8d6a9e0e8c4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 7 }
  ],
  minuman: [
    { id: 7, name: { id: "Rose Lychee Sparkler", en: "Rose Lychee Sparkler", es: "Refresco de Lichi con Rosa" }, price: 32000, img: "https://images.unsplash.com/photo-1600271886742-f049cd54a333?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 20 },
    { id: 8, name: { id: "Cold Brew Coffee", en: "Cold Brew Coffee", es: "Café Cold Brew" }, price: 28000, img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 25 },
    { id: 9, name: { id: "Mango Passion Smoothie", en: "Mango Passion Smoothie", es: "Batido de Mango y Maracuyá" }, price: 35000, img: "https://images.unsplash.com/photo-1594824478907-888b2f9c9a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 18 },
    { id: 10, name: { id: "Classic Mojito", en: "Classic Mojito", es: "Mojito Clásico" }, price: 42000, img: "https://images.unsplash.com/photo-1595212868210-387d7a52b85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 15 },
    { id: 11, name: { id: "Matcha Latte", en: "Matcha Latte", es: "Lácteo de Matcha" }, price: 30000, img: "https://images.unsplash.com/photo-1600271886742-f049cd54a333?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 22 },
    { id: 12, name: { id: "Sparkling Elderflower", en: "Sparkling Elderflower", es: "Flor de Saúco Espumosa" }, price: 38000, img: "https://images.unsplash.com/photo-1594824478907-888b2f9c9a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 20 }
  ],
  dessert: [
    { id: 13, name: { id: "Chocolate Lava Cake", en: "Chocolate Lava Cake", es: "Pastel de Chocolate con Relleno Líquido" }, price: 45000, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 15 },
    { id: 14, name: { id: "Tiramisu", en: "Tiramisu", es: "Tiramisú" }, price: 40000, img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 12 },
    { id: 15, name: { id: "Crème Brûlée", en: "Crème Brûlée", es: "Crema Catalana" }, price: 38000, img: "https://images.unsplash.com/photo-1603533581963-3553067b773a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 10 }
  ],
  appetizer: [
    { id: 16, name: { id: "Bruschetta", en: "Bruschetta", es: "Bruschetta" }, price: 35000, img: "https://images.unsplash.com/photo-1673925147377-f9d9e1657085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 20 },
    { id: 17, name: { id: "Calamari Fritti", en: "Calamari Fritti", es: "Calamares Fritos" }, price: 42000, img: "https://images.unsplash.com/photo-1626082927389-6cd68c5d6a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", stock: 15 }
  ]
};
