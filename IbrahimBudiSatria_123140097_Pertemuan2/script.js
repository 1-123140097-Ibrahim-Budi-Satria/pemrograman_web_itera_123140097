// ES6+ Class untuk mengelola jadwal kuliah
class Schedule {
    constructor(id, courseName, lecturer, day, time, room, duration) {
        this.id = id;
        this.courseName = courseName;
        this.lecturer = lecturer;
        this.day = day;
        this.time = time;
        this.room = room;
        this.duration = duration;
    }

    // Method untuk mendapatkan waktu selesai
    getEndTime() {
        const [hours, minutes] = this.time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + this.duration;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }

    // Method untuk mendapatkan informasi lengkap
    getFullInfo() {
        return `${this.courseName} - ${this.day} ${this.time} - ${this.getEndTime()}`;
    }
}

// ES6+ Class untuk manajemen aplikasi
class ScheduleManager {
    constructor() {
        this.schedules = [];
        this.editingId = null;
        this.currentFilter = 'all';
        this.init();
    }

    // Inisialisasi aplikasi
    async init() {
        await this.loadFromStorage();
        this.setupEventListeners();
        this.updateStats();
        this.renderSchedules();
        this.startClock();
    }

    // Arrow function untuk memuat data dari localStorage
    loadFromStorage = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = localStorage.getItem('schedules');
                if (stored) {
                    const data = JSON.parse(stored);
                    this.schedules = data.map(s => new Schedule(
                        s.id, s.courseName, s.lecturer, s.day, s.time, s.room, s.duration
                    ));
                }
                resolve();
            }, 100); // Simulasi async operation
        });
    }

    // Arrow function untuk menyimpan ke localStorage
    saveToStorage = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem('schedules', JSON.stringify(this.schedules));
                resolve();
            }, 50);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        const form = document.getElementById('classForm');
        const cancelBtn = document.getElementById('cancelEdit');
        
        // Arrow function untuk form submit
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmit();
        });

        // Arrow function untuk cancel edit
        cancelBtn.addEventListener('click', () => this.cancelEdit());

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderSchedules();
            });
        });
    }

    // Arrow function untuk handle form submit
    handleFormSubmit = async () => {
        const formData = this.getFormData();
        
        if (this.editingId) {
            await this.updateSchedule(this.editingId, formData);
        } else {
            await this.addSchedule(formData);
        }

        this.resetForm();
        await this.saveToStorage();
        this.updateStats();
        this.renderSchedules();
    }

    // Arrow function untuk mendapatkan data form
    getFormData = () => ({
        courseName: document.getElementById('courseName').value,
        lecturer: document.getElementById('lecturer').value,
        day: document.getElementById('day').value,
        time: document.getElementById('time').value,
        room: document.getElementById('room').value,
        duration: parseInt(document.getElementById('duration').value)
    })

    // Async function untuk menambah jadwal
    async addSchedule(data) {
        const id = Date.now().toString();
        const schedule = new Schedule(
            id, data.courseName, data.lecturer, data.day, 
            data.time, data.room, data.duration
        );
        this.schedules.push(schedule);
    }

    // Async function untuk update jadwal
    async updateSchedule(id, data) {
        const index = this.schedules.findIndex(s => s.id === id);
        if (index !== -1) {
            this.schedules[index] = new Schedule(
                id, data.courseName, data.lecturer, data.day,
                data.time, data.room, data.duration
            );
        }
        this.editingId = null;
    }

    // Arrow function untuk edit jadwal
    editSchedule = (id) => {
        const schedule = this.schedules.find(s => s.id === id);
        if (schedule) {
            document.getElementById('courseName').value = schedule.courseName;
            document.getElementById('lecturer').value = schedule.lecturer;
            document.getElementById('day').value = schedule.day;
            document.getElementById('time').value = schedule.time;
            document.getElementById('room').value = schedule.room;
            document.getElementById('duration').value = schedule.duration;

            this.editingId = id;
            document.getElementById('formButtonText').textContent = 'Update Jadwal';
            document.getElementById('cancelEdit').style.display = 'inline-flex';
            
            // Scroll ke form
            document.getElementById('classForm').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Arrow function untuk delete jadwal dengan konfirmasi async
    deleteSchedule = async (id) => {
        return new Promise((resolve) => {
            const schedule = this.schedules.find(s => s.id === id);
            if (schedule && confirm(`Hapus jadwal ${schedule.courseName}?`)) {
                this.schedules = this.schedules.filter(s => s.id !== id);
                this.saveToStorage();
                this.updateStats();
                this.renderSchedules();
            }
            resolve();
        });
    }

    // Reset form
    resetForm() {
        document.getElementById('classForm').reset();
        this.editingId = null;
        document.getElementById('formButtonText').textContent = 'Tambah Jadwal';
        document.getElementById('cancelEdit').style.display = 'none';
    }

    // Cancel edit
    cancelEdit() {
        this.resetForm();
    }

    // Arrow function untuk update statistik
    updateStats = () => {
        const totalClasses = this.schedules.length;
        const today = this.getCurrentDay();
        const todayClasses = this.schedules.filter(s => s.day === today).length;

        document.getElementById('totalClasses').textContent = totalClasses;
        document.getElementById('todayClasses').textContent = todayClasses;
    }

    // Arrow function untuk mendapatkan hari saat ini
    getCurrentDay = () => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[new Date().getDay()];
    }

    // Arrow function untuk memulai jam
    startClock = () => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Render schedules dengan template literals
    renderSchedules() {
        const container = document.getElementById('scheduleList');
        let filteredSchedules = this.schedules;

        // Filter berdasarkan hari
        if (this.currentFilter !== 'all') {
            filteredSchedules = this.schedules.filter(s => s.day === this.currentFilter);
        }

        // Sort berdasarkan hari dan waktu
        const dayOrder = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6 };
        filteredSchedules.sort((a, b) => {
            const dayDiff = dayOrder[a.day] - dayOrder[b.day];
            if (dayDiff !== 0) return dayDiff;
            return a.time.localeCompare(b.time);
        });

        // Render dengan template literals (ES6+)
        if (filteredSchedules.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>Belum ada jadwal kuliah${this.currentFilter !== 'all' ? ` untuk hari ${this.currentFilter}` : ''}</p>
                </div>
            `;
        } else {
            container.innerHTML = filteredSchedules.map(schedule => `
                <div class="schedule-card">
                    <div class="schedule-header-info">
                        <div>
                            <div class="course-title">${schedule.courseName}</div>
                            <div class="lecturer"><i class="fas fa-user-tie"></i> ${schedule.lecturer}</div>
                        </div>
                        <div class="schedule-badge">${schedule.day}</div>
                    </div>
                    <div class="schedule-details">
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${schedule.time} - ${schedule.getEndTime()}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-door-open"></i>
                            <span>${schedule.room}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-hourglass-half"></i>
                            <span>${schedule.duration} menit</span>
                        </div>
                    </div>
                    <div class="schedule-actions">
                        <button class="btn-edit" onclick="app.editSchedule('${schedule.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="app.deleteSchedule('${schedule.id}')">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Inisialisasi aplikasi menggunakan const (ES6+)
const app = new ScheduleManager();

// Export untuk testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Schedule, ScheduleManager };
}
