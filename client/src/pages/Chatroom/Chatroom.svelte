<script>
    import io from "socket.io-client";
    import { serverURL, session } from "../../stores/stores.js";
    import { onMount, onDestroy } from "svelte";
    import SessionCheck from "../../components/Authentication/SessionCheck.svelte";

    const socket = io($serverURL);

    let messages = [];
    let users = [];
    let chatInput;

    onMount(async () => {
        await getUsers();

        socket.on("userListChanged", (data) => {
            const usersArray = data.map((username) => ({ username }));
            users = usersArray;
        });

        socket.on("receiveMessage", (data) => {
            messages = [...messages, data];
        });

        socket.on("userLogin", (username) => {
            console.log("userLogin event received with username: ", username);
            users = [...users, username];
        });

        socket.on("userLogout", (username) => {
            if (username !== null) {
                console.log(
                    "userLogout event received with username:",
                    username
                );
                users = users.filter((user) => user !== username);
            }
        });
    });

    onDestroy(() => {
        socket.disconnect();
    });

    const getUsers = async () => {
        const response = await fetch($serverURL + "/onlineUsers", {
            credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
            const usersArray = data.map((username) => ({ username }));
            users = usersArray;
        }
    };

    const handleChatSubmit = () => {
        const chatMessage = chatInput;
        const username = $session.user.username;
        socket.emit("sendMessage", { username, message: chatMessage });
        chatInput = "";
    };
</script>

<SessionCheck />

<div class="container-fluid my-4">
    <div class="chat-container mx-auto">
        <h2>Chat</h2>
        <ul class="list-ul">
            {#each messages as message}
                <li class="chat-content my-4">
                    <div class="row">
                        <p><b>{message.username}:</b> {message.message}</p>
                    </div>
                </li>
            {/each}
        </ul>
        <form id="chat-form" on:submit|preventDefault={handleChatSubmit}>
            <input
                id="chat-input"
                type="text"
                placeholder="Enter your message here"
                bind:value={chatInput}
                required
            />
            <button type="submit">Send</button>
        </form>
    </div>

    <div class="user-container mx-auto">
        <h2>Online Users</h2>
        <ul class="list-ul">
            {#if users}
                {#each users as user}
                    <li>{user.username}</li>
                {/each}
            {/if}
        </ul>
    </div>
</div>

<style>
    .chat-container,
    .user-container {
        border: solid black 2px;
        padding: 2em;
        max-width: 550px;
    }

    .list-ul {
        list-style: none;
        padding: 0;
    }

    .chat-content {
        display: flex;
        flex-direction: column;
        background-color: #707070e6;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
    }
</style>
