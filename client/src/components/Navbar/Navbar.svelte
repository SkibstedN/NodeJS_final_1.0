<script>
  import { Router, link, Route } from "svelte-navigator";
  import { session } from "../../stores/stores";
  import logo from "../../assets/beer-mug.png";
  import PrivateRoute from "../PrivateRoutes/PrivateRoute.svelte";
  import Logout from "../Authentication/Logout.svelte";
  import Login from "../../pages/Authentication/Login.svelte";
  import Home from "../../pages/Home/Home.svelte";
  import Chatroom from "../../pages/Chatroom/Chatroom.svelte";
  import ForgotPassword from "../../pages/Authentication/ForgotPassword.svelte";
  import Signup from "../../pages/Authentication/Signup.svelte";
  import ResetPassword from "../../pages/Authentication/ResetPassword.svelte";
  import Beer from "../../pages/Beer/Beer.svelte";
  import Users from "../../pages/Users/Users.svelte";
  import PrivateChat from "../../pages/PrivateChat/PrivateChat.svelte";
  import Profile from "../../pages/Profile/Profile.svelte";
  import UserProfile from "../../pages/Profile/UserProfile.svelte";
  import MyBeerPicks from "../../pages/MyBeerPicks/MyBeerPicks.svelte";
</script>

<Router>
  {#if $session}
    <nav
      class="navbar navbar-expand-md bg-body-tertiary navbar-dark"
      data-bs-theme="dark"
    >
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img id="logo" src={logo} width="50" alt="Logo" />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="/" use:link>Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/chatroom" use:link> Chatroom </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/users" use:link> Users </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/beer" use:link> Beer </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/profile" use:link> Profile </a>
            </li>
            <li class="nav-item">
              <Logout isLink={true} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  {/if}

  <Route path="/login">
    <Login />
  </Route>

  <Route path="/signup">
    <Signup />
  </Route>

  <Route path="/forgot-password">
    <ForgotPassword />
  </Route>

  <Route path="/reset-password">
    <ResetPassword />
  </Route>

  <PrivateRoute path="/">
    <Home />
  </PrivateRoute>

  <PrivateRoute path="/chatroom">
    <Chatroom />
  </PrivateRoute>

  <PrivateRoute path="/users">
    <Users />
  </PrivateRoute>

  <PrivateRoute path="/privatechat">
    <PrivateChat />
  </PrivateRoute>

  <PrivateRoute path="/beer">
    <Beer />
  </PrivateRoute>

  <PrivateRoute path="/profile">
    <Profile />
  </PrivateRoute>

  <PrivateRoute path="/profile/:username">
    <UserProfile />
  </PrivateRoute>

  <PrivateRoute path="/beer-picks/:username">
    <MyBeerPicks />
  </PrivateRoute>
</Router>

<style>
  nav {
    display: flex;
    justify-content: center;
    align-self: center;
    font-size: 18px;
    gap: 20px;
    z-index: 3;
  }
</style>
