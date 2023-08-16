<script>
  import { onMount, onDestroy } from "svelte";
  import { serverURL, session } from "../../stores/stores.js";
  import { navigate, useLocation } from "svelte-navigator";
  import io from "socket.io-client";

  const location = useLocation();

  let socket = null;
  let roomId = null;
  let messages = [];
  let newMessage = "";

  onMount(() => {
    getAllMessages();

    socket = io($serverURL);
    socket.emit("joinPrivateChatRoom", roomId);
    socket.on("privateChatMessage", (message) => {
      messages = [...messages, message];
    });
  });

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  });

  const getAllMessages = async () => {
    const urlParams = new URLSearchParams($location.search);
    roomId = urlParams.get("roomId");

    const response = await fetch(`${$serverURL}/chat/message/${roomId}`);
    const data = await response.json();
    if (response.ok) {
      messages = data.chatHistory;
    } else {
      console.error("Failed to get users:");
    }
  };

  const sendPrivateMessage = async () => {
    if (newMessage === "") return; // Ignore empty messages

    const messageData = {
      roomId: roomId,
      username: $session.user.username,
      messageContent: newMessage,
    };

    const response = await fetch(`${$serverURL}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (response.ok) {
      socket.emit("sendPrivateMessage", messageData);

      newMessage = ""; // Clear the input field after sending the message
    }
  };

  const goBackToUserList = () => {
    navigate("/users");
  };
</script>

<div class="container bg-dark">
  <h2>Private Chat</h2>

  <button class="goback-button my-2" on:click={goBackToUserList}>
    Go Back
  </button>

  <ul class="privatechatbox mx-auto">
    <li class="content-header my-3 mx-auto row">
      <p class="username col-4">Username</p>
      <p class="msg-content col-auto">Message</p>
    </li>
    {#if messages}
      {#each messages as message}
        <li class="content my-3 mx-auto row">
          <p class="username col-4">{message.sender}:</p>
          <p class="msg-content col-auto">{message.content}</p>
        </li>
      {/each}
    {/if}
  </ul>
  <input
    id="private-chat-input"
    type="text"
    bind:value={newMessage}
    placeholder="Enter your message here"
  />
  <button on:click={sendPrivateMessage}>Send</button>
</div>

<style>
  .privatechatbox {
    list-style: none;
    max-height: 500px;
    max-width: 600px;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow-y: auto;
  }

  .content-header {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    max-width: 500px;
    font-size: 18px;
    font-weight: bold;
  }

  .content {
    display: flex;
    align-items: center;
    background-color: #707070e6;
    border-radius: 5px;
    padding: 10px;
    max-width: 500px;
  }

  .username {
    width: 150px;
    text-align: start;
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }

  .msg-content {
    font-size: 14px;
    margin: 0;
  }

  .goback-button {
    font-weight: bold;
    font-size: 14px;
    padding: 8px 12px;
    letter-spacing: 1px;
  }
</style>
