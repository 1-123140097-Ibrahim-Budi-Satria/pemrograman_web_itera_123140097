// Task Management Application
class TaskManager {
    constructor() {
        this.tasks = [];
        this.editingTaskId = null;
        this.taskToDelete = null;
        this.currentFilter = 'all';
        this.currentSort = 'deadline';
        this.init();
    }

    init() {
        // Load tasks from localStorage
        this.loadTasks();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Render initial state
        this.render();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Cancel edit button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);
            });
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });

        // Modal actions
        document.getElementById('cancelDelete').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('confirmDelete').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Task actions using event delegation
        document.getElementById('tasksContainer').addEventListener('click', (e) => {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const taskCard = button.closest('.task-card');
            if (!taskCard) return;

            const taskId = taskCard.getAttribute('data-task-id');
            const action = button.getAttribute('data-action');

            switch (action) {
                case 'complete':
                    this.toggleComplete(taskId);
                    break;
                case 'edit':
                    this.editTask(taskId);
                    break;
                case 'delete':
                    this.deleteTask(taskId);
                    break;
            }
        });
    }

    // LocalStorage Methods
    loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            try {
                this.tasks = JSON.parse(storedTasks);
            } catch (error) {
                console.error('Error loading tasks:', error);
                this.tasks = [];
            }
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            alert('Gagal menyimpan data. Pastikan localStorage tersedia.');
        }
    }

    // Form Validation
    validateForm() {
        let isValid = true;
        
        // Clear previous errors
        this.clearErrors();

        // Validate task name
        const taskName = document.getElementById('taskName').value.trim();
        if (!taskName) {
            this.showError('taskName', 'Nama tugas tidak boleh kosong');
            isValid = false;
        } else if (taskName.length < 3) {
            this.showError('taskName', 'Nama tugas minimal 3 karakter');
            isValid = false;
        }

        // Validate subject
        const subject = document.getElementById('subject').value.trim();
        if (!subject) {
            this.showError('subject', 'Mata kuliah tidak boleh kosong');
            isValid = false;
        }

        // Validate deadline
        const deadline = document.getElementById('deadline').value;
        if (!deadline) {
            this.showError('deadline', 'Deadline tidak boleh kosong');
            isValid = false;
        } else {
            const deadlineDate = new Date(deadline);
            const now = new Date();
            
            // Allow past dates for editing, but warn for new tasks
            if (deadlineDate < now && !this.editingTaskId) {
                this.showError('deadline', 'Deadline tidak boleh di masa lalu');
                isValid = false;
            }
        }

        return isValid;
    }

    showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        input.classList.add('error');
        errorElement.textContent = message;
    }

    clearErrors() {
        const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
        
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => {
            error.textContent = '';
        });
    }

    // CRUD Operations
    handleFormSubmit() {
        if (!this.validateForm()) {
            return;
        }

        const taskData = {
            name: document.getElementById('taskName').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            deadline: document.getElementById('deadline').value,
            description: document.getElementById('description').value.trim(),
            completed: false
        };

        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, taskData);
        } else {
            this.addTask(taskData);
        }
    }

    addTask(taskData) {
        const newTask = {
            id: Date.now().toString(),
            ...taskData,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.resetForm();
        this.render();
        
        this.showNotification('Tugas berhasil ditambahkan!', 'success');
    }

    updateTask(taskId, taskData) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...taskData,
                updatedAt: new Date().toISOString()
            };
            
            this.saveTasks();
            this.resetForm();
            this.render();
            
            this.showNotification('Tugas berhasil diperbarui!', 'success');
        }
    }

    deleteTask(taskId) {
        this.taskToDelete = taskId;
        this.showModal();
    }

    confirmDelete() {
        console.log('confirmDelete called, taskToDelete:', this.taskToDelete);
        if (this.taskToDelete) {
            this.tasks = this.tasks.filter(t => t.id !== this.taskToDelete);
            this.saveTasks();
            this.taskToDelete = null;
            this.closeModal();
            this.render();
            
            this.showNotification('Tugas berhasil dihapus!', 'success');
        }
    }

    toggleComplete(taskId) {
        console.log('toggleComplete called:', taskId);
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
            
            const message = task.completed ? 'Tugas ditandai selesai!' : 'Tugas ditandai belum selesai!';
            this.showNotification(message, 'success');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            this.editingTaskId = taskId;
            
            // Fill form with task data
            document.getElementById('taskName').value = task.name;
            document.getElementById('subject').value = task.subject;
            document.getElementById('deadline').value = task.deadline;
            document.getElementById('description').value = task.description || '';
            
            // Update UI
            document.getElementById('btnText').textContent = 'Update Tugas';
            document.getElementById('cancelBtn').style.display = 'inline-block';
            
            // Scroll to form
            document.getElementById('taskForm').scrollIntoView({ behavior: 'smooth' });
        }
    }

    cancelEdit() {
        this.resetForm();
    }

    resetForm() {
        document.getElementById('taskForm').reset();
        this.editingTaskId = null;
        document.getElementById('btnText').textContent = 'Tambah Tugas';
        document.getElementById('cancelBtn').style.display = 'none';
        this.clearErrors();
    }

    // Filter and Search
    handleFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    handleSearch(searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const filtered = this.tasks.filter(task => {
            return task.name.toLowerCase().includes(searchLower) ||
                   task.subject.toLowerCase().includes(searchLower) ||
                   (task.description && task.description.toLowerCase().includes(searchLower));
        });
        
        this.renderTasks(filtered);
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];
        
        // Apply status filter
        switch (this.currentFilter) {
            case 'completed':
                filtered = filtered.filter(t => t.completed);
                break;
            case 'incomplete':
                filtered = filtered.filter(t => !t.completed);
                break;
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'deadline':
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'subject':
                    return a.subject.localeCompare(b.subject);
                default:
                    return 0;
            }
        });
        
        return filtered;
    }

    // Rendering Methods
    render() {
        this.updateStats();
        const filtered = this.getFilteredTasks();
        this.renderTasks(filtered);
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const incomplete = total - completed;
        
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('incompleteTasks').textContent = incomplete;
    }

    renderTasks(tasks) {
        const container = document.getElementById('tasksContainer');
        const emptyState = document.getElementById('emptyState');
        
        // Remove old task cards only
        container.querySelectorAll('.task-card').forEach(card => card.remove());
        
        if (tasks.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        tasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.setAttribute('data-task-id', task.id);
        
        if (task.completed) {
            card.classList.add('completed');
        }
        
        // Check if task is overdue or due soon
        const deadline = new Date(task.deadline);
        const now = new Date();
        const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);
        
        if (!task.completed && deadline < now) {
            card.classList.add('overdue');
        } else if (!task.completed && hoursUntilDeadline < 24 && hoursUntilDeadline > 0) {
            card.classList.add('due-soon');
        }
        
        // Format deadline
        const deadlineStr = this.formatDeadline(task.deadline);
        const deadlineClass = this.getDeadlineClass(task.deadline, task.completed);
        
        card.innerHTML = `
            <div class="task-header">
                <div class="task-info">
                    <h3 class="task-title">${this.escapeHtml(task.name)}</h3>
                    <span class="task-subject">${this.escapeHtml(task.subject)}</span>
                    <div class="task-deadline ${deadlineClass}">${deadlineStr}</div>
                    ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                </div>
                <div class="task-actions">
                    <button class="complete-btn" data-action="complete">
                        ${task.completed ? '↺ Belum Selesai' : '✓ Selesai'}
                    </button>
                    <button class="edit-btn" data-action="edit">
                        ✎ Edit
                    </button>
                    <button class="delete-btn" data-action="delete">
                        🗑 Hapus
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    formatDeadline(deadlineStr) {
        const deadline = new Date(deadlineStr);
        const now = new Date();
        const diff = deadline - now;
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const formatted = deadline.toLocaleDateString('id-ID', options);
        
        if (diff < 0) {
            const daysLate = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
            return `${formatted} (Terlambat ${daysLate} hari)`;
        } else if (diff < 24 * 60 * 60 * 1000) {
            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            return `${formatted} (${hoursLeft} jam lagi)`;
        } else if (diff < 7 * 24 * 60 * 60 * 1000) {
            const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
            return `${formatted} (${daysLeft} hari lagi)`;
        }
        
        return formatted;
    }

    getDeadlineClass(deadlineStr, completed) {
        if (completed) return '';
        
        const deadline = new Date(deadlineStr);
        const now = new Date();
        const diff = deadline - now;
        
        if (diff < 0) return 'overdue';
        if (diff < 24 * 60 * 60 * 1000) return 'due-soon';
        return '';
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Modal Methods
    showModal() {
        document.getElementById('confirmModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('confirmModal').classList.remove('active');
    }

    // Notification
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
let taskManager;
document.addEventListener('DOMContentLoaded', function() {
    taskManager = new TaskManager();
    console.log('TaskManager initialized');
});
