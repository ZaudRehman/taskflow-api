// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
let accessToken = localStorage.getItem('accessToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (accessToken && currentUser) {
        showApp();
        loadTasks();
    } else {
        showAuth();
    }

    // Form event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('task-form').addEventListener('submit', handleCreateTask);
});

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Authentication Functions
async function handleRegister(e) {
    e.preventDefault();
    
    const userData = {
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        firstName: document.getElementById('register-firstname').value,
        lastName: document.getElementById('register-lastname').value,
        password: document.getElementById('register-password').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('auth-message', 'Registration successful! Please login.', 'success');
            document.getElementById('register-form').reset();
            setTimeout(() => showTab('login'), 1000);
        } else {
            showMessage('auth-message', data.detail || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('auth-message', 'Network error. Please try again.', 'error');
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const credentials = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok) {
            accessToken = data.access_token;  // Changed from accessToken
            currentUser = data.user;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showApp();
            loadTasks();
        } else {
            showMessage('auth-message', data.detail || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('auth-message', 'Network error. Please try again.', 'error');
    }
}

function logout() {
    accessToken = null;
    currentUser = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    showAuth();
}

// Task Functions
async function handleCreateTask(e) {
    e.preventDefault();

    const dueDate = document.getElementById('task-due-date').value;
    
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        status: document.getElementById('task-status').value
    };

    if (dueDate) {
        taskData.dueDate = new Date(dueDate).toISOString();
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            showMessage('app-message', 'Task created successfully!', 'success');
            document.getElementById('task-form').reset();
            loadTasks();
        } else {
            const data = await response.json();
            console.error('Create task error:', data);
            showMessage('app-message', data.detail || 'Failed to create task', 'error');
        }
    } catch (error) {
        console.error('Network error:', error);
        showMessage('app-message', 'Network error. Please try again.', 'error');
    }
}

async function loadTasks() {
    const status = document.getElementById('filter-status').value;
    const priority = document.getElementById('filter-priority').value;
    const search = document.getElementById('search-input').value;

    let url = `${API_BASE_URL}/tasks?`;
    if (status) url += `status=${status}&`;
    if (priority) url += `priority=${priority}&`;
    if (search) url += `search=${search}&`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            displayTasks(data.tasks);
        } else {
            console.error('Load tasks error:', data);
            showMessage('app-message', 'Failed to load tasks', 'error');
        }
    } catch (error) {
        console.error('Network error:', error);
        showMessage('app-message', 'Network error. Please try again.', 'error');
    }
}

function displayTasks(tasks) {
    const container = document.getElementById('tasks-container');

    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Create your first task above!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-badges">
                    <span class="badge status-${task.status}">${task.status.replace('_', ' ')}</span>
                    <span class="badge priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            ${task.dueDate ? `<div class="task-meta">📅 Due: ${new Date(task.dueDate).toLocaleString()}</div>` : ''}
            <div class="task-meta">Created: ${new Date(task.createdAt).toLocaleDateString()}</div>
            <div class="task-actions">
                ${task.status !== 'COMPLETED' ? `<button class="btn btn-success" onclick="updateTaskStatus('${task.id}', 'COMPLETED')">✓ Complete</button>` : ''}
                <button class="btn btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function updateTaskStatus(taskId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            showMessage('app-message', 'Task updated successfully!', 'success');
            loadTasks();
        } else {
            showMessage('app-message', 'Failed to update task', 'error');
        }
    } catch (error) {
        showMessage('app-message', 'Network error. Please try again.', 'error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            showMessage('app-message', 'Task deleted successfully!', 'success');
            loadTasks();
        } else {
            showMessage('app-message', 'Failed to delete task', 'error');
        }
    } catch (error) {
        showMessage('app-message', 'Network error. Please try again.', 'error');
    }
}

// UI Helper Functions
function showAuth() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('app-section').style.display = 'none';
}

function showApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    document.getElementById('user-name').textContent = `Welcome, ${currentUser.firstName || currentUser.username}!`;
}

function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    
    setTimeout(() => {
        messageEl.className = 'message';
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Search debounce
let searchTimeout;
function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadTasks, 500);
}
