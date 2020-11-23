function debounce(fn, delay) {
    let timeoutID;
    return function(){
        if(timeoutID){
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout( ()=>{
            fn();
        }, delay)
    };
};

let movieIDs;

function renderSearchEntry(movie, index){
    if(movieIDs.includes(movie.imdbID)){
        return(`
            <div class="search-result-container">
                <div class="search-result-entry" id="${movie.Title}">
                    <img src="${movie.Poster}" alt="Poster of ${movie.Title}" width="150">
                    <p>${movie.Title}</p>
                    <label for="thoughts">How was the movie?</label>
                    <select class="thoughts${index}"><option value="true">Good!</option><option value="false">Bad!</option></select>
                    <p>Watched!</p>
                </div>
            </div>
        `)}else{
        return(`
            <div class="search-result-container">
                <div class="search-result-entry" id="${movie.Title}">
                    <img src="${movie.Poster}" alt="Poster of ${movie.Title}" width="150">
                    <p>${movie.Title}</p>
                    <label for="thoughts">How was the movie?</label>
                    <select class="thoughts${index}"><option value="true">Good!</option><option value="false">Bad!</option></select>
                    <button class="add-button" id="button${index}" data-buttonid=${index}>Add to my list</button>
                </div>
            </div>
        `)}
}

export async function renderWatchedSomething(){
    const $root = $('#root');

    try{
        const result = await axios({
        method: 'get',
        url: 'https://my-movie-list-2.herokuapp.com/movies',
        withCredentials: true,
        });
        
        movieIDs = result.data.map(element => element.id);
    } catch(error){

    }

    let arr;
    $(document).on("keydown", "#movie-search-field", debounce(async function(){
        axios.get(`https://www.omdbapi.com/?apikey=16033043&s=${document.getElementById("movie-search-field").value}`)
        .then(function(response){
            arr = response.data.Search;
            $root.empty();
            arr.forEach((element, index) => $root.append(renderSearchEntry(element, index)));
        })
        .catch(function(error){
        })
        .finally(function(){
        })
    }, 1000))

    $(document).on("click", ".add-button", async function() {
        let index = this.dataset.buttonid;
        let obj = {id: arr[index].imdbID, user: localStorage.getItem("user"), title: arr[index].Title, liked: String($(`.thoughts${index}`).val()), poster: arr[index].Poster}
        $(`.add-button#button${index}`).replaceWith(`<p>Added!</p>`)
        //axio here
        try{
            const result = await axios({
            method: 'post',
            url: `https://my-movie-list-2.herokuapp.com/movies`,
            withCredentials: true,
            data: obj
            });
            return result.data
        } catch(error){
    
        }
    });
}

$(function() {
    renderWatchedSomething();
});