import { store, jwt } from "./login.js";

const isLoggedIn = () => {
  const token = store.get('token');
  const userData = store.get('user');
  return token && userData && jwt.decode(token);
};

const getCurrentPage = () => {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  return filename || 'index.html';
};

const isPublicPage = (pageName) => {
  const publicPages = ['landing.html', 'Login.html'];
  return publicPages.includes(pageName);
};

const handleAuthRedirect = () => {
  const currentPage = getCurrentPage();
  const loggedIn = isLoggedIn();

  console.log('Current page:', currentPage, 'Logged in:', loggedIn);

  if (!loggedIn && !isPublicPage(currentPage)) {
    console.log('Redirecting to landing page');
    window.location.href = 'landing.html';
    return false;
  } else if (loggedIn && isPublicPage(currentPage)) {
    console.log('Redirecting to main page');
    window.location.href = 'index.html';
    return false;
  }

  return true;
};

const initAuthGuard = () => {
  handleAuthRedirect();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      handleAuthRedirect();
    }
  });
};

export { isLoggedIn, handleAuthRedirect, initAuthGuard }; 