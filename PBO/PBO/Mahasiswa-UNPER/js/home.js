// home.js - Fungsi untuk halaman beranda

// Data dummy untuk percobaan
let tasks = [];
let currentUser = null;

// DOM Elements
const greetingTimeEl = document.getElementById('greeting-time');
const currentDateEl = document.getElementById('current-date');
const totalTasksEl = document.getElementById('total-tasks');
const todayDeadlinesEl = document.getElementById('today-deadlines');
const lateTasksEl = document.getElementById('late-tasks');
const urgentTasksListEl = document.getElementById('urgent-tasks-list');
const weeklyScheduleEl = document.getElementById('weekly-schedule');
const addTaskBtn = document.getElementById('add-task-btn');

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

// Periksa apakah tanggal adalah hari ini
function isToday(dateString) {
    const today = new Date();
    const taskDate = new Date(dateString);
    return taskDate.getDate() === today.getDate() &&
           taskDate.getMonth() === today.getMonth() &&
           taskDate.getFullYear() === today.getFullYear();
}

// Periksa apakah tanggal sudah lewat
function isOverdue(dateString) {
    const today = new Date();
    const taskDate = new Date(dateString);
    return taskDate < today && taskDate.getDate() !== today.getDate();
}

// Hitung jumlah tugas berdasarkan kriteria
function countTasksBy(filter) {
    if (filter === 'total') {
        return tasks.filter(task => task.status !== 'completed').length;
    } else if (filter === 'today') {
        return tasks.filter(task => 
            isToday(task.deadlineDate) && 
            task.status !== 'completed'
        ).length;
    } else if (filter === 'overdue') {
        return tasks.filter(task => 
            isOverdue(task.deadlineDate) && 
            task.status !== 'completed'
        ).length;
    }
}

// Dapatkan tugas mendesak dan tugas hari ini
function getUrgentTasks() {
    return tasks.filter(task => {
        return (task.priority === 'mendesak' || isToday(task.deadlineDate)) && 
               task.status !== 'completed';
    }).sort((a, b) => {
        // Urutkan berdasarkan prioritas dan tanggal deadline
        const priorityOrder = { 'mendesak': 4, 'tinggi': 3, 'sedang': 2, 'rendah': 1 };
        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(a.deadlineDate) - new Date(b.deadlineDate);
    });
}

// Render tugas mendesak
function renderUrgentTasks() {
    const urgentTasks = getUrgentTasks();
    
    if (urgentTasks.length === 0) {
        urgentTasksListEl.innerHTML = '<p class="no-tasks">Tidak ada tugas mendesak saat ini</p>';
        return;
    }
    
    urgentTasksListEl.innerHTML = urgentTasks.map(task => {
        return `
            <div class="task-card priority-${task.priority}">
                <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''} 
                    onchange="toggleTaskStatus(${task.id})">
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div>
                        <span class="task-course">${task.category}</span>
                        <span class="task-deadline">${formatDateShort(task.deadlineDate)} ${task.deadlineTime}</span>
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
        updateStats();
        renderUrgentTasks();
        saveTasks();
    }
}

// Render jadwal mingguan
function renderWeeklySchedule() {
    // Data dummy jadwal kuliah
    const weeklySchedule = [
        {
            day: 'Senin',
            schedule: [
                { time: '08:00-10:00', subject: 'Matematika Diskrit', room: 'A101' },
                { time: '13:00-15:00', subject: 'Praktikum Algoritma', room: 'Lab 2' }
            ]
        },
        {
            day: 'Selasa',
            schedule: [
                { time: '10:00-12:00', subject: 'Pengantar Teknologi Informasi', room: 'B202' },
                { time: '14:00-16:00', subject: 'Bahasa Indonesia', room: 'C303' }
            ]
        },
        {
            day: 'Rabu',
            schedule: [
                { time: '09:00-11:00', subject: 'Fisika Dasar', room: 'A105' },
                { time: '13:00-15:00', subject: 'Matematika Diskrit', room: 'B201' }
            ]
        }
        // Tambahkan hari lainnya sesuai kebutuhan
    ];
    
    if (weeklySchedule.length === 0) {
        weeklyScheduleEl.innerHTML = '<p class="no-tasks">Belum ada jadwal kuliah yang dimasukkan</p>';
        return;
    }
    
    weeklyScheduleEl.innerHTML = weeklySchedule.map(daySchedule => {
        const scheduleItems = daySchedule.schedule.map(schedule => {
            return `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <div>
                        <strong>${schedule.time}</strong><br>
                        <span style="color: var(--primary-color);">${schedule.subject}</span>
                    </div>
                    <div style="text-align: right;">
                        <div>${schedule.room}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div style="background: var(--bg-white); border-radius: 8px; padding: 12px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 10px 0; color: var(--primary-color);">${daySchedule.day}</h3>
                ${scheduleItems}
            </div>
        `;
    }).join('');
}

// Update statistik halaman
function updateStats() {
    totalTasksEl.textContent = countTasksBy('total');
    todayDeadlinesEl.textContent = countTasksBy('today');
    lateTasksEl.textContent = countTasksBy('overdue');
}

// Atur sapaan berdasarkan waktu
function setGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Pagi';
    
    if (hour >= 12 && hour < 15) {
        greeting = 'Siang';
    } else if (hour >= 15 && hour < 18) {
        greeting = 'Sore';
    } else if (hour >= 18 || hour < 4) {
        greeting = 'Malam';
    }
    
    greetingTimeEl.textContent = greeting;
}

// Tampilkan tanggal hari ini
function displayCurrentDate() {
    currentDateEl.textContent = formatDate(new Date().toISOString().split('T')[0]);
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
        document.getElementById('user-name').textContent = currentUser.name;
    } else {
        // Jika tidak ada data pengguna, arahkan ke halaman login
        window.location.href = 'login.html';
    }
}

// Inisialisasi aplikasi
function initHome() {
    // Muat data
    loadCurrentUser();
    loadTasks();
    
    // Atur sapaan dan tanggal
    setGreeting();
    displayCurrentDate();
    
    // Update statistik
    updateStats();
    
    // Render tugas mendesak dan jadwal
    renderUrgentTasks();
    renderWeeklySchedule();
    
    // Tambahkan event listener untuk tombol tambah tugas
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            window.location.href = 'add_task.html';
        });
    }
    
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
    initHome();
});