<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-navigator";
    import { serverURL, session } from "../../stores/stores.js";
    import SessionCheck from "../../components/Authentication/SessionCheck.svelte";

    let users = [];
    let filteredUsers = [];
    let searchQuery = "";

    onMount(() => {
        fetchAllUsers();
    });

    const fetchAllUsers = async () => {
        try {
            const response = await fetch(`${$serverURL}/api/users`, {
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok) {
                const usersArray = data.map((username) => ({ username }));
                users = usersArray;
                filteredUsers = users.slice();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const searchUsers = () => {
        filteredUsers = users.filter((user) => {
            const query = searchQuery.toLowerCase();
            const isMatch = user.username.toLowerCase().includes(query);

            return isMatch;
        });
    };

    const goToPrivateChat = async (user) => {
        const response = await fetch(`${$serverURL}/chat/private`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: $session.user.username,
                otherUsername: user.username,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            navigate(`/privatechat?roomId=${data.roomId}`, { replace: true });
        }
    };
</script>

<SessionCheck />

<h1>All Users</h1>

<div class="container">
    <input
        type="text"
        id="search-input"
        placeholder="Search users..."
        bind:value={searchQuery}
        on:input={searchUsers}
    />
    <ul class="all-users-list">
        {#if users}
            {#each filteredUsers as user}
                <li class="content my-3 mx-auto d-flex justify-content-center">
                    <p class="username">{user.username}</p>
                    <button
                        class="profile-button me-2"
                        on:click={() =>
                            navigate(`/profile/${user.username}`, {
                                replace: true,
                            })}
                    >
                        Profile
                    </button>
                    <button
                        class="private-chat-button"
                        on:click={() => goToPrivateChat(user)}
                    >
                        Start Private Chat
                    </button>
                </li>
            {/each}
        {/if}
    </ul>
</div>

<style>
    .all-users-list {
        list-style: none;
        padding: 0;
    }

    .content {
        display: flex;
        background-color: #707070e6;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        max-width: 500px;
    }

    .username {
        width: 200px;
        text-align: start;
        font-size: 18px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 5px;
    }

    .profile-button,
    .private-chat-button {
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        padding: 6px 12px;
        transition: background-color 0.3s;
        max-width: 200px;
    }

    .profile-button:hover,
    .private-chat-button:hover {
        background-color: #0056b3;
    }
</style>
