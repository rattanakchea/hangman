//author: Rattanak Chea
//created on May 21 2015
//global variables
var wordlist = [],
	targetWord = '',
	guesses = [],   //characters users have guessed
	livesRemaining = maxLives = 6,
	alphabets = "abcdefghijklmnopqrstuvwxyz",
	guess = ''; //user guess input or click button

	//image variables
var image = '',
	image_path = '';


//DOM Elements
var _buttons = $('#buttons');
var _targetWord = $('#targetWord');
var _lifeRemaining = $('#lifeRemaining');
var _previousGuesses = $('#previousGuesses');


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


//generate a random targetWord
function newWord(){
	targetWord = wordlist[Math.floor(Math.random() * wordlist.length)];
}
function drawWord(){
	if (targetWord == '') {
		newWord();
	}
	_targetWord.html(obfuscateWord());
}

//helper function
function obfuscateWord(){
	var obWord = '';
	//if targetWord has a space
	// if (targetWord.indexOf(' ', 0) !== -1) {
	// 	guesses.push(' '); //automatically add space to guess
	// }
	if (/\s/.test(targetWord)) {
    	// It has any kind of whitespace
    	guesses.push(' '); //automatically add space to guess
	}

	for (var i=0; i< targetWord.length; i++){
		 if (guesses.indexOf(targetWord[i].toLowerCase(), 0) == -1) {
            obWord += '_ ';
        } else {
            obWord += targetWord[i];
        }
    }
    return obWord;
}
//add word to guesses array when user input
//guess must not be empty
//check if validate alphabet
//check if guess has been entered before
function addGuess(){
	//has not been clicked, assigned to input

	if ($('#guess').val() !== ''){
		guess = $('#guess').val().toLowerCase();
	}
	
	
	//validate guess: guess is from a-z, and guess has not been entered
	if(/^[a-zA-Z]*$/.test(guess) && typeof guess !== "undefined"
					&& guess !== ''){
		//has been entered
		if (guesses.indexOf(guess) !== -1) {
			$('#feedback').html(' <strong>' + guess + "</strong> is already Entered");
		} else {
			
			if (isExist(guess)){
				$('#feedback').html(' Correct');
			} else {
				$('#feedback').html(' Incorrect');
			}
			guesses.push(guess.toLowerCase());
		}
	} else {
		$('#feedback').html(' You must enter A-Z');
	}


	//reset guess
	$('#guess').val('');	
}

function drawGuesses(){
	//guesses.sort();
	//example: guesses = ['a', 'b', 'c'];
	var output = '';
	for (var i=0; i< guesses.length; i++){
		if (isExist(guesses[i])){
			output += '<span style="color:green">' + guesses[i] + '</span>';
		} else {
			output += '<span style="color:red">' + guesses[i] + '</span>';
		}
	}

	_previousGuesses.html(output);
}
//helper function
//check if exist
function isExist(needle){
	if (targetWord.toLowerCase().indexOf(needle.toLowerCase()) !== -1){
		return true;
	} else return false;
}

function drawButtons(){
	//seperate each character
	var arrayOfAlphabets = alphabets.split('');
	//<a class="btn btn-default" href="#" role="button"></a>
	var output = '';
	for(var i=0; i<arrayOfAlphabets.length; i++){
		output += '<a class="alphabet btn btn-success" href="#" role="button"  data-value="' + arrayOfAlphabets[i] + '">'
				+ arrayOfAlphabets[i]
				+ '</a>';
	}
	//empty all existing buttons then append (reset)
	_buttons.empty().append(output);
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
	_lifeRemaining.html(livesRemaining + " of " + maxLives);
}

function checkIfWon(){
	if(obfuscateWord() == targetWord){
		endGameDialog(true);
	}
}
function reviewLives(){
	//reset livesRemaining
	//other count wrong guess twice
	livesRemaining = maxLives;

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

function update(){
	addGuess();
	drawGuesses();
	drawWord();
	checkIfWon();
	reviewLives();
	showLifeRemaining();
}

function resetGame(word){
	//default word to empty string
	word = typeof word !== 'undefined' ?  word : '';
	console.log("reset game");
	$('#feedback').html('');
	$('#poster').attr('src', image_path);
	setImage(0);
	guesses = [];
	targetWord = word;
	drawWord();
	drawGuesses();
	reviewLives();
	showLifeRemaining();
	drawButtons();
}

function refreshPage(){
	location.reload();
}

$(document).ready(function() {
	loadWordlist();
	drawWord();
    drawButtons();
    showLifeRemaining();

    //listen to user input
    $('#guess').attr('onkeyup', 'update();');

    _buttons.on('click', 'a.alphabet', function(e){
    	e.preventDefault();
    	guess = $(this).text();
    	//$(this).hide();  //affect the whole display
    	$(this).css('visibility', 'hidden'); //just hide
    	update();
    });
    
});
