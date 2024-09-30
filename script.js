let adminCredentials = { username: "admin", password: "admin123" };
let userCredentials = { username: "user", password: "user123" };
let loggedInRole = null;
let passwords = [];
let idCounter = 1;
let editId = null;

// Load passwords from localStorage
window.onload = function() {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
        passwords = JSON.parse(storedPasswords);
        idCounter = passwords.length ? Math.max(...passwords.map(p => p.id)) + 1 : 1; // Ensure unique ID for new passwords
        renderPasswords();
    }
};

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`.nav-link[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === adminCredentials.username && password === adminCredentials.password) {
        loggedInRole = 'admin';
        document.getElementById('roleDisplay').innerText = 'Admin';
        showSection('passwordManager');
        renderPasswords();
    } else if (username === userCredentials.username && password === userCredentials.password) {
        loggedInRole = 'user';
        document.getElementById('roleDisplay').innerText = 'User';
        showSection('passwordManager');
        renderPasswords();
    } else {
        document.getElementById('loginError').innerText = 'Invalid username or password!';
    }
}

function logout() {
    loggedInRole = null;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').innerText = '';
    showSection('login');
}

function toggleAddPasswordForm() {
    const form = document.getElementById('addPasswordForm');
    form.classList.toggle('hidden');
}

function addPassword() {
    const appName = document.getElementById('appName').value;
    const username = document.getElementById('passwordUsername').value;
    const passwordValue = document.getElementById('passwordValue').value;

    if (appName && username && passwordValue) {
        passwords.push({ id: idCounter++, appName, username, passwordValue });
        localStorage.setItem('passwords', JSON.stringify(passwords));
        renderPasswords();
        toggleAddPasswordForm();
        clearAddPasswordForm();
    }
}

function renderPasswords() {
    const tableBody = document.getElementById('passwordTable');
    tableBody.innerHTML = '';
    passwords.forEach((password, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${password.appName}</td>
            <td>${password.username}</td>
            <td>${password.passwordValue}</td>
            <td>
                <button class="btn btn-secondary" onclick="openEditCard(${password.id})">Edit</button>
                <button class="btn btn-danger" onclick="openDeleteCard(${password.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function clearAddPasswordForm() {
    document.getElementById('appName').value = '';
    document.getElementById('passwordUsername').value = '';
    document.getElementById('passwordValue').value = '';
}

function openEditCard(id) {
    const password = passwords.find(p => p.id === id);
    if (password) {
        document.getElementById('editAppName').value = password.appName;
        document.getElementById('editUsername').value = password.username;
        document.getElementById('editPassword').value = password.passwordValue;
        editId = id;
        document.getElementById('editCard').classList.remove('hidden');
    }
}

function saveEdit() {
    if (editId) {
        const password = passwords.find(p => p.id === editId);
        if (password) {
            password.appName = document.getElementById('editAppName').value;
            password.username = document.getElementById('editUsername').value;
            password.passwordValue = document.getElementById('editPassword').value;
            localStorage.setItem('passwords', JSON.stringify(passwords));
            renderPasswords();
            closeCard('editCard');
        }
    }
}

function openDeleteCard(id) {
    editId = id;
    document.getElementById('deleteCard').classList.remove('hidden');
}

function confirmDelete() {
    if (editId) {
        passwords = passwords.filter(p => p.id !== editId);
        localStorage.setItem('passwords', JSON.stringify(passwords));
        renderPasswords();
        closeCard('deleteCard');
    }
}

function closeCard(cardId) {
    document.getElementById(cardId).classList.add('hidden');
}
