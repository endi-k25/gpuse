document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('gpuse_current_user');
  if (currentUser) {
    window.location.href = 'browse.html';
    return;
  }

  const form = document.querySelector('form.auth-panel') || document.querySelector('form');
  const handleInput = document.getElementById('handle');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm');

  if (!form || !handleInput || !emailInput || !passwordInput || !confirmInput) {
    console.error('Signup form elements not found.');
    return;
  }

  let errorMsg = document.getElementById('signup-error-msg');
  if (!errorMsg) {
    errorMsg = document.createElement('p');
    errorMsg.id = 'signup-error-msg';
    errorMsg.style.color = '#ef4444';
    errorMsg.style.fontSize = '14px';
    errorMsg.style.marginTop = '10px';
    errorMsg.style.marginBottom = '10px';
    errorMsg.style.display = 'none';

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      form.insertBefore(errorMsg, submitBtn);
    } else {
      form.appendChild(errorMsg);
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }

  function clearError() {
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const rawHandle = handleInput.value.trim();
    const handle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (!rawHandle || !email || !password || !confirm) {
      showError('Please fill out all fields.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirm) {
      showError('Passwords do not match.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('gpuse_users') || '[]');

    const emailExists = users.some(u => u.email.toLowerCase() === email);
    if (emailExists) {
      showError('An account with this email already exists. Please log in.');
      return;
    }

    const handleExists = users.some(u => u.handle && u.handle.toLowerCase() === handle.toLowerCase());
    if (handleExists) {
      showError('This handle is already taken. Please choose another.');
      return;
    }

    const newUser = {
      handle: handle,
      name: rawHandle.replace(/^@/, ''),
      email: email,
      password: password,
      registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('gpuse_users', JSON.stringify(users));

    const sessionData = {
      handle: newUser.handle,
      name: newUser.name,
      email: newUser.email,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('gpuse_current_user', JSON.stringify(sessionData));

    window.location.href = 'browse.html';
  });
});