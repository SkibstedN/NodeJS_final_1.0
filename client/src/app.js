document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
    
        fetch('http://localhost:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            // Show error message
            toastr.error(data.error);
          } else {
            // Show success message and clear the form
            toastr.success('Logged in successfully!');
            loginForm.reset();

            setTimeout(() => {
              window.location.href = 'frontpage.html';
            }, 3000); 

          }
        })
        .catch(error => {
          console.error('Error:', error);
          // Show error message
          toastr.error('Something went wrong, please try again later.');
        });
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