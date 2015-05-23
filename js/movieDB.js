    var value = '';  //radio button value


	var base_image_url = 'https://image.tmdb.org/t/p/w185/';


	function filterData(data){
		//poster_path: https://image.tmdb.org/t/p/w185/t90Y3G8UGQp0f0DrP60wRu9gfrH.jpg
		
		var random = Math.ceil(Math.random()*20);
		targetWord = data.results[random].name;
		image = data.results[random].profile_path;
		image_path = base_image_url + image;		
		resetGame(targetWord);
	}

	function displayError(e){
		console.log(e);
	}
	//call moviedb
	var url = '/person/popular',  //return 20 results
		randomPage = Math.ceil(Math.random() * 5), //get page 1-5, each page has 20 actors
		params = {"page": randomPage },
		success = filterData,
		error = displayError;


	function searchMovies(){
		tmdb.call(url, params, success, error);

	}

	function newGame(){
		 switch(value) {
		 	case "movieStar":
		 		//trigger a click
				$('input[type=radio]:checked').trigger('click');
				break;
			default:
	    		resetGame();
	    		break;
	    }
	}

$(document).ready(function() {
	$('input[type="radio"]').on('click', function(e){
        value = (this.value);
        
        switch(value) {
        	case "movieStar":
        		searchMovies();
        		//setTimeout(drawWord, 2000);        		
        		break;
        	default:
        		resetGame();
        		break;
        }

    })
    
});

