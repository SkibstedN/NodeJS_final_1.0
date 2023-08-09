<script>
    import { serverURL } from "../../stores/stores.js";
    import toastr from "toastr";

    let email;

    const handleForgotPasswordSubmit = async () => {
        try {
            const response = await fetch($serverURL + "/auth/forgotPassword", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            });

            if (response.ok) {
                toastr.success("Check your email for reset instructions");
            } else {
                toastr.error("Password reset request failed");
            }
        } catch (error) {
            toastr.error("An error occurred");
            console.error("Error:", error);
        }
    };
</script>

<h1 id="indexH1">Welcome to the Exam Project</h1>

<div id="formdiv">
    <h2>Forgot Password</h2>
    <form
        id="forgot-password-form"
        on:submit|preventDefault={handleForgotPasswordSubmit}
    >
        <label for="forgot-password-email">Email :</label>
        <input
            type="email"
            bind:value={email}
            id="forgot-password-email"
            required
        />

        <div class="form-group text-format row my-3">
            <p class="col">
                Go to <a
                    class="aStyling"
                    data-panel=".panel-signup"
                    href="/login">Login!</a
                >
            </p>
        </div>

        <button type="submit">Reset Password</button>
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
