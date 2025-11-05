//DOM Elements
const moodInput = document.getElementById('mood-input');
const searchButton = document.getElementById('search-button');

//Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateSearchButton();
});

    //Event Listeners
    function setupEventListeners(){
        //Input change listener
        moodInput.addEventListener('input', function (){
            updateSearchButton();
        });

        //Enter key listener
        moodInput.addEventListener('keypress', function (e){
            if (e.key === 'Enter' && !e.shifkey){
                e.preventDefault();
                if(!searchButton.disabled){
                    handleSearch();
                }
            }
        });
        //Search button listener
        searchButton.addEventListener('click', handleSearch);
    }



//update search button state
    function updateSearchButton(){
        const hasText =moodInput.value.trim().length>0;
        searchButton.disabled = !hasText;
    }

async function handleSearch() {
    const mood = moodInput.value.trim();
    
    if (!mood) {
        alert('Por favor, descreva o que você quer assistir!');
        return;
    }

    const originalText=searchButton.innerHTML;
    searchButton.innerHTML = '<span style="animation: pulse 1s infinite;">🔍 Buscando...</span>';
    searchButton.disabled=true;

    const prompt =JSON.stringify({userPrompt: mood});

    try{
          //fazer POST para o webhook do N8N
    const response = await fetch('https://nasielli.app.n8n.cloud/webhook/botflix', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: prompt
    });
    const data = await response.json();
    if (data && Array.isArray(data.results) && data.results.length > 0) {
        const movie = data.results[0];
    
        let posterUrl = movie.poster_path || '';
        if(posterUrl && !/^https?:\/\//.test(posterUrl)){
            posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        }
        // Novo formato: data.results (TMDB padrão)
        const resultsDiv = document.getElementById('results');
        const moviesGrid = document.getElementById('movies-grid');
        if(resultsDiv && moviesGrid){
            resultsDiv.style.display='block';

        moviesGrid.innerHTML = `<div class="movie-card">
            <div class="movie-poster">
                <img src="${posterUrl}" alt="${movie.title}"/>
            </div>
                <div class="movie-info"
                <div class="movie-title">${movie.title}</div>
                <div class="movie-overview">${movie.overview || "Sem descrição."}</div>
                <div class="movie-rating">⭐ ${movie.vote_average.toFixed() || "N/A"} /10</div>
            </div>
        </div>`;
        }else{
        alert('Não foi possível exibier o resultado. Elementos não encontrados.');
    }
    } else {
        alert('Nenhum filme encontrado para sua busca.');
    }    
    } catch(error){
        console.error('Erro ao fazer a requisição:', error);
        alert('Erro ao buscar filme. Tente novamente.');
    }finally{
        //Reset button
        searchButton.innerHTML = originalText;
        updateSearchButton();
    }
    
}

