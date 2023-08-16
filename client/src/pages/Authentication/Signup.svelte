<script>
  import { navigate } from "svelte-navigator";
  import { serverURL } from "../../stores/stores.js";
  import toastr from "toastr";

  let username;
  let email;
  let password;

  const handleRegisterSubmit = async () => {
    const requestBody = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await fetch($serverURL + "/auth/register", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toastr.success("Registered successfully");
        navigate("/login", { replace: true });
      } else {
        toastr.error("Registration failed");
      }
    } catch (error) {
      toastr.error("An error occurred");
      console.error("Error:", error);
    }
  };
</script>

<h1 id="indexH1">Welcome to the Exam Project</h1>

<div id="formdiv">
  <h2>Register</h2>
  <form id="register-form" on:submit|preventDefault={handleRegisterSubmit}>
    <label for="register-username">Username:</label>
    <input type="text" bind:value={username} id="register-username" required />
    <label for="register-email">Email:</label>
    <input type="email" bind:value={email} id="register-email" required />
    <label for="register-password">Password:</label>
    <input
      type="password"
      bind:value={password}
      id="register-password"
      required
    />

    <div class="form-group text-format row my-3">
      <p class="col">
        Go to <a class="aStyling" data-panel=".panel-signup" href="/login"
          >Login!</a
        >
      </p>
    </div>
    <button type="submit">Register</button>
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
