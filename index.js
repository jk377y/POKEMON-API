const pokedex = document.getElementById("pokeball");
const searchInput = document.getElementById("searchbar");
const fetchUrl = "https://pokeapi.co/api/v2/pokemon/";
const pokemonCount = 150;

function searchPokemon() {
	const searchTerm = searchInput.value.toLowerCase();
	const cards = Array.from(document.getElementsByClassName("card"));

	cards.forEach((card) => {
		const name = card.querySelector(".cardTitle").textContent.toLowerCase();
		card.style.display = name.includes(searchTerm) ? "list-item" : "none";
	});
}

const fetchPokemon = async () => {
	const response = await fetch(`${fetchUrl}?limit=${pokemonCount}`);
	const data = await response.json();
	const pokemonUrls = data.results.map((result) => result.url);
	const pokemonData = await Promise.all(pokemonUrls.map((url) => fetchPokemonData(url)));
	const pokemon = pokemonData.map((data) => ({
		name: data.name,
		image: data.sprites["front_default"],
		type: data.types.map((type) => type.type.name).join(", "),
		id: data.id,
	}));
	console.log(pokemonData); //has info to use for cardgame
	const sortedPokemon = pokemon.sort((a, b) => a.name.localeCompare(b.name));
	displayPokemon(sortedPokemon);
};

const fetchPokemonData = async (url) => {
	const response = await fetch(url);
	return await response.json();
};

const displayPokemon = (pokemon) => {
	const pokemonHTMLString = pokemon
		.map(
			(pokeman) => `
                <li class="card">
                    <img class="cardImage" src="${pokeman.image}"/>
                    <h2 class="cardTitle"> ${pokeman.name}</h2>
                    <p class="cardSubtitle">Type: ${pokeman.type}</p>
                </li>
            `
		)
		.join("");
	pokedex.innerHTML = pokemonHTMLString;
};

searchInput.addEventListener("input", searchPokemon);
fetchPokemon();
