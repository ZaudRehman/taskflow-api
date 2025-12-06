// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:8000/api/v1'
    : `${window.location.origin}/api/v1`;

let accessToken = localStorage.getItem('accessToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let categories = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (accessToken && currentUser) {
        showApp();
        loadCategories();
        loadTasks();
    } else {
        showAuth();
    }

    // Form event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('task-form').addEventListener('submit', handleCreateTask);
    document.getElementById('category-form').addEventListener('submit', handleCreateCategory);
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
    
    // Load categories when switching to categories tab
    if (tabName === 'categories') {
        loadCategories();
    }
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
            accessToken = data.access_token;
            currentUser = data.user;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showApp();
            loadCategories();
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
    categories = [];
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    showAuth();
}

// Category Functions
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        console.log('Categories API response:', data); // Debug log

        if (response.ok) {
            // Handle both possible response formats
            categories = data.categories || data || [];
            console.log('Loaded categories:', categories); // Debug log
            updateCategoryDropdown();
            updateCategoryFilter();
            displayCategories(categories);
        } else {
            console.error('Failed to load categories:', data);
        }
    } catch (error) {
        console.error('Load categories error:', error);
    }
}

function updateCategoryDropdown() {
    const select = document.getElementById('task-category');
    if (!select) {
        console.error('Category dropdown not found!');
        return;
    }
    
    select.innerHTML = '<option value="">No Category</option>';
    
    console.log('Updating dropdown with categories:', categories); // Debug log
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    console.log('Dropdown updated, total options:', select.options.length); // Debug log
}

function updateCategoryFilter() {
    const select = document.getElementById('filter-category');
    if (!select) return;
    
    select.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.name}`;
        option.style.color = cat.color;
        select.appendChild(option);
    });
    
    console.log('Category filter updated with', categories.length, 'categories');
}

function displayCategories(cats) {
    const container = document.getElementById('categories-container');

    if (!cats || cats.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No categories yet</h3>
                <p>Create your first category above!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cats.map(cat => `
        <div class="task-item" style="border-left: 5px solid ${cat.color || '#6366f1'}">
            <div class="task-header">
                <div class="task-title">${escapeHtml(cat.name)}</div>
                <div style="width: 40px; height: 40px; background: ${cat.color || '#6366f1'}; border-radius: 8px; border: 2px solid #000;"></div>
            </div>
            ${cat.description ? `<div class="task-description">${escapeHtml(cat.description)}</div>` : ''}
            <div class="task-meta">Created: ${formatDate(cat.created_at)}</div>
            <div class="task-actions">
                <button class="btn btn-danger" onclick="deleteCategory('${cat.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function handleCreateCategory(e) {
    e.preventDefault();

    const categoryData = {
        name: document.getElementById('category-name').value,
        color: document.getElementById('category-color').value,
        description: document.getElementById('category-description').value
    };

    console.log('Creating category:', categoryData); // Debug log

    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(categoryData)
        });

        const data = await response.json();
        console.log('Create category response:', data); // Debug log

        if (response.ok) {
            showMessage('app-message', 'Category created successfully!', 'success');
            document.getElementById('category-form').reset();
            // Reset color to default
            document.getElementById('category-color').value = '#6366f1';
            
            // Reload categories to update dropdown and display
            await loadCategories();
            
            console.log('Categories after creation:', categories); // Debug log
        } else {
            showMessage('app-message', data.detail || 'Failed to create category', 'error');
        }
    } catch (error) {
        console.error('Create category error:', error);
        showMessage('app-message', 'Network error. Please try again.', 'error');
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure? Tasks with this category will remain but become uncategorized.')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            showMessage('app-message', 'Category deleted successfully!', 'success');
            await loadCategories();
            loadTasks();
        } else {
            showMessage('app-message', 'Failed to delete category', 'error');
        }
    } catch (error) {
        showMessage('app-message', 'Network error. Please try again.', 'error');
    }
}

// Task Functions
async function handleCreateTask(e) {
    e.preventDefault();

    const dueDate = document.getElementById('task-due-date').value;
    const categoryId = document.getElementById('task-category').value;
    
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        status: document.getElementById('task-status').value
    };

    if (dueDate) {
        taskData.dueDate = new Date(dueDate).toISOString();
    }

    if (categoryId) {
        taskData.categoryId = categoryId;
    }

    console.log('Creating task with data:', taskData); // Debug log

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
    const categoryId = document.getElementById('filter-category').value;
    const search = document.getElementById('search-input').value;

    let url = `${API_BASE_URL}/tasks?`;
    if (status) url += `status=${status}&`;
    if (priority) url += `priority=${priority}&`;
    if (categoryId) url += `category_id=${categoryId}&`;
    if (search) url += `search=${search}&`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            displayTasks(data.tasks || data);
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

    if (!tasks || tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Create your first task above!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => {
        // Find the category from our loaded categories
        const category = task.category || (task.category_id ? categories.find(c => c.id === task.category_id) : null);
        
        console.log('Task:', task.title, 'Category:', category); // Debug log
        
        return `
        <div class="task-item" ${category ? `style="border-left: 5px solid ${category.color}"` : ''}>
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-badges">
                    ${category ? `<span class="badge" style="background: ${category.color}20; border-color: ${category.color}; color: ${category.color}">${escapeHtml(category.name)}</span>` : ''}
                    <span class="badge status-${task.status}">${task.status.replace('_', ' ')}</span>
                    <span class="badge priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            ${task.due_date ? `<div class="task-meta">📅 Due: ${formatDateTime(task.due_date)}</div>` : ''}
            <div class="task-meta">Created: ${formatDate(task.created_at)}</div>
            <div class="task-actions">
                ${task.status !== 'COMPLETED' ? `<button class="btn btn-success" onclick="updateTaskStatus('${task.id}', 'COMPLETED')">✓ Complete</button>` : ''}
                <button class="btn btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        </div>
    `}).join('');
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
    document.getElementById('user-name').textContent = `Welcome, ${currentUser.first_name || currentUser.username}!`;
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
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Date formatting helpers
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Search debounce
let searchTimeout;
function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadTasks, 500);
}
