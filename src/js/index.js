const moodTextArea = document.getElementById('mood-textarea');
console.log(moodTextArea);
const searchButton = document.getElementById('search-button');
document.addEventListener('DOMContentLoaded', ()=>{
    setupEventListeners();
});

function setupEventListeners(){

    moodTextArea.addEventListener('keypress', (event)=>{
        if(event.key==='Enter' && !event.shiftKey){
            event.preventDefault();
            handleSearch();
        }
    })

    searchButton.addEventListener('click', handleSearch);
}

function handleSearch(){
    const mood = moodTextArea.value.trim();
    console.log(mood);
    if(!mood){
        alert('Preencha o campo de humor!');
        return;
    }
    
}

