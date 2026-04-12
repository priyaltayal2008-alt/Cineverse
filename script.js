/// fetching API ///

const API_KEY = "91d67a0a940fe7222ce35ba657c027c2";
let allMovies = [];

async function getMovies() {
    let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`) ;
    let data = await response.json();

     allMovies = data.results;

    displayMovies(allMovies);

}

function displayMovies(movies){
    let container = document.getElementById("movies-container");
    container.innerHTML = "" ;

     movies.forEach(movie => {
        let div = document.createElement("div");
        div.classList.add("movie-card");

        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        `;

        container.appendChild(div);
    });
}

getMovies()

const searchInput = document.getElementById("searchInput");
const filterRating = document.getElementById("filterRating");
const sortMovies = document.getElementById("sortMovies");

function applyAll() {
    let query = searchInput.value.toLowerCase();
    let rating = filterRating.value;
    let sort = sortMovies.value;

    let result = [...allMovies];

    if (query) {
        result = result.filter(movie =>
            movie.title.toLowerCase().includes(query)
        );
    }

    if (rating !== "all") {
        result = result.filter(movie =>
            movie.vote_average >= rating
        );
    }

    if (sort === "ratingHigh") {
        result.sort((a, b) => b.vote_average - a.vote_average);
    } 
    else if (sort === "ratingLow") {
        result.sort((a, b) => a.vote_average - b.vote_average);
    } 
    else if (sort === "title") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    displayMovies(result);
}

searchInput.addEventListener("input", applyAll);
filterRating.addEventListener("change", applyAll);
sortMovies.addEventListener("change", applyAll);
