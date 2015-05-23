//global variables
var wordlist = [],
	targetWord = '',
	guesses = [],
	livesRemaining = maxLives = 6;


//set image class to display hangman image accordingly
function setImage(number){
	$('#hangman_img').removeClass().addClass("image" + number);
}

function loadWordlist() {
    var word = '';
    $.ajax({
        url: 'assets/wordlist.json',
        dataType: "json",
        async: false
    }).done(function(data) {
        for (word in data) {
            wordlist.push(data[word]);
        }
    }, 'json');
}

function newWord(){
	targetWord = wordlist[Math.floor(Math.random() * wordlist.length)];
}

function drawWord(){
	while (targetWord == '') {
		newWord();
	}
	$('#targetWord').html(obfuscateWord());
}

function drawGuesses(){
	guesses.sort();
	$('#previousGuesses').html(guesses.join(','));
}

function addGuess(){
	var guess = $('#guess').val();

	if(/^[a-zA-Z]*$/.test(guess) && typeof guess !== "undefined"){
		guesses.push(guess.toLowerCase());
	}
	$('#guess').val('');
}

//clean duplicate guess character
function cleanGuess(){
	var uniqueGuesses = [];
	//$.inArray(val, arr) search specific val in arrary, return -1 if not found
	$.each(guesses, function(index, element){
		if(element.length > 0 && $.inArray(element, uniqueGuesses) == -1){
			uniqueGuesses.push(element);
		}
	});
	guesses = uniqueGuesses;
}

function reviewLives(){
	var string = targetWord.toLowerCase();

	for(var i = 0; i < guesses.length; i++){
		if (string.indexOf(guesses[i], 0) == -1) { //not found
			livesRemaining--;
		}
	}

	if (livesRemaining <= 0){
		setImage(0);
		endGameDialog(false);
		return;
	}

	setImage(maxLives - livesRemaining);
}

function checkIfWon(){
	if(obfuscateWord() == targetWord){
		endGameDialog(true);
	}
}

function obfuscateWord(){
	var obWord = '';
	for (var i=0; i< targetWord.length; i++){
		 if (guesses.indexOf(targetWord[i].toLowerCase(), 0) == -1) {
            obWord += '_ ';
        } else {
            obWord += targetWord[i];
        }
    }
    return obWord;
}

function resetGame(){
	setImage(0);
	guesses = [];
	targetWord = '';
	newWord();
}

function endGameDialog(isWinner) {
    if (isWinner) {
        $('#endGameDialogTitle').html('You won');
        $('#endGameDialogContent').html('You guessed ' + targetWord + ' in ' + guesses.length + ' attempts');
    } else {
        $('#endGameDialogTitle').html('You lost');
        $('#endGameDialogContent').html('Unlucky.  The word was ' + targetWord);
    }

    $('#endGameDialog').modal('toggle');
}


function showLifeRemaining(){
	//$('#lifeRemaing').html('');
	$('#lifeRemaing').html(livesRemaining + " of " + maxLives);
}

function update(){
	addGuess();
	cleanGuess();
	drawWord();
	drawGuesses();
	reviewLives();
	showLifeRemaining();
	checkIfWon();
}

$(document).ready(function() {
    loadWordlist();
    drawWord();
    drawGuesses();
    showLifeRemaining();
    $('#guess').attr('onkeyup', 'update();');

    //console.log(wordlist);
    // setTimeout(function(){
    // 	console.log(wordlist); 
    // }, 2000);
    
});
