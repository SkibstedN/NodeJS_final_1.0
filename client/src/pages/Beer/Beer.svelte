<script>
    import { onMount } from "svelte";
    import { SyncLoader } from "svelte-loading-spinners";
    import { serverURL } from "../../stores/stores.js";
    import SessionCheck from "../../components/Authentication/SessionCheck.svelte";
    import toastr from "toastr";

    let beers = [];
    let filteredBeers = [];
    let country = "all";
    let searchQuery = "";

    onMount(() => {
        fetchBeers();
    });

    const fetchBeers = async () => {
        try {
            const response = await fetch(
                "https://beers-list.p.rapidapi.com/beers/",
                {
                    method: "GET",
                    headers: {
                        "X-RapidAPI-Key":
                            "ce6f83eba4mshb94aa982a20c0b1p17b61djsnd684cb1717a1",
                        "X-RapidAPI-Host": "beers-list.p.rapidapi.com",
                    },
                }
            );
            const data = await response.json();
            beers = data.filter(
                (beer) =>
                    !beer.title.includes("�") && !beer.description.includes("�")
            );
            filteredBeers = beers.slice();
        } catch (error) {
            console.error(error);
        }
    };

    const searchBeers = () => {
        filteredBeers = beers.filter((beer) => {
            const query = searchQuery.toLowerCase();
            const isMatch = beer.title.toLowerCase().includes(query);

            const isCountryMatch =
                country === "all" ||
                beer.country.toLowerCase().includes(country.toLowerCase());
            return isMatch && isCountryMatch;
        });
    };

    const addToMyBeerPicks = async (beer) => {
        const response = await fetch($serverURL + "/user/beers", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(beer),
        });

        const data = await response.json();
        if (response.ok) {
            toastr.success(data.message);
        } else {
            toastr.error(data.message);
        }
    };
</script>

<SessionCheck />

<h1>Beers from {country}</h1>
<!-- <h1>Beers from {country.charAt(0).toUpperCase() + country.slice(1)}</h1> -->

<div class="container-fluid row">
    <div class="beers-content col mt-4">
        {#if beers.length === 0}
            <div class="d-flex justify-content-center">
                <SyncLoader size="60" color="#FF3E00" unit="px" duration="1s" />
            </div>
        {:else}
            <ul class="list-ul">
                {#each filteredBeers as beer}
                    <li class="content mx-auto">
                        <p>{beer.title} {beer.alchool}</p>
                        <p>{beer.description}</p>
                        <button on:click={() => addToMyBeerPicks(beer)}>
                            Add to My Beer Picks
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    <div class="col-2 sticky-top filter">
        <div class="search-bar">
            <input
                class="search"
                type="text"
                placeholder="Search..."
                bind:value={searchQuery}
                on:input={searchBeers}
            />
        </div>

        <hr />

        <div class="countries">
            <p>Select country</p>
            <div class="ms-3 mt-2">
                <label for="all">
                    <input
                        type="radio"
                        name="country"
                        id="all"
                        value="all"
                        bind:group={country}
                        on:change={searchBeers}
                    />
                    All
                </label>
                <label for="denmark">
                    <input
                        type="radio"
                        name="country"
                        id="denmark"
                        value="denmark"
                        bind:group={country}
                        on:change={searchBeers}
                    />
                    Denmark
                </label>
                <label for="ireland">
                    <input
                        type="radio"
                        name="country"
                        id="ireland"
                        value="ireland"
                        bind:group={country}
                        on:change={searchBeers}
                    />
                    Ireland
                </label>
                <label for="norway">
                    <input
                        type="radio"
                        name="country"
                        id="norway"
                        value="norway"
                        bind:group={country}
                        on:change={searchBeers}
                    />
                    Norway
                </label>
                <label for="malta">
                    <input
                        type="radio"
                        name="country"
                        id="malta"
                        value="malta"
                        bind:group={country}
                        on:change={searchBeers}
                    />
                    Malta
                </label>
                <label for="poland">
                    <input
                        type="radio"
                        name="country"
                        id="poland"
                        value="poland"
                        bind:group={country}
                        on:change={searchBeers}
                    />
                    Poland
                </label>
            </div>
        </div>
    </div>
</div>

<style>
    .beers-content {
        margin-left: 200px; /* the length of filter box pushed, so it's center */
    }

    .list-ul {
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

    .filter {
        background-color: #707070e6;
        color: #c6d4df;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 200px;
        height: 270px;
        margin-top: 25px;
        padding: 10px;
        top: 50px;
    }

    .search-bar {
        display: flex;
        align-items: center;
    }

    .search {
        display: flex;
        align-items: center;
        height: 35px;
        width: 100%;
        background-color: #2b3035;
        border-radius: 10px;
        padding: 5px 10px;
    }

    .search::placeholder {
        color: #e0e0e0e6;
    }

    .countries p {
        font-weight: bold;
        margin: 0;
    }

    .countries label {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .countries input[type="radio"] {
        margin-right: 10px;
        transform: scale(1.25);
    }
</style>
