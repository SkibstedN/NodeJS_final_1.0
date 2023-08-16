<script>
  import { onMount } from "svelte";
  import { navigate, useParams } from "svelte-navigator";
  import { serverURL } from "../../stores/stores.js";
  import toastr from "toastr";

  const params = useParams();

  let user = {};

  onMount(() => {
    fetchUser();
  });

  async function fetchUser() {
    const username = $params.username;
    const response = await fetch(`${$serverURL}/user/profile/${username}`, {
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      user = data.data;
    } else {
      toastr.error(data.message);
    }
  }

  const goToBeerPicks = () => {
    navigate(`/beer-picks/${user.username}`, { replace: true });
  };
</script>

<div class="content mx-auto">
  <h2>{user.username} Profile</h2>
  <div class="profile-details">
    <div class="profile-item">
      <label for="username">Username:</label>
      <p>{user.username}</p>
    </div>
    <div class="profile-item">
      <label for="email">Email:</label>
      <p>{user.email}</p>
    </div>
    <div class="profile-item my-2 mx-auto">
      <button on:click={goToBeerPicks}>{user.username} Beer Picks</button>
    </div>
  </div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    background-color: #707070e6;
    border-radius: 5px;
    margin-top: 20px;
    padding: 20px;
    max-width: 500px;
  }

  .profile-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .profile-item {
    display: flex;
    align-items: center;
  }

  label {
    font-weight: bold;
    margin-right: 10px;
  }

  p {
    margin: 0;
  }
</style>
