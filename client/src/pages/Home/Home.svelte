<script>
    import Logout from "../../components/Authentication/Logout.svelte";
    import frontPageImage from "../../assets/beerchatting.jpeg";

</script>

<h3>Welcome to Beer Chat</h3>

<Logout isLink={false} />

<a href="/chatroom"><h2>Go to the chatroom</h2></a>

<div><img class="imgStyle" src={frontPageImage} alt="void"></div>

<style>
    .imgStyle{
        object-fit: contain;
        max-width: 500px;
    } 
</style>
