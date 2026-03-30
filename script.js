let index = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function showSlide(i) {
    slides.forEach((slide, idx) => {
        slide.style.display = "none";
    });

    slides[i].style.display = "block";
}

function nextSlide() {
    index = (index + 1) % totalSlides;
    showSlide(index);
}

function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    showSlide(index);
}

setInterval(nextSlide, 3000);

document.querySelector(".next").addEventListener("click", nextSlide);
document.querySelector(".prev").addEventListener("click", prevSlide);

showSlide(index);










const API_KEY = "91d67a0a940fe7222ce35ba657c027c2";

async function getMovies() {
    let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`) ;
    let data = await response.json();

    displayMovies(data.results);

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
            <p>⭐ ${movie.vote_average}</p>
        `;

        container.appendChild(div);
    });
}

getMovies()
