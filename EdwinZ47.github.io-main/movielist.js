async function getMovieFromDB(){
    try{
        const result = await axios({
        method: 'get',
        url: 'https://my-movie-list-2.herokuapp.com/movies',
        withCredentials: true,
        });
        
        return result.data
    } catch(error){

    }
}

function renderLikeButton(liked, ID){
    if(liked === "true"){
        return(`
        <button class="like-button" data-movieid="${ID}"><img src="thumbs-up.png" alt="thumbs-up" title="Click to dislike" width="50"></button>
        `)
    }else{
        return(`
        <button class="dislike-button" data-movieid="${ID}"><img src="thumbs-down.png" alt="thumbs-down" title="Click to like" width="50"></button>
        `)
    }
}
function renderMovieEntry(movie){
    return(`
    <div class="movie-entry" id="movie-${movie.id}">
        <div class="poster-container">
            <img src="${movie.poster}" alt="Poster of ${movie.title}" width="150">
        </div>
        <div class="title-container">
            <p class="movie-title">${movie.title}</p>
        </div>
        <div class="movie-thoughts">
            ${renderLikeButton(movie.liked, movie.id)}
            <button class="delete-button" data-movieid="${movie.id}">&#10060</button>
        </div>
    </div>
    `)
}

export async function render(){
    const $root = $('#root');
    
    let movieList = await getMovieFromDB();
    movieList.forEach(element => $root.append(renderMovieEntry(element)));

    $(document).on("click", ".like-button", async function(){
        let ID = this.dataset.movieid;
        $(`#movie-${ID} .like-button`).replaceWith(renderLikeButton("false", ID));
        //axios here
        try{
            const result = await axios({
            method: 'put',
            url: `https://my-movie-list-2.herokuapp.com/movies/${ID}`,
            withCredentials: true,
            data:{
                liked: "false"
            }
            });
            return result.data
        } catch(error){
    
        }
    })
 
    $(document).on("click", ".dislike-button", async function(){
        let ID = this.dataset.movieid;
        $(`#movie-${ID} .dislike-button`).replaceWith(renderLikeButton("true", ID));
        //axios here
        try{
            const result = await axios({
            method: 'put',
            url: `https://my-movie-list-2.herokuapp.com/movies/${ID}`,
            withCredentials: true,
            data:{
                liked: "true"
            }
            });
            return result.data
        } catch(error){
    
        }
    })

    $(document).on("click", ".delete-button", async function(){
        let ID = this.dataset.movieid;
        $(`#movie-${ID}`).remove();
        //axios here
        try{
            const result = await axios({
            method: 'delete',
            url: `https://my-movie-list-2.herokuapp.com/movies/${ID}`,
            withCredentials: true
            });
            return result.data
        } catch(error){
    
        }
    })
}

$(function() {
    render();
});