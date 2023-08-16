<script>
  import { onMount } from "svelte";
  import { useParams } from "svelte-navigator";
  import { serverURL, session } from "../../stores/stores.js";
  import toastr from "toastr";

  const params = useParams();

  let beers = [];

  onMount(() => {
    fetchBeers();
  });

  const fetchBeers = async () => {
    const username = $params.username;
    const url = `${$serverURL}/beers/${username}`;
    const response = await fetch(url, {
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      beers = data.data;
    } else {
      toastr.error(data.message);
    }
  };

  const removeBeer = async (beer) => {
    const username = $params.username;
    const url = `${$serverURL}/beers/${username}/${beer._id}`;
    const response = await fetch(url, {
      credentials: "include",
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      beers = beers.filter((b) => b !== beer);
    } else {
      toastr.error(data.message);
    }
  };
</script>

<h1>Beer Picks</h1>
<div class="container-fluid row bg-dark">
  <div class="col mt-4">
    <ul class="beer-list-ul">
      {#if beers.length === 0}
        <h3>No beers have been added</h3>
      {:else}
        {#each beers as beer}
          <li class="content mx-auto">
            <p>{beer.title} {beer.alchool}</p>
            <p>{beer.description}</p>
            <p>{beer.country}</p>
            {#if $session.user.username === $params.username}
              <button id="knap" on:click={() => removeBeer(beer)}>Remove</button
              >
            {/if}
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>

<style>
  .beer-list-ul {
    list-style: none;
    padding: 0;
  }

  .content {
    display: flex;
    flex-direction: column;
    background-color: #707070e6;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    max-width: 550px;
  }
</style>
