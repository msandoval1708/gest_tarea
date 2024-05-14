document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('tasks');
    const addTaskBtn = document.getElementById('add-task-btn');
    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form').querySelector('form');
    const registrationLink = document.getElementById('show-registration-form');
    const logoutBtn = document.getElementById('logout-btn');
    const loginSection = document.getElementById('login-section');
    const taskSection = document.getElementById('task-section');
    const welcomeMessage = document.getElementById('welcome-message');

    // Dummy user data
    let currentUser = null;

    // Load user data from localStorage if any
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Load tasks from localStorage if any
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${task.title}</strong>: ${task.description}
                <button class="complete-btn" data-index="${index}">Completado</button>
                <button class="edit-btn" data-index="${index}">Editar</button>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            `;
            if (task.completed) {
                li.classList.add('completed');
            }
            taskList.appendChild(li);
        });
    }

    renderTasks();

    // Add new task
    addTaskBtn.addEventListener('click', function() {
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        if (title && description) {
            tasks.push({ title, description, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            clearInputFields();
        }
    });

    // Complete, edit, delete task
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('complete-btn')) {
            const index = e.target.dataset.index;
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            const index = e.target.dataset.index;
            const newTitle = prompt('Nuevo título:', tasks[index].title);
            const newDescription = prompt('Nueva descripción:', tasks[index].description);
            if (newTitle && newDescription) {
                tasks[index].title = newTitle;
                tasks[index].description = newDescription;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            }
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form inputs
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        // Check if user exists and password matches
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            alert('¡Inicio de sesión exitoso!');
            loginForm.reset();
            loginSection.classList.add('hidden');
            taskSection.classList.remove('hidden');
            showUserInfo();
        } else {
            alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    });

    // Registration form submission
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Reset error message
        const errorMessage = document.getElementById('registration-error-message');
        errorMessage.textContent = '';

        // Get form inputs
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value.trim();

        // Validate inputs
        if (!username || !email || !password) {
            errorMessage.textContent = 'Por favor, completa todos los campos.';
            return;
        }

        if (!isValidEmail(email)) {
            errorMessage.textContent = 'Por favor, introduce una dirección de correo electrónico válida.';
            return;
        }

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            errorMessage.textContent = 'El correo electrónico ya está registrado.';
            return;
        }

        // Registration successful
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('¡Registro exitoso!');
        registrationForm.reset();
    });

    // Logout button event
    logoutBtn.addEventListener('click', function() {
        currentUser = null;
        taskSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        hideUserInfo();
    });

    // Toggle registration form visibility
    registrationLink.addEventListener('click', function(event) {
        event.preventDefault();
        registrationForm.parentElement.classList.toggle('hidden');
    });

    // Function to show user information and logout button
    function showUserInfo() {
        welcomeMessage.textContent = `Bienvenido, ${currentUser.username}`;
        document.getElementById('user-info').classList.remove('hidden');
    }

    // Function to hide user information and logout button
    function hideUserInfo() {
        document.getElementById('user-info').classList.add('hidden');
    }

    // Function to clear input fields after adding task
    function clearInputFields() {
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
    }

    function isValidEmail(email) {
        // Regexp para validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
