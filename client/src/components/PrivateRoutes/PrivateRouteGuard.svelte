<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { session } from "../../stores/stores.js";
  import { SyncLoader } from "svelte-loading-spinners";
  import { onMount } from "svelte";

  // Get the navigate and location functions from Svelte Navigator
  const navigate = useNavigate();
  const location = useLocation();

  // Set isLoading to true initially, meaning we are still loading
  let isLoading = true;

  onMount(async () => {
    // Create a flag to check if the session is already initialized
    let isSessionInitialized = false;

    // Listen for changes in the session store
    session.subscribe((value) => {
      // When the session value changes, set isLoading to false to hide the loading spinner
      isLoading = false;
      if (!isSessionInitialized) {
        isSessionInitialized = true;
        return;
      }

      // If it's not the initial initialization, this means the session value has changed
      // We check if the new 'value' is false, which means the user is not logged in
      if (!value) {
        // If the user is not logged in, we navigate to the login page
        navigate("/login", {
          state: { from: $location.pathname },
          replace: true,
        });
      }
    });
  });
</script>

{#if isLoading}
  <div class="d-flex justify-content-center">
    <SyncLoader size="60" color="#FF3E00" unit="px" duration="1s" />
  </div>
{:else if $session}
  <slot />
{/if}
