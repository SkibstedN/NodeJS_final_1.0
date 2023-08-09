<script>
    import { navigate } from "svelte-navigator";
    import { session } from "../../stores/stores.js";

    const goToBeerPicks = () => {
        navigate(`/beer-picks/${$session.user.username}`, { replace: true });
    };
</script>

<div class="content mx-auto">
    <h2>Your Profile</h2>
    <div class="profile-details">
        <div class="profile-item">
            <label for="username">Username:</label>
            <p>{$session.user.username}</p>
        </div>
        <div class="profile-item">
            <label for="email">Email:</label>
            <p>{$session.user.email}</p>
        </div>
        <div class="profile-item my-2 mx-auto">
            <button on:click={goToBeerPicks}>My Beer Picks</button>
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
