<script>
  import { session, serverURL } from "../../stores/stores.js";
  import { useNavigate } from "svelte-navigator";
  import { link } from "svelte-navigator";
  import io from "socket.io-client";
  import toastr from "toastr";

  export let isLink = false;

  const navigate = useNavigate();

  const socket = io($serverURL);

  async function handleLogout() {
    const url = $serverURL + "/auth/logout";

    try {
      const response = await fetch(url, {
        credentials: "include",
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toastr.success(data.message);
        const username = sessionStorage.getItem("username");
        socket.emit("logout", username);
        sessionStorage.removeItem("username");

        session.set(data.session);
      } else {
        toastr.error("Logout failed");
      }
    } catch (error) {
      console.log(error);
    }

    navigate("/login", { replace: true });
  }
</script>

{#if !isLink}
  <button on:click={handleLogout}> Logout </button>
{:else}
  <a class="nav-link" href="logout" use:link on:click={handleLogout}>
    <i class="bi bi-box-arrow-right" />
  </a>
{/if}
