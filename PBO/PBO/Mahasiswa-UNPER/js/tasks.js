// tasks.js - Fungsi untuk halaman daftar tugas

// Data dummy untuk percobaan
let tasks = [];
let currentUser = null;

// DOM Elements
const allTasksListEl = document.getElementById('all-tasks-list');
const searchTasksEl = document.getElementById('search-tasks');
const filterBtn = document.getElementById('filter-btn');
const sortBtn = document.getElementById('sort-btn');
const filterModal = document.getElementById('filterModal');
const categoryFilter = document.getElementById('category-filter');
const priorityFilter = document.getElementById('priority-filter');
const statusFilter = document.getElementById('status-filter');
const clearFilterBtn = document.getElementById('clear-filter');
const applyFilterBtn = document.getElementById('apply-filter');
const addTaskBtn = document.getElementById('add-task-btn');

// Filter dan sort state
let currentFilter = {
    category: '',
    priority: '',
    status: ''
};
let currentSort = 'deadline'; // deadline, priority, created

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

// Format waktu menjadi string
function formatTime(timeString) {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Ambil HH:MM
}

// Render semua tugas
function renderAllTasks() {
    // Filter tugas berdasarkan pencarian dan filter
    let filteredTasks = tasks.filter(task => {
        // Filter pencarian
        const searchQuery = searchTasksEl.value.toLowerCase();
        const matchesSearch = !searchQuery || 
            task.title.toLowerCase().includes(searchQuery) ||
            task.description.toLowerCase().includes(searchQuery) ||
            task.category.toLowerCase().includes(searchQuery);
        
        // Filter kategori
        const matchesCategory = !currentFilter.category || 
            task.category === currentFilter.category;
            
        // Filter prioritas
        const matchesPriority = !currentFilter.priority || 
            task.priority === currentFilter.priority;
            
        // Filter status
        const matchesStatus = !currentFilter.status || 
            task.status === currentFilter.status;
        
        return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
    
    // Urutkan tugas
    filteredTasks.sort((a, b) => {
        if (currentSort === 'deadline') {
            // Urutkan berdasarkan tanggal deadline dan waktu
            const dateA = new Date(`${a.deadlineDate}T${a.deadlineTime}`);
            const dateB = new Date(`${b.deadlineDate}T${b.deadlineTime}`);
            return dateA - dateB;
        } else if (currentSort === 'priority') {
            // Urutkan berdasarkan prioritas
            const priorityOrder = { 'mendesak': 4, 'tinggi': 3, 'sedang': 2, 'rendah': 1 };
            if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(a.deadlineDate) - new Date(b.deadlineDate);
        } else if (currentSort === 'created') {
            // Urutkan berdasarkan tanggal dibuat (dalam implementasi nyata akan ada field created)
            return new Date(b.deadlineDate) - new Date(a.deadlineDate);
        }
        return 0;
    });
    
    if (filteredTasks.length === 0) {
        allTasksListEl.innerHTML = '<p class="no-tasks">Belum ada tugas yang dibuat</p>';
        return;
    }
    
    allTasksListEl.innerHTML = filteredTasks.map(task => {
        return `
            <div class="task-card priority-${task.priority}">
                <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''} 
                    onchange="toggleTaskStatus(${task.id})">
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div>
                        <span class="task-course">${task.category}</span>
                        <span class="task-deadline">${formatDateShort(task.deadlineDate)} ${formatTime(task.deadlineTime)}</span>
                    </div>
                    ${task.subtasks && task.subtasks.length > 0 ? 
                        `<div class="subtasks-summary">
                            <small>${task.subtasks.filter(st => st.completed).length} dari ${task.subtasks.length} sub-tugas selesai</small>
                        </div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;" 
                        onclick="editTask(${task.id})">
                        <i class="fas fa-edit"></i>
                    </button>
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
        renderAllTasks();
        saveTasks();
    }
}

// Edit tugas
function editTask(taskId) {
    // Dalam implementasi nyata, ini akan membuka form edit
    // Untuk demo, kita arahkan ke halaman tambah tugas dengan data yang akan diedit
    localStorage.setItem('editTaskId', taskId);
    window.location.href = 'add_task.html';
}

// Filter tugas
function filterTasks() {
    // Update filter state
    currentFilter = {
        category: categoryFilter.value,
        priority: priorityFilter.value,
        status: statusFilter.value
    };
    
    // Render ulang tugas
    renderAllTasks();
    
    // Sembunyikan modal
    filterModal.style.display = 'none';
}

// Hapus filter
function clearFilters() {
    categoryFilter.value = '';
    priorityFilter.value = '';
    statusFilter.value = '';
    
    // Reset filter state
    currentFilter = {
        category: '',
        priority: '',
        status: ''
    };
    
    // Render ulang tugas
    renderAllTasks();
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
    // Event listener untuk pencarian
    if (searchTasksEl) {
        searchTasksEl.addEventListener('input', () => {
            renderAllTasks();
        });
    }
    
    // Event listener untuk tombol filter
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            filterModal.style.display = 'block';
        });
    }
    
    // Event listener untuk tombol urutkan
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            // Untuk demo, kita hanya ubah sortir antara deadline dan priority
            currentSort = currentSort === 'deadline' ? 'priority' : 'deadline';
            sortBtn.innerHTML = `<i class="fas fa-sort"></i> Urut: ${currentSort === 'deadline' ? 'Deadline' : 'Prioritas'}`;
            renderAllTasks();
        });
    }
    
    // Event listener untuk tombol hapus filter
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', clearFilters);
    }
    
    // Event listener untuk tombol terapkan filter
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', filterTasks);
    }
    
    // Event listener untuk menutup modal dengan mengklik di luar modal
    window.addEventListener('click', (e) => {
        if (e.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });
    
    // Event listener untuk tombol tambah tugas
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            window.location.href = 'add_task.html';
        });
    }
}

// Inisialisasi aplikasi
function initTasks() {
    // Muat data
    loadCurrentUser();
    loadTasks();
    
    // Render tugas
    renderAllTasks();
    
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
    initTasks();
});