<script>
  import { onMount } from "svelte";
  import { session, serverURL } from "../../stores/stores.js";

  onMount(async () => {
    const response = await fetch($serverURL + "/auth/checkSession", {
      credentials: "include",
    });
    const data = await response.json();
    session.set(data.session);
  });
</script>
