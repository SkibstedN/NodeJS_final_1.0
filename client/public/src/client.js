document.addEventListener('DOMContentLoaded', function() {
  const socket = io('http://localhost:5000');

  // Existing socket message handler
  socket.on('message', (data) => {
    console.log('Message from server:', data);
  });

  // Chat feature elements
  const chatbox = document.getElementById('chatbox');
  const chatInput = document.getElementById('chat-input');
  const userList = document.getElementById('user-list');

  // Chat feature event handlers
  if (chatbox && chatInput && userList) {
    // Only proceed with the chat feature setup if all elements are present

    socket.on("receiveMessage", (data) => {
        chatbox.innerHTML += `<p><b>${data.username}:</b> ${data.message}</p>`;
    });

    socket.on("userLogin", (username) => {
        userList.innerHTML += `<li>${username}</li>`;
    });

    socket.on("userLogout", (username) => {
        userList.innerHTML = userList.innerHTML.replace(`<li>${username}</li>`, "");
    });

    // This should be chat-form, not chat-input
    const chatForm = document.getElementById('chat-form');
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = chatInput.value;
        socket.emit("sendMessage", message);
        chatInput.value = '';
    });
}

  // Existing code begins
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const resetPasswordForm = document.getElementById('reset-password-form');

  // Login form functionality
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

          socket.emit("login", data.username);

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

  // Register form functionality
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let username = document.getElementById('register-username').value;
      let email = document.getElementById('register-email').value;
      let password = document.getElementById('register-password').value;

      let requestBody = {
        username: username,
        email: email,
        password: password
      };

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

  // Forgot password form functionality
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let email = document.getElementById('forgot-password-email').value;

      let requestBody = { email: email };

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

  // Reset password form functionality
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
      console.log('Form submitted');
      e.preventDefault();

      const newPassword = document.getElementById('new-password').value;

      const urlPathname = window.location.pathname;
      const token = urlPathname.split('/').pop();

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

  // Logout button functionality
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
