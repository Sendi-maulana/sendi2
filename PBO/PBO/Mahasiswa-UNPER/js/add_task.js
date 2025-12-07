// add_task.js - Fungsi untuk halaman tambah/edit tugas

// Data dummy untuk percobaan
let tasks = [];
let currentUser = null;
let editTaskId = null; // ID tugas yang sedang diedit (jika ada)

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskCategory = document.getElementById('task-category');
const deadlineDate = document.getElementById('deadline-date');
const deadlineTime = document.getElementById('deadline-time');
const priorityOptions = document.querySelectorAll('input[name="priority"]');
const enableReminder = document.getElementById('enable-reminder');
const subtasksContainer = document.getElementById('subtasks-container');
const addSubtaskBtn = document.getElementById('add-subtask-btn');
const attachBtn = document.getElementById('attach-btn');
const cancelBtn = document.getElementById('cancel-btn');
const saveTaskBtn = taskForm.querySelector('button[type="submit"]');

// Subtasks array
let subtasks = [];

// Inisialisasi tugas kosong
const emptyTask = {
    id: null,
    title: '',
    description: '',
    deadlineDate: '',
    deadlineTime: '',
    category: '',
    status: 'pending',
    priority: 'sedang',
    reminder: false,
    subtasks: [],
    attachments: []
};

// Ambil ID tugas yang akan diedit dari localStorage (jika ada)
function getEditTaskId() {
    const id = localStorage.getItem('editTaskId');
    if (id) {
        editTaskId = parseInt(id);
        localStorage.removeItem('editTaskId'); // Hapus setelah diambil
        return editTaskId;
    }
    return null;
}

// Dapatkan tugas berdasarkan ID
function getTaskById(id) {
    return tasks.find(task => task.id === id);
}

// Render subtasks
function renderSubtasks() {
    if (subtasks.length === 0) {
        subtasksContainer.innerHTML = '<p style="color: var(--text-light); font-style: italic;">Belum ada sub-tugas ditambahkan</p>';
        return;
    }
    
    subtasksContainer.innerHTML = subtasks.map((subtask, index) => {
        return `
            <div class="subtask-item" style="display: flex; align-items: center; margin-bottom: 10px; padding: 10px; background: var(--bg-light); border-radius: 5px;">
                <input type="checkbox" id="subtask-${index}" ${subtask.completed ? 'checked' : ''} 
                    onchange="toggleSubtask(${index})" style="margin-right: 10px;">
                <input type="text" value="${subtask.title}" 
                    onchange="updateSubtaskTitle(${index}, this.value)" 
                    style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px;">
                <button type="button" class="btn btn-outline" onclick="removeSubtask(${index})" 
                    style="padding: 5px 10px; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

// Tambah subtask
function addSubtask() {
    subtasks.push({
        id: Date.now(), // Gunakan timestamp sebagai ID unik
        title: '',
        completed: false
    });
    renderSubtasks();
}

// Hapus subtask
function removeSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}

// Toggle status subtask
function toggleSubtask(index) {
    subtasks[index].completed = !subtasks[index].completed;
    renderSubtasks();
}

// Update judul subtask
function updateSubtaskTitle(index, newTitle) {
    subtasks[index].title = newTitle;
}

// Simpan tugas
function saveTask(taskData) {
    if (editTaskId !== null) {
        // Update tugas yang sudah ada
        const taskIndex = tasks.findIndex(t => t.id === editTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
        }
    } else {
        // Tambah tugas baru
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        tasks.push({ ...taskData, id: newId });
    }
    
    // Simpan ke localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Kembali ke halaman daftar tugas
    window.location.href = 'tasks.html';
}

// Tangani submit form
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Ambil data dari form
    const formData = {
        title: taskTitle.value,
        description: taskDescription.value,
        deadlineDate: deadlineDate.value,
        deadlineTime: deadlineTime.value,
        category: taskCategory.value,
        priority: document.querySelector('input[name="priority"]:checked').value,
        reminder: enableReminder.checked,
        subtasks: [...subtasks] // Salin array subtasks
    };
    
    // Validasi form
    if (!validateForm(formData)) {
        return;
    }
    
    // Simpan tugas
    saveTask(formData);
}

// Validasi form
function validateForm(formData) {
    if (!formData.title.trim()) {
        alert('Judul tugas wajib diisi');
        return false;
    }
    
    if (!formData.category) {
        alert('Kategori tugas wajib dipilih');
        return false;
    }
    
    if (!formData.deadlineDate) {
        alert('Tanggal deadline wajib diisi');
        return false;
    }
    
    if (!formData.deadlineTime) {
        alert('Waktu deadline wajib diisi');
        return false;
    }
    
    // Cek apakah deadline sudah lewat
    const deadline = new Date(`${formData.deadlineDate}T${formData.deadlineTime}`);
    const now = new Date();
    if (deadline < now) {
        alert('Tanggal dan waktu deadline tidak boleh di masa lalu');
        return false;
    }
    
    return true;
}

// Isi form dengan data tugas yang diedit
function populateForm(task) {
    taskTitle.value = task.title || '';
    taskDescription.value = task.description || '';
    taskCategory.value = task.category || '';
    deadlineDate.value = task.deadlineDate || '';
    deadlineTime.value = task.deadlineTime || '';
    
    // Set prioritas
    priorityOptions.forEach(option => {
        if (option.value === task.priority) {
            option.checked = true;
        }
    });
    
    enableReminder.checked = task.reminder || false;
    
    // Isi subtasks
    subtasks = [...(task.subtasks || [])];
    renderSubtasks();
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
    // Event listener untuk form submit
    if (taskForm) {
        taskForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Event listener untuk tombol tambah subtask
    if (addSubtaskBtn) {
        addSubtaskBtn.addEventListener('click', addSubtask);
    }
    
    // Event listener untuk tombol lampirkan
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            alert('Fitur lampirkan file/foto akan diimplementasikan di versi 2.0');
        });
    }
    
    // Event listener untuk tombol batal
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'tasks.html';
        });
    }
    
    // Event listener untuk pilihan prioritas
    priorityOptions.forEach(option => {
        option.addEventListener('change', () => {
            // Hapus kelas aktif dari semua pilihan
            document.querySelectorAll('.priority-option').forEach(el => {
                el.style.borderColor = '#ddd';
            });
            
            // Tambahkan kelas aktif ke pilihan yang dipilih
            const parentLabel = option.closest('.priority-option');
            parentLabel.style.borderColor = 'var(--primary-color)';
        });
    });
    
    // Set border default pada prioritas yang dipilih
    setTimeout(() => {
        const checkedOption = document.querySelector('input[name="priority"]:checked');
        if (checkedOption) {
            const parentLabel = checkedOption.closest('.priority-option');
            parentLabel.style.borderColor = 'var(--primary-color)';
        }
    }, 100);
}

// Inisialisasi aplikasi
function initAddTask() {
    // Muat data
    loadCurrentUser();
    loadTasks();
    
    // Cek apakah sedang mengedit tugas
    const taskId = getEditTaskId();
    if (taskId !== null) {
        const taskToEdit = getTaskById(taskId);
        if (taskToEdit) {
            // Set judul halaman
            document.querySelector('.header-content h1').textContent = 'Edit Tugas';
            // Isi form dengan data tugas
            populateForm(taskToEdit);
        }
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Inisialisasi subtasks kosong jika tidak sedang mengedit
    if (taskId === null) {
        renderSubtasks();
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
                    // Konfirmasi sebelum pindah halaman jika form telah diubah
                    if (hasFormChanged()) {
                        if (confirm('Perubahan belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?')) {
                            window.location.href = href;
                        }
                    } else {
                        window.location.href = href;
                    }
                }
            }
        });
    });
}

// Cek apakah form telah diubah
function hasFormChanged() {
    // Untuk sementara, kita anggap form selalu dianggap berubah
    // Di implementasi nyata, kita akan membandingkan nilai awal dan nilai sekarang
    return true;
}

// Inisialisasi aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    initAddTask();
});