document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: Fetch form inputs and send a request to the server
      });
    }
  
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: Fetch form inputs and send a request to the server
      });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
          e.preventDefault();
          // TODO: Fetch form inputs and send a request to the server
        });
      }

    
    if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // TODO: Send a request to the server to logout the user
    });
    }


  });