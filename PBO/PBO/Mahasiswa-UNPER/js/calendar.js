// calendar.js - Fungsi untuk halaman kalender

// Data dummy untuk percobaan
let tasks = [];
let currentUser = null;

// DOM Elements
const calendarDaysEl = document.getElementById('calendar-days');
const currentMonthYearEl = document.getElementById('current-month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const selectedDateEl = document.getElementById('selected-date');
const dailyTasksListEl = document.getElementById('daily-tasks-list');
const addTaskBtn = document.getElementById('add-task-btn');

// State untuk kalender
let currentDate = new Date();
let selectedDate = new Date();

// Format tanggal ke bahasa Indonesia
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
}

// Format tanggal singkat
function formatDateShort(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Format bulan dan tahun untuk ditampilkan
function formatMonthYear(date) {
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

// Periksa apakah tanggal adalah hari ini
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Periksa apakah dua tanggal sama
function isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

// Dapatkan tugas berdasarkan tanggal
function getTasksByDate(date) {
    const dateStr = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    return tasks.filter(task => {
        return task.deadlineDate === dateStr && task.status !== 'completed';
    });
}

// Render kalender
function renderCalendar() {
    // Kosongkan container hari
    calendarDaysEl.innerHTML = '';
    
    // Dapatkan tanggal pertama dan terakhir bulan ini
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Dapatkan hari pertama bulan (0 = Minggu, 1 = Senin, dst)
    const firstDayOfWeek = firstDay.getDay();
    
    // Dapatkan jumlah hari dalam bulan
    const daysInMonth = lastDay.getDate();
    
    // Tampilkan bulan dan tahun
    currentMonthYearEl.textContent = formatMonthYear(currentDate);
    
    // Tambahkan kotak kosong untuk hari sebelum tanggal pertama
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDaysEl.appendChild(emptyDay);
    }
    
    // Tambahkan kotak untuk setiap hari dalam sebulan
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const tasksForDay = getTasksByDate(dayDate);
        
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${isToday(dayDate) ? 'today' : ''} ${isSameDate(dayDate, selectedDate) ? 'selected' : ''}`;
        dayEl.innerHTML = `
            <div class="day-number">${day}</div>
            ${tasksForDay.length > 0 ? `<div class="task-indicator" style="background: ${getPriorityColor(tasksForDay[0].priority)}"></div>` : ''}
        `;
        
        // Tambahkan event listener untuk memilih tanggal
        dayEl.addEventListener('click', () => {
            selectedDate = dayDate;
            renderCalendar();
            displayDailyTasks(dayDate);
        });
        
        calendarDaysEl.appendChild(dayEl);
    }
}

// Dapatkan warna berdasarkan prioritas
function getPriorityColor(priority) {
    switch (priority) {
        case 'mendesak': return '#dc3545'; // Merah
        case 'tinggi': return '#ffc107';   // Kuning
        case 'sedang': return '#17a2b8';   // Biru muda
        case 'rendah': return '#6c757d';   // Abu-abu
        default: return '#6c757d';
    }
}

// Tampilkan tugas harian
function displayDailyTasks(date) {
    const tasksForDay = getTasksByDate(date);
    
    selectedDateEl.textContent = formatDate(date.toISOString().split('T')[0]);
    
    if (tasksForDay.length === 0) {
        dailyTasksListEl.innerHTML = '<p class="no-tasks">Tidak ada tugas untuk tanggal ini</p>';
        return;
    }
    
    dailyTasksListEl.innerHTML = tasksForDay.map(task => {
        return `
            <div class="task-card priority-${task.priority}">
                <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''} 
                    onchange="toggleTaskStatus(${task.id})">
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div>
                        <span class="task-course">${task.category}</span>
                        <span class="task-deadline">${task.deadlineTime}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle status tugas
function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        renderCalendar(); // Refresh indikator di kalender
        displayDailyTasks(selectedDate); // Refresh daftar tugas harian
        saveTasks();
    }
}

// Pindah ke bulan sebelumnya
function goToPrevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    displayDailyTasks(selectedDate);
}

// Pindah ke bulan berikutnya
function goToNextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    displayDailyTasks(selectedDate);
}

// Fungsi untuk menyimpan tugas ke localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk memuat tugas dari localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Fungsi untuk memuat data pengguna
function loadCurrentUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    } else {
        // Jika tidak ada data pengguna, arahkan ke halaman login
        window.location.href = 'login.html';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Event listener untuk tombol navigasi bulan
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', goToPrevMonth);
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', goToNextMonth);
    }
    
    // Event listener untuk tombol tambah tugas
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            window.location.href = 'add_task.html';
        });
    }
}

// Inisialisasi aplikasi
function initCalendar() {
    // Muat data
    loadCurrentUser();
    loadTasks();
    
    // Render kalender dan tampilkan tugas hari ini
    renderCalendar();
    displayDailyTasks(selectedDate);
    
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
    initCalendar();
});