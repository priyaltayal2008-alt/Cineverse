// fetching API
const API_KEY = "91d67a0a940fe7222ce35ba657c027c2";
let allMovies = [];

async function getMovies() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
        const data = await res.json();
        allMovies = data.results || [];
        displayMovies(allMovies);
    } catch (err) {
        console.error('Failed to load movies', err);
        document.getElementById('movies-container').innerHTML = '<p style="color:var(--muted);text-align:center;width:100%">Failed to load movies.</p>';
    }
}

function createCard(movie){
    const div = document.createElement('div');
    div.className = 'movie-card';

    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/LOGO.png';

    div.innerHTML = `
        <div class="rating-badge">${movie.vote_average ? movie.vote_average.toFixed(1) : 'NA'}</div>
        <img loading="lazy" src="${posterPath}" alt="${escapeHtml(movie.title)} poster" onerror="this.src='assets/LOGO.png'">
        <div class="movie-meta">
            <h3>${escapeHtml(movie.title)}</h3>
            <p>Release: ${movie.release_date || '—'}</p>
        </div>
    `;

    div.addEventListener('click', () => openModal(movie));
    return div;
}

function displayMovies(movies){
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
    if (!movies.length) {
        container.innerHTML = '<p style="color:var(--muted);text-align:center;width:100%">No movies found.</p>';
        return;
    }

    movies.forEach(m => container.appendChild(createCard(m)));
}

// simple escaping
function escapeHtml(s){
    return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

// Slider logic
const slidesEl = document.querySelector('.slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let slideIndex = 0;
let slideCount = document.querySelectorAll('.slide').length;

function showSlide(i){
    slideIndex = (i + slideCount) % slideCount;
    slidesEl.style.transform = `translateX(-${slideIndex * 100}%)`;
}

prevBtn && prevBtn.addEventListener('click', () => showSlide(slideIndex - 1));
nextBtn && nextBtn.addEventListener('click', () => showSlide(slideIndex + 1));

// autoplay
let autoplay = setInterval(() => showSlide(slideIndex + 1), 4500);
;[prevBtn, nextBtn, slidesEl].forEach(el => el && el.addEventListener('mouseenter', () => clearInterval(autoplay)));
;[prevBtn, nextBtn, slidesEl].forEach(el => el && el.addEventListener('mouseleave', () => autoplay = setInterval(() => showSlide(slideIndex + 1), 4500)));

// Modal
const modal = document.getElementById('movie-modal');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalRating = document.getElementById('modal-rating');
const modalOverview = document.getElementById('modal-overview');
const modalClose = document.querySelector('.modal-close');

function openModal(movie){
    modalPoster.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'assets/LOGO.png';
    modalTitle.textContent = movie.title;
    modalRating.textContent = `⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}`;
    modalOverview.textContent = movie.overview || 'No overview available.';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
}

function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
}

modalClose && modalClose.addEventListener('click', closeModal);
modal && modal.addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) closeModal(); });

getMovies();

const searchInput = document.getElementById('searchInput');
const filterRating = document.getElementById('filterRating');
const sortMovies = document.getElementById('sortMovies');

function applyAll() {
    const query = (searchInput.value || '').toLowerCase();
    const rating = filterRating.value;
    const sort = sortMovies.value;

    let result = [...allMovies];

    if (query) result = result.filter(m => (m.title || '').toLowerCase().includes(query));
    if (rating !== 'all') result = result.filter(m => (m.vote_average || 0) >= Number(rating));

    if (sort === 'ratingHigh') result.sort((a,b) => (b.vote_average||0) - (a.vote_average||0));
    else if (sort === 'ratingLow') result.sort((a,b) => (a.vote_average||0) - (b.vote_average||0));
    else if (sort === 'title') result.sort((a,b) => (a.title||'').localeCompare(b.title||''));

    displayMovies(result);
}

searchInput && searchInput.addEventListener('input', applyAll);
filterRating && filterRating.addEventListener('change', applyAll);
sortMovies && sortMovies.addEventListener('change', applyAll);
