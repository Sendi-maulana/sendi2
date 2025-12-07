// auth.js - Fungsi autentikasi untuk halaman login

// Fungsi untuk menangani proses login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validasi input
    if (!email || !password) {
        alert('Silakan masukkan email/NIM dan password Anda');
        return;
    }
    
    // Simulasi proses login
    // Di implementasi nyata, ini akan menghubungi API server
    simulateLogin(email, password);
}

// Simulasi proses login
function simulateLogin(email, password) {
    // Data dummy pengguna - dalam implementasi nyata data ini akan dari server
    const dummyUser = {
        id: 1,
        name: "Budi Santoso",
        email: "budi@example.com",
        nim: "1234567890",
        faculty: "Fakultas Teknologi Informasi",
        major: "Informatika"
    };
    
    // Simulasi delay untuk proses login
    setTimeout(() => {
        // Untuk demo, kita terima semua kombinasi email/password
        // Di implementasi nyata, ini akan dicek di server
        console.log(`Login berhasil untuk: ${email}`);
        
        // Simpan data pengguna ke localStorage
        localStorage.setItem('currentUser', JSON.stringify(dummyUser));
        
        // Arahkan ke halaman beranda
        window.location.href = 'home.html';
    }, 1000);
}

// Fungsi untuk menangani lupa password
function handleForgotPassword() {
    alert('Fitur lupa password akan diarahkan ke halaman reset password');
    // Di implementasi nyata, ini akan mengarahkan ke halaman reset password
}

// Fungsi untuk menangani pendaftaran
function handleRegister() {
    alert('Fitur pendaftaran akan diarahkan ke halaman registrasi');
    // Di implementasi nyata, ini akan mengarahkan ke halaman registrasi
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tasks');
    window.location.href = 'login.html';
}

// Fungsi untuk memeriksa apakah pengguna sudah login
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && window.location.pathname.includes('home.html')) {
        // Jika tidak login dan mencoba mengakses halaman home, arahkan ke login
        window.location.href = 'login.html';
    }
}

// Inisialisasi fungsi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan event listener untuk form login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Tambahkan event listener untuk link lupa password
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleForgotPassword();
        });
    }
    
    // Tambahkan event listener untuk link daftar
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // Periksa otentikasi
    checkAuth();
});

// Ekspor fungsi agar bisa digunakan di halaman lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { logout, checkAuth };
}