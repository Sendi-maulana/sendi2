// profile.js - Fungsi untuk halaman profil pengguna

// Data dummy untuk percobaan
let currentUser = null;

// DOM Elements
const userNameEl = document.getElementById('user-name');
const userIdEl = document.getElementById('user-id');
const userMajorEl = document.getElementById('user-major');
const darkThemeToggle = document.getElementById('dark-theme-toggle');
const notificationsToggle = document.getElementById('notifications-toggle');
const logoutBtn = document.getElementById('logout-btn');

// Fungsi untuk menyimpan tema ke localStorage
function saveTheme(isDark) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Fungsi untuk menerapkan tema
function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Toggle tema (terang/gelap)
function toggleTheme() {
    const isDark = darkThemeToggle.checked;
    applyTheme(isDark);
    saveTheme(isDark);
}

// Toggle notifikasi
function toggleNotifications() {
    const notificationsEnabled = notificationsToggle.checked;
    // Dalam implementasi nyata, ini akan menyimpan preferensi notifikasi ke server
    console.log('Notifikasi di-' + (notificationsEnabled ? 'aktifkan' : 'nonaktifkan'));
}

// Logout
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Hapus data pengguna dari localStorage
        localStorage.removeItem('currentUser');
        
        // Arahkan ke halaman login
        window.location.href = 'login.html';
    }
}

// Fungsi untuk memuat data pengguna
function loadCurrentUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // Tampilkan informasi pengguna
        if (userNameEl) userNameEl.textContent = currentUser.name || 'Pengguna';
        if (userIdEl) userIdEl.textContent = `NIM: ${currentUser.nim || 'Tidak tersedia'}`;
        if (userMajorEl) userMajorEl.textContent = `${currentUser.major || 'Program Studi'}, ${currentUser.faculty || 'Fakultas'}`;
    } else {
        // Jika tidak ada data pengguna, arahkan ke halaman login
        window.location.href = 'login.html';
    }
}

// Muat pengaturan dari localStorage
function loadSettings() {
    // Muat tema
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    darkThemeToggle.checked = isDark;
    applyTheme(isDark);
    
    // Muat pengaturan notifikasi
    const savedNotifications = localStorage.getItem('notifications') || 'true';
    notificationsToggle.checked = savedNotifications === 'true';
}

// Simpan pengaturan notifikasi
function saveNotificationSetting() {
    const notificationsEnabled = notificationsToggle.checked;
    localStorage.setItem('notifications', notificationsEnabled);
}

// Setup event listeners
function setupEventListeners() {
    // Event listener untuk toggle tema
    if (darkThemeToggle) {
        darkThemeToggle.addEventListener('change', toggleTheme);
    }
    
    // Event listener untuk toggle notifikasi
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', () => {
            toggleNotifications();
            saveNotificationSetting();
        });
    }
    
    // Event listener untuk tombol logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Event listener untuk item pengaturan
    const settingItems = document.querySelectorAll('.setting-item:not(#logout-btn)');
    settingItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('input, button')) {
                const settingText = this.querySelector('div span').textContent;
                alert(`Fitur "${settingText}" akan segera tersedia di versi berikutnya`);
            }
        });
    });
}

// Inisialisasi aplikasi
function initProfile() {
    // Muat data pengguna
    loadCurrentUser();
    
    // Muat pengaturan
    loadSettings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Tambahkan event listener untuk navigasi
    setupNavigation();
}

// Setup navigasi antar halaman
function setupNavigation() {
    // Tambahkan event listener ke semua link navigasi
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!this.classList.contains('active')) {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    window.location.href = href;
                }
            }
        });
    });
}

// Inisialisasi aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    initProfile();
});