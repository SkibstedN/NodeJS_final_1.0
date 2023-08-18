<script>
  import io from "socket.io-client";
  import { navigate } from "svelte-navigator";
  import { serverURL, session } from "../../stores/stores.js";
  import toastr from "toastr";

  const socket = io($serverURL);
  let email;
  let password;

  const handleLoginSubmit = async () => {
    const userCredentials = { email: email, password: password };
    try {
      const response = await fetch($serverURL + "/auth/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();

      if (response.ok) {
        toastr.success("Logged in successfully!");
        socket.emit("login", data.username);

        session.set(data.session); // set own session from stores.js

        await checkSession();
      } else {
        toastr.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      toastr.error("Something went wrong, please try again later.");
    }
  };

  const checkSession = async () => {
    const response = await fetch($serverURL + "/auth/checkSession", {
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      if (data.loggedIn) {
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      } else {
        toastr.error("Session check failed. Please try logging in again.");
      }
    }
  };
</script>

<h1 id="indexH1">Welcome to the Exam Project</h1>

<div id="formdiv">
  <h2>Login</h2>
  <form id="login-form" on:submit|preventDefault={handleLoginSubmit}>
    <label for="login-email">Email</label>
    <input type="email" bind:value={email} id="login-email" required />
    <label for="login-password">Password</label>
    <input type="password" bind:value={password} id="login-password" required />

    <div class="form-group text-format row my-3">
      <p class="col">
        Don’t have an account?
        <a class="aStyling" href="/signup"> Sign Up Free! </a>
      </p>
      <a class="col aStyling text-end me-2" href="/forgot-password">
        Forgot password?
      </a>
    </div>

    <button type="submit">Login</button>
  </form>
</div>

<style>
  .form-group {
    margin-bottom: 40px;
    outline: 0px;
  }

  .text-format {
    font-size: 14px;
  }
  .aStyling {
    color: #014f61;
  }
</style>
