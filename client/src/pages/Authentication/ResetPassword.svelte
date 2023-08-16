<script>
  import { useLocation, navigate } from "svelte-navigator";
  import { serverURL } from "../../stores/stores.js";
  import toastr from "toastr";

  const location = useLocation();

  let password;
  let confirmPassword;

  const handleResetPasswordSubmit = async () => {
    if (password !== confirmPassword) {
      toastr.success("Confirm password does not match password");
      return;
    }

    const params = new URLSearchParams($location.search);
    const token = params.get("token");

    try {
      const response = await fetch(
        `${$serverURL}/auth/resetPassword/${token}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: password }),
        }
      );

      if (response.ok) {
        toastr.success("Password has been reset successfully");
        navigate("/login", { replace: true });
      } else {
        toastr.error("Password reset failed");
      }
    } catch (error) {
      toastr.error("An error occurred");
      console.error("Error:", error);
    }
  };
</script>

<h1 id="indexH1">Welcome to the Exam Project</h1>

<div class="reset-container">
  <div class="row">
    <div class="col-6 mx-auto forgot-reset-form">
      <h2>Reset Password</h2>
      <form
        id="reset-password-form"
        on:submit|preventDefault={handleResetPasswordSubmit}
      >
        <div class="form-group">
          <label for="new-password">New Password:</label>
          <input
            type="password"
            bind:value={password}
            id="new-password"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirm-new-password">Confirm New Password:</label>
          <input
            type="password"
            bind:value={confirmPassword}
            id="confirm-new-password"
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  </div>
</div>

<style>
  .reset-container {
    border: solid black 2px;
    background-color: rgb(181, 178, 178);
    margin-left: 2em;
    margin-right: 40%;
    padding-left: 1em;
    padding-top: 0.1em;
    padding-bottom: 1.5em;
  }

  .forgot-reset-form {
    margin-top: 25px;
    text-align: left;
  }

  .form-group {
    margin-bottom: 25px;
    outline: 0px;
  }
</style>
