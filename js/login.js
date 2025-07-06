export const store = {
    data: {},
    set: (k, v) => {
        store.data[k] = v;
        try {
            localStorage.setItem('technest_' + k, JSON.stringify(v));
        } catch (e) { }
    },
    get: (k) => {
        if (store.data[k]) return store.data[k];
        try {
            const item = localStorage.getItem('technest_' + k);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    },
    remove: (k) => {
        delete store.data[k];
        try {
            localStorage.removeItem('technest_' + k);
        } catch (e) { }
    }
};

export const jwt = {
    create: (payload) => {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 86400000 }));
        return `${header}.${body}.signature`;
    },
    decode: (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() ? payload : null;
        } catch { return null; }
    }
};

let users = store.get('users') || [];

export function show(id) {
    const forms = document.querySelectorAll('.form, .dashboard');
    if (forms.length === 0) return;

    forms.forEach(el => el.classList.remove('active'));

    const targetElement = document.getElementById(id);
    if (targetElement) {
        targetElement.classList.add('active');
    }

    clearMessages();
}

export function msg(text, type = 'error') {
    switch (type) {
        case 'success':
            showSuccessAlert(text);
            break;
        case 'warning':
            showWarningAlert(text);
            break;
        case 'info':
            showInfoAlert(text);
            break;
        default:
            showErrorAlert(text);
            break;
    }
}

export function shakeInput(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }
}

export function clearMessages() {
    closeAllAlerts();
}

export function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (loading) {
        btn.innerHTML = '<span class="loading"></span>Processing...';
        btn.disabled = true;
    } else {
        btn.innerHTML = btnId === 'loginBtn' ? 'Sign In' : 'Register';
        btn.disabled = false;
    }
}

export function checkPasswordStrength(password) {
    const fill = document.getElementById('strengthFill');
    if (!fill) return;

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;

    fill.className = 'strength-fill';
    if (strength >= 1) fill.classList.add('strength-weak');
    if (strength >= 2) fill.classList.add('strength-fair');
    if (strength >= 3) fill.classList.add('strength-good');
    if (strength >= 4) fill.classList.add('strength-strong');
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        msg('Please fill all fields');
        if (!name) shakeInput('registerName');
        if (!email) shakeInput('registerEmail');
        if (!password) shakeInput('registerPassword');
        return;
    }

    if (!isValidEmail(email)) {
        msg('Please enter valid email');
        shakeInput('registerEmail');
        return;
    }

    if (password.length < 6) {
        msg('Password must be at least 6 characters');
        shakeInput('registerPassword');
        return;
    }

    if (users.find(u => u.email === email)) {
        msg('Email already exists');
        shakeInput('registerEmail');
        return;
    }

    setLoading('registerBtn', true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = {
        id: Date.now().toString(),
        name, email, password,
        joinDate: new Date().toLocaleDateString(),
        avatar: name.charAt(0)
    };

    users.push(user);
    store.set('users', users);

    const token = jwt.create({ userId: user.id, email });
    store.set('token', token);
    store.set('user', user);

    setLoading('registerBtn', false);
    msg('Account created successfully!', 'success');

    setTimeout(() => {
        updateDashboard(user);
        show('dashboard');
        showNavbar();
        document.getElementById('loginTitle').textContent = 'Welcome';

        setTimeout(() => {
            window.location.href = 'index.html?login=success';
        }, 0);
    }, 200);
}

export async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        msg('Please enter email and password');
        if (!email) shakeInput('loginEmail');
        if (!password) shakeInput('loginPassword');
        return;
    }

    if (!isValidEmail(email)) {
        msg('Please enter valid email');
        shakeInput('loginEmail');
        return;
    }

    setLoading('loginBtn', true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        setLoading('loginBtn', false);
        msg('Invalid credentials');
        shakeInput('loginEmail');
        shakeInput('loginPassword');
        return;
    }

    const token = jwt.create({ userId: user.id, email });
    store.set('token', token);
    store.set('user', user);

    setLoading('loginBtn', false);
    msg('Welcome back!', 'success');

    setTimeout(() => {
        updateDashboard(user);
        show('dashboard');
        showNavbar();
        document.getElementById('loginTitle').textContent = 'Welcome';

        window.location.href = 'index.html?login=success';
    }, 500);
}

export function logout() {
    store.remove('token');
    store.remove('user');

    const loginTitle = document.getElementById('loginTitle');
    if (loginTitle) {
        loginTitle.textContent = 'Login';
    }

    const inputs = document.querySelectorAll('input');
    if (inputs.length > 0) {
        inputs.forEach(i => i.value = '');
    }

    show('loginForm');
    hideNavbar();

    setTimeout(() => {
        window.location.href = 'landing.html';
    }, 0);
}

export function updateDashboard(user) {
    const userName = document.getElementById('userName');
    const navbarUser = document.getElementById('navbarUser');
    const userEmail = document.getElementById('userEmail');
    const joinDate = document.getElementById('joinDate');
    const userAvatar = document.getElementById('userAvatar');

    if (userName) userName.textContent = user.name;
    if (navbarUser) navbarUser.textContent = user.name;
    if (userEmail) userEmail.textContent = user.email;
    if (joinDate) joinDate.textContent = user.joinDate;
    if (userAvatar) userAvatar.textContent = user.avatar;
}

export function showNavbar() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.classList.add('active');
    }
}

export function hideNavbar() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.classList.remove('active');
    }
}

export function deleteAccount() {
    if (!confirm('Are you sure you want<br>To delete your account?')) {
        return;
    }

    const user = store.get('user');
    if (!user) {
        msg('No user found');
        return;
    }

    users = users.filter(u => u.id !== user.id);
    store.set('users', users);

    store.remove('token');
    store.remove('user');

    const loginTitle = document.getElementById('loginTitle');
    if (loginTitle) {
        loginTitle.textContent = 'Login';
    }

    const inputs = document.querySelectorAll('input');
    if (inputs.length > 0) {
        inputs.forEach(i => i.value = '');
    }

    show('loginForm');
    hideNavbar();

    msg('Account deleted successfully', 'success');
    window.location.href = 'landing.html';
}

export function showLogin() { show('loginForm'); }
export function showRegister() { show('registerForm'); }

document.addEventListener('DOMContentLoaded', () => {
    if (users.length === 0) {
        users.push({
            id: 'demo',
            name: 'Samuel',
            email: 'demo@technest.com',
            password: 'demo123',
            joinDate: new Date().toLocaleDateString(),
            avatar: 'S'
        });
        store.set('users', users);
    }

    const token = store.get('token');
    const userData = store.get('user');
    if (token && userData && jwt.decode(token)) {
        updateDashboard(userData);
        show('dashboard');
        showNavbar();

        const loginTitle = document.getElementById('loginTitle');
        if (loginTitle) {
            loginTitle.textContent = 'Welcome';
        }
    }
});

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm && loginForm.classList.contains('active')) login();
        else if (registerForm && registerForm.classList.contains('active')) register();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const activeForm = document.querySelector('.form.active');
        if (!activeForm) return;

        const focusableElements = activeForm.querySelectorAll('input, button, a');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

const passwordInput = document.getElementById('registerPassword');
if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });
}