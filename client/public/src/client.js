document.addEventListener('DOMContentLoaded', function() {
    const socket = io('http://localhost:5000');

    socket.on('message', (data) => {
      console.log('Message from server:', data);
  });

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
            toastr.error(data.error);
          } else {
            toastr.success('Logged in successfully!');
            loginForm.reset();
    
            fetch('http://localhost:5000/app/checkSession')
            .then(response => response.json())
            .then(data => {
              if (data.loggedIn) {
                setTimeout(() => {
                  window.location.href = '/app/frontpage';
                }, 1500);
              } else {
                toastr.error('Session check failed. Please try logging in again.');
              }
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          toastr.error('Something went wrong, please try again later.');
        });
      });
    }
  
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        // Get form values
        let username = document.getElementById('register-username').value;
        let email = document.getElementById('register-email').value;
        let password = document.getElementById('register-password').value;
    
        // Create request body
        let requestBody = {
          username: username,
          email: email,
          password: password
        };
    
        // Send POST request to the register endpoint
        fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            toastr.success('Registered successfully');
            registerForm.reset();
          } else {
            toastr.error('Registration failed');
          }
        })
        .catch((error) => {
          toastr.error('An error occurred');
          console.error('Error:', error);
        });
      });
    }
    

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        // Get email value from form
        let email = document.getElementById('forgot-password-email').value;
    
        // Create request body
        let requestBody = { email: email };
    
        // Send POST request to the forgot password endpoint
        fetch('http://localhost:5000/auth/forgotpassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            toastr.success('Check your email for reset instructions');
          } else {
            toastr.error('Password reset request failed');
          }
        })
        .catch((error) => {
          toastr.error('An error occurred');
          console.error('Error:', error);
        });
      });
    }


    const resetPasswordForm = document.getElementById('reset-password-form');

    if (resetPasswordForm) {
      resetPasswordForm.addEventListener('submit', (e) => {
        console.log('Form submitted');
        e.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
    
        // Get the token from the URL
        const urlPathname = window.location.pathname;
        const token = urlPathname.split('/').pop();
    
        // Send POST request to server with new password and token
        fetch(`http://localhost:5000/auth/resetPassword/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: newPassword }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            toastr.success('Password has been reset successfully');
          } else {
            toastr.error('Password reset failed');
          }
        })
        .catch((error) => {
          toastr.error('An error occurred');
          console.error('Error:', error);
        });
      });
    }
    
    

    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        fetch('http://localhost:5000/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            toastr.success('Logged out successfully');
            setTimeout(() => {
              window.location.href = '/index.html';
            }, 2000);
          } else {
            toastr.error('Logout failed');
          }
        })
        .catch((error) => {
          toastr.error('An error occurred');
          console.error('Error:', error);
        });
      });
    }
    


  });