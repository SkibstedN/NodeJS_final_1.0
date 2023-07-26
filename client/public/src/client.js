document.addEventListener('DOMContentLoaded', async function() {
  const socket = io('http://localhost:5000');

  // Existing socket message handler
  socket.on('message', (data) => {
    console.log('Message from server:', data);
  });

  // Chat feature elements
  const chatbox = document.getElementById('chatbox');
  const chatInput = document.getElementById('chat-input');
  const userList = document.getElementById('user-list');
  console.log(userList); 

 


  // Chat feature event handlers
  if (chatbox && chatInput && userList) {
    // Only proceed with the chat feature setup if all elements are present

    socket.on("receiveMessage", (data) => {
        chatbox.innerHTML += `<p><b>${data.username}:</b> ${data.message}</p>`;
    });

    socket.on("userLogin", (username) => {
        console.log("userLogin event received with username: ", username);
        userList.innerHTML += `<li>${username}</li>`;
        console.log('User list innerHTML after userLogin:', userList.innerHTML);  
    });

    socket.on("userLogout", (username) => {
      console.log("userLogout event received with username:", username);
      userList.innerHTML = userList.innerHTML.replace(`<li>${username}</li>`, "");
  });


  if (userList) {
  
    async function fetchAndUpdateUserList() {
      const res = await fetch('http://localhost:5000/app/onlineUsers');
      const users = await res.json();
      userList.innerHTML = users.map(user => `<li>${user}</li>`).join('');
    }
  
    // Execute the function immediately to fetch the initial user list
    fetchAndUpdateUserList();
  
    // And also execute it every time the user list changes
    socket.on('userListChanged', fetchAndUpdateUserList);
  }
  

    const chatForm = document.getElementById('chat-form');
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const chatMessage = chatInput.value;
        const username = sessionStorage.getItem('username');
        socket.emit("sendMessage", { username, message: chatMessage });
        chatInput.value = '';
    });
}



// Userlist.html page scripts begins
  const allUsersList = document.getElementById('all-users-list');
  const searchInput = document.getElementById('search-input');

  if (allUsersList && searchInput) {  // Check if you are on the userlist page
    const fetchAllUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users');
        const users = await res.json();

        console.log(users);

        users.forEach(username => {
          const listItem = document.createElement('li');
          listItem.className = 'user-item';
          const usernameText = document.createTextNode(username);
          listItem.appendChild(usernameText);
          const button = document.createElement('button');
          button.className = 'start-chat-button';
          button.innerText = 'Start Private Chat';
          button.addEventListener('click', () => {
            startPrivateChat(username);
          });
          listItem.appendChild(button);
          allUsersList.appendChild(listItem);
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchAllUsers();

    // Add event listener to handle search
    searchInput.addEventListener('keyup', (event) => {
      const filter = event.target.value.toUpperCase();
      const li = allUsersList.getElementsByTagName('li');
      for(let i = 0; i < li.length; i++) {
        const btn = li[i].getElementsByTagName('button')[0];
        const txtValue = btn.textContent || btn.innerText;
        if(txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = '';
        } else {
          li[i].style.display = 'none';
        }
      }
    });
  }
// Userlist.html page scripts ends





 /*     // private rooms chat section begins here
function getRoomID(user1, user2) {
  let users = [user1, user2];
  users.sort();
  let roomID = users.join('-');
  return roomID;
}

function startPrivateChat(otherUser) {
  const username = sessionStorage.getItem('username');
  const roomID = getRoomID(username, otherUser);

  // Emit a "joinRoom" event to the server, passing the room ID
  socket.emit('joinRoom', roomID);

  // Now, when the user sends a chat message, it will be sent only to this room
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = chatInput.value;
    socket.emit('privateMessage', { roomID, username, message });
    chatInput.value = '';
  });
}                  */


  // Existing code begins
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const resetPasswordForm = document.getElementById('reset-password-form');

  // Login form functionality starts
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

          sessionStorage.setItem('username', data.username);
          console.log("emitting login event with username: ", data.username);

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

  //Login form

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
          const username = sessionStorage.getItem('username');
          console.log("emitting logout event for user:", username);

          socket.emit("logout", username);
          sessionStorage.removeItem('username');


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
