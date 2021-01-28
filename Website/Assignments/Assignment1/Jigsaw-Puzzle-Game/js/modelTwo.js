"use strict";

/*********************************************************************************************
Project3 - Jigsaw puzzles
Zahra Ahmadi

The game's level 2 most important elements are:
1. The puzzle board and the pieces. The puzzle board is made of 48 square frame images 
which occupy the empty spots and once the player drops a puzzle piece onto they are replaced by 
the puzzle piece. The pieces are divided into two groups and are selected randomly in order to 
be displayed on both sides of the board. 
2. Questions chart. It is designed to help the player knows how many questions are left.
3. Questions loop. Acts as the timer of the game. The player has 15 seconds to answer a question. 
If they give a wrong answer the window shakes and if they don't answer it goes for the next question.
Once the questions are finished, if all of the pieces where dropped to the board the victory screen 
is displayed. Otherwise the game over screen is displayed.
*********************************************************************************************
Reference

Images:

YellowFlowers
https://unsplash.com/photos/4hQaZN5a1Xc

Dog
https://unsplash.com/photos/lvFlpqEvuRM

Desert
https://unsplash.com/photos/SYx3UCHZJlo

breakfast
https://unsplash.com/
*********************************************************************************************
Borrowed codes

Effect("explode")
https://jqueryui.com/effect/

Local storage
https://www.w3schools.com/jsref/prop_win_localstorage.asp

effect("shake")
https://makitweb.com/how-to-shake-an-element-with-jquery-ui/

split()
https://stackoverflow.com/questions/5568292/get-the-first-class-from-an-element-with-jquery

substring()
https://stackoverflow.com/questions/10741899/how-to-select-last-two-characters-of-a-string

Splice()
http://www.jquerybyexample.net/2012/02/remove-item-from-array-using-jquery.html
*********************************************************************************************
Sound Effects:

Fail sound
https://www.zapsplat.com/?s=applause&post_type=music&sound-effect-category-id=

Victory sound
https://freesound.org/people/qubodup/sounds/182825/
*********************************************************************************************/
let puzzles; // An array which four different puzzles are stored in
let displayableAreaWidth; // Stores the width of an area that pieces can be displayed
let displayableAreaHeight; // Stores the height of an area that pieces can be displayed
let borderLeft = 0; // Stores the value which is added to displayableAreaWidth
let numPieces = 48; // stores total number of puzzle pieces
let puzzlePieces; // An array which stores all puzzle pieces elements with their properties
let numDroppedPieces = 0; // Stores number of pieces dropped to the spots on puzzle board
let allPiecesImgAddress; // An array which stores all pieces images address
let questionsPackage; // An array which stores all of the questions
let totalNumQuestions; // Stores total number of questions
let displayQuestion; // Stores the setInterval method which prompts makeQuestions function
let displayTimeIntervals = 32000; // The value which based on that the makeQuestions functions is call every few seconds
let questionsChart; // An array which stores displayable questions
let rightAnswer = 0; // Stores the answer of question
let popUpQuestion; // Stores question's pop up window
let timeToAnswer; // Stores the setInterval function which counts number of seconds the player has to answer a question
let seconds; // Stores the number of seconds
let isGameOver = false; // If game is over, changes the background of gameOver window
let puzzleId = 0; // Gets the puzzle id from the other script file using local storage
let firstPieceLength = 0; // Stores the length of puzzle first piece image
let $backbutton; // Stores $backButton element in
let $homebutton; // Stores $homeButton element in
let $playAgain; // Stores $playAgain button element in
let numQuestionsLimit = 1; // A variable that is used to check if all the questions were displayed
let secondsLimit = 0; // A variable that is used to check if the timer ended
let piecesContainersContentLimit = 0; // A variable that is used to check if the pieces containers are empty
let failSound = new Audio("assets/sounds/cartoon_fail_trumpet.mp3"); // Game over sound effect
let victorySound = new Audio("assets/sounds/applause.mp3"); // Victory sound effect

$(document).ready(setup);

// setup()
//
// Sets up everything
function setup() {
  // Removes background image + Sets background color property to black
  $('body').css({
    "background-image": "url()",
    "background-color": "black"
  });
  // Defines arrays
  puzzlePieces = [];
  allPiecesImgAddress = [];
  questionsPackage = [];
  questionsChart = [];
  
  // Calls startGame function
  startGame();

  // Speech recognition code which gives user the opportunity to orally interact with the website
  if (annyang) {
    // Let's define our first command. First the text we expect, and then the function it should call
    let commands = {
      '*text': checkAnswer // Once player replied, sends their response to this function
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();
    // Activates debug mode for detailed logging in the console
    annyang.debug();
  }
}

// startGame()
//
// Displays the puzzle complete image and then starts the game
function startGame() {
  // Assigns chosen puzzle id to
  puzzleId = localStorage.getItem("puzzle2Id");

  // Creates and adds the puzzle image to DOM element
  let puzzleImage = $('<img>').attr({
    src: `assets/images/Level2/${puzzleId}.jpg`
  }).css({
    "width": "50vw",
    "position": "absolute",
    "margin-top": "3vw"
  }).appendTo('.puzzleImageContainer');
  // After 5 seconds, explodes the image..
  setTimeout(function() {
    puzzleImage.effect("explode", "slow");
  }, 5000);
  // Two seconds after the image explosion, shows the game screen
  setTimeout(function() {
    // Gets required data from JSON file and calls the dataLoaded function
    $.getJSON("data/data.json")
      .done(dataLoaded) // If there is no error, runs dataLoaded function
      .fail(dataError); // otherwise, runs the dataError function
    backButton();
  }, 7000);
}

// dataLoaded()
//
// Creates and runs dataLoaded funtion
function dataLoaded(data) {
  // Gets data from Json file
  // Assigns four different puzzles to the puzzles array
  puzzles = [{
      id: "desert",
      length: data.puzzles.secondPuzzle.desert.length,
      pieces: data.puzzles.secondPuzzle.desert
    },
    {
      id: "YellowFlowers",
      length: data.puzzles.secondPuzzle.YellowFlowers.length,
      pieces: data.puzzles.secondPuzzle.YellowFlowers
    },
    {
      id: "dog",
      length: data.puzzles.secondPuzzle.dog.length,
      pieces: data.puzzles.secondPuzzle.dog
    },
    {
      id: "breakfast",
      length: data.puzzles.secondPuzzle.breakfast.length,
      pieces: data.puzzles.secondPuzzle.breakfast
    }
  ];

  // Gets questions from Json file and assigns them to the questionsPackage array
  for (let i = 0; i < data.questionsPackage.length; i++) {
    questionsPackage.push(data.questionsPackage[i]);
  }
  // Sets total number of questions which should be shown
  totalNumQuestions = data.questionsPackage.length / 4;
  // Every few seconds calls the makeQuestions function
  displayQuestion = setInterval(makeQuestions, displayTimeIntervals);
  // Then, calls the following functions
  displayNumQuestions();
  makePuzzlePieces();
  makeEmptySpot(data);
}

// makeQuestions()
//
// Creates question popUp window
function makeQuestions() {
  // Runs the following codes if there are still questions in the questionsPackage array
  if (totalNumQuestions >= numQuestionsLimit) {
    // Once a question is being displayed, hides the left and right side pieces
    $('#rightSidePieces').hide();
    $('#leftSidePieces').hide();
    // Gets a random question from the array
    let randomQuestionSet = getRandomElement(questionsPackage);
    // Creates a pop up window
    popUpQuestion = $('<div></div>').addClass("popUpQuestion").appendTo('.secondPuzzleModels');
    // Creates the element which will contain the question 
    let question = $('<h2></h2>').addClass("question").text(`${randomQuestionSet.question}`).appendTo('.popUpQuestion');
    // Creates the element which will contain the clue 
    let clue = $('<h3></h3>').addClass("clue").text(`CLUE: ${randomQuestionSet.clue}`).appendTo('.popUpQuestion');
    // Gets the question asnwer
    rightAnswer = randomQuestionSet.answer.toUpperCase();
    // Sets the number of seconds the player will have to answer
    seconds = 30;
    // Creates the element which will display the timer
    let questionTimer = $('<p></p>').addClass("questionTimer").appendTo('.popUpQuestion');
    // Runs the timer
    timeToAnswer = setInterval(function() {
      questionTimer.text(`${seconds}`);
      seconds--;
      if (seconds < secondsLimit) {
        // Once the seconds end, displays both sides pieces again
        $('#rightSidePieces').show();
        $('#leftSidePieces').show();
        // Removes current question
        popUpQuestion.remove();
        // Removes current question from the array
        removeRandomQuestion(randomQuestionSet);
        // Removes the timer
        clearInterval(timeToAnswer);

      }
    }, 1000);
    // Decreases total number of questions by one
    totalNumQuestions--;
    // Based on the total number of questions updates the questions chart
    updateQuestionsChart(totalNumQuestions);
  } else {
    // Check if the puzzle got completed
    checkPuzzleCompletion();
  }
}

// displayNumQuestions()
//
// Creates and displays questions chart
function displayNumQuestions() {
  for (let i = 0; i < totalNumQuestions; i++) {
    let questionBar = $('<div></div>').attr('id', 'questionBar').appendTo('.questionsChart');
    questionBar.css({
      "width": "2.8vw",
      "height": "2vw",
      "background-color": "red",
      "display": "table",
      "float": "left",
      "margin": "0.2vw"
    });
    // Stores all questions bars in an array
    questionsChart.push(questionBar);
  }
}

// updateQuestionsChart()
//
// Updates chart based on the number of questions left
function updateQuestionsChart(totalNumQuestions) {
  questionsChart[totalNumQuestions].remove();
}

// removeRandomQuestion()
//
// Removes the last used question from array to not be chosen again
function removeRandomQuestion(question) {
  questionsPackage.splice($.inArray(question, questionsPackage), 1);
}

// checkAnswer()
//
// Checks player answer
function checkAnswer(answer) {
  let playerAnswer = answer.toUpperCase();
  // If it is correct, clears the interval and adds it again
  if (playerAnswer === rightAnswer) {
    seconds = 1;
    clearInterval(displayQuestion);
    displayTimeIntervals = 32000;
    displayQuestion = setInterval(makeQuestions, displayTimeIntervals);
  } else {
    // Otherwise, just shakes the question window
    $('.popUpQuestion').effect("shake");
  }
}

// checkPuzzleCompletion()
//
// Checks if the player could drop all of the pieces
function checkPuzzleCompletion() {
  // If all of the pieces were not dropped to the puzzle board, removes the pieces containers, back button and displays gameOver screen
  if ($('#leftSidePieces').children().length !== piecesContainersContentLimit || $('#rightSidePieces').children().length !== piecesContainersContentLimit) {
    $('#leftSidePieces').remove();
    $('#rightSidePieces').remove();
    $('.questionsChart').remove();
    $backbutton.remove();
    clearInterval(displayQuestion);
    isGameOver = true;
    gameOver();
  }
}

// makePuzzlePieces()
//
// Makes puzzle pieces and assign them to html elements
function makePuzzlePieces() {
  // Makes an array of left and right pieces containers names
  let piecesContainer = ["leftSidePieces", "rightSidePieces"];
  // Based on the puzzle chosen, gets the pieces of that puzzle from Json file
  for (let p = 0; p < puzzles.length; p++) {
    if (puzzleId === puzzles[p].id) {
      // Gets pieces images from Json file and assigns them to an array
      for (let j = 0; j < numPieces; j++) {
        let pieceImage = puzzles[p].pieces[j];
        allPiecesImgAddress.push(pieceImage);
      }
    }
  }
  // Gets the first image address length and assigns to a variable
  firstPieceLength = allPiecesImgAddress[0].length;

  // Makes two columns of puzzle pieces and displays them on the sides
  let numPiecesToShow = 0;
  let totalNumPiecesToShow = 24;
  let numPiecesContainers = 2;

  // Makes two columns of puzzle pieces
  for (var g = 0; g < numPiecesContainers; g++) {
    // Creates puzzle pieces
    for (let i = numPiecesToShow; i < totalNumPiecesToShow; i++) {
      // Defines a vertical rectangular area of display for the pieces
      displayableAreaHeight = Math.floor(($('.columns').height() / 2));
      displayableAreaWidth = Math.floor($('.columns').width() / 4.5);

      // According to the column chosen increases or decreases left border value
      if (g === 0) {
        borderLeft = -30;
      } else if (g === 1) {
        borderLeft = +30;
      }

      // Generates random x and y position
      let randPosX = borderLeft + Math.floor((Math.random() * (displayableAreaWidth)));
      let randPosY = Math.floor((Math.random() * (displayableAreaHeight)));

      // Gets random image from the array and assigns to the html element
      let pieceImgAddress = getRandomElement(allPiecesImgAddress);
      // Gets the number embeded in the image address in order to be used in the piece id name
      let pieceId = findPieceId(pieceImgAddress);
      // Creates the piece
      let piece = $('<img>').attr({
        id: `piece${pieceId}`,
        src: `${pieceImgAddress}`
      }).appendTo(`#${piecesContainer[g]}`);
      piece.css({
        "width": "4.5vw",
        "left": `${randPosX}px`,
        "top": `${randPosY}px`,
        "position": "relative"
      });
      // Makes it draggable
      piece.draggable();
      // makes an array of pieces
      puzzlePieces.push(piece);
      // Removes the current image from the images array so that it won't be used again
      removeRandomElement(pieceImgAddress);
    }
    // Goes for the next column
    numPiecesToShow += 24;
    totalNumPiecesToShow += 24;
  }
}

// getRandomElement()
//
// Gets random element from the images array
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}

// removeRandomElement()
//
// Removes the last used image from array to not be chosen again
function removeRandomElement(image) {
  allPiecesImgAddress.splice($.inArray(image, allPiecesImgAddress), 1);
}

// makeEmptySpot()
//
// Makes empty spots to drop puzzle pieces into
function makeEmptySpot(data) {
  let numSpots = 8;
  let totalNumSpots = 0;
  let numRowsOfSpots = 6;
  // Creates six rows..
  for (var j = 0; j < numRowsOfSpots; j++) {
    //each containing eight spots
    for (var i = numSpots; i >= totalNumSpots; i--) {
      // Gets data from JSON file
      let image = data.puzzles.secondPuzzle.emptySpot;
      // Adds a piece with a similar shape of puzzle piece to occupy the space until the real piece is dropped
      let emptySpotImage = $('<img>').addClass(`piece${i}`).attr({
        src: `${image}`
      }).appendTo(`#spotToPosition${i}`);
      emptySpotImage.css({
        "width": "6vw"
      });

      // Makes the spot droppable
      $(`#spotToPosition${i}`).droppable({
        drop: onDrop
      });
    }
    // Goes for the next row
    numSpots += 9;
    totalNumSpots += 9;
  }
}

// onDrop()
//
// On drop, implements the following code
function onDrop(event, ui) {
  // Gets the spot id
  let emptySpotId = $(this).attr('id');
  let spotId = findSpotId(emptySpotId);
  // Gets the piece id
  let pieceId = findPieceId(ui.draggable.attr('id'));
  //If the ids are equal runs the following code
  if (spotId === pieceId) {
    // Adds one to the number of pieces dropped
    numDroppedPieces++;
    // Empties spot for adding the piece to
    $(this).empty();
    // Gets the piece image source
    let droppedPieceImg = ui.draggable[0].src;
    // Makes a new piece with all the same properties of the dropped piece and append it to the spot
    let newPiece = $('<img>').attr({
      id: `piece${pieceId}`,
      src: `${droppedPieceImg}`
    }).css({
      "width": "6vw"
    }).appendTo($(this));

    // Removes the dropped piece 
    ui.draggable.remove();
  } else {
    // if the piece is not the right piece for that spot..
    // Shakes the spot and makes the background red
    $(this).effect("shake", {
      direction: "left",
      times: 5,
      distance: 5
    }, 400).css({
      "background-color": "red",
      "display": "flex"
    });
  }
  
  // If All of the pieces were dropped...
  if (numDroppedPieces > 47) {
    // Removes the containers, questions charts and the back button.
    $('#leftSidePieces').remove();
    $('#rightSidePieces').remove();
    $('.questionsChart').remove();
    $backbutton.remove();
    // Clears both of the setInterval functions
    clearInterval(timeToAnswer);
    clearInterval(displayQuestion);
    // Calls the victoryScreen function
    victoryScreen();
  }
}

// findPieceId()
//
// Finds the number placed in the id name in order to be used as the piece id
function findPieceId(piece) {
  let pieceIdLength = piece.length;
  let numChars = 0;
  let numCharsToNotCount = 0;
  let charToShow = 0;
  let lengthLimit = 10;
  // If the image address length is more than 10...
  if (pieceIdLength > lengthLimit) {
    numChars = firstPieceLength;
    numCharsToNotCount = 4;
    charToShow = firstPieceLength - 5;
  } else {
    numChars = 6;
    charToShow = 5;
    numCharsToNotCount = 0;
  }
  // Finds the character that is going to be used as the id
  let pieceId;
  if (piece.length === numChars) {
    pieceId = piece.charAt(charToShow);
  } else if (piece.length > numChars) {
    pieceId = piece.substring(charToShow, piece.length - numCharsToNotCount);
  }
  return pieceId;
}

// findSpotId()
//
// Finds the number placed in the id name in order to be used as the spot id
function findSpotId(spot) {
  let spotId;
  let spotLengthLimit = 15;
  if (spot.length < spotLengthLimit) {
    spotId = spot.charAt(spotLengthLimit - 1);
  } else if (spot.length > spotLengthLimit - 1) {
    spotId = spot.substring(spotLengthLimit - 1, spot.length);
  }
  return spotId;
}

// gameOver()
//
// Displays gameOver screen
function gameOver() {
  // Plays sound effect
  failSound.play();
  // Changes the background color
  $('body').css({
    "background-color": "red",
    "display": "block"
  }).fadeTo(500, 1);
  // Shakes the puzzle
  $('.innerRow0').effect("shake", {
    direction: "left",
    times: 5,
    distance: 10
  }, 700);

  $backbutton.hide();
  // After 6 seconds, runs the following code
  setTimeout(function() {
    // Creates a pop up window
    let popUpWindow = $('<div></div>').addClass("popUpWindow").appendTo('.secondPuzzleModels');
    popUpWindow.css({
      "background-color": "black"
    });
    // Addes the message to window
    let message = $('<h3></h3>').addClass("message").text("Game Over!!!").appendTo('.popUpWindow');
    message.css({
      "color": "white"
    });
    // Creates a container which will holds the buttons
    let rowOfButtons = $('<div></div>').addClass("rowOfButtons").appendTo('.popUpWindow');
    // Home button container
    let leftButton = $('<div></div>').addClass("buttonPosition").attr('id', 'leftColumn').appendTo('.rowOfButtons');
    // Play again button container
    let rightButton = $('<div></div>').addClass("buttonPosition").attr('id', 'rightColumn').appendTo('.rowOfButtons');

    // Calls home and play again buttons functions and stops sound
    homeButton();
    playAgainButton();
    failSound.pause();
  }, 4000);
}


// victoryScreen()
//
// Displays victory screen
function victoryScreen() {
  // Plays sound effect
  victorySound.play();
  // Displays paper explosion gif
  let imageUrl = "http://www.medwayyachtclub.com/wp-content/uploads/2019/10/1410010_e1288-2.gif";
  $('.victoryReward').css({
    "display": "block",
    "background-image": 'url(' + imageUrl + ')',
    "background-size": "cover",
    "background-repeat": "no-repeat",
    "background-position-y": "-10vw",
    "height": "auto"
  });

  // Hides back button
  $backbutton.hide();
  // After 6 seconds, runs the following code
  setTimeout(function() {
    // Creates a pop up window
    let popUpWindow = $('<div></div>').addClass("popUpWindow").appendTo('.secondPuzzleModels');
    // Addes the message to the window
    let message = $('<h3></h3>').addClass("message").text("Good Job Buddy!!!").appendTo('.popUpWindow');
    // Creates a container which will holds the buttons
    let rowOfButtons = $('<div></div>').addClass("rowOfButtons").appendTo('.popUpWindow');
    // Home button container
    let leftButton = $('<div></div>').addClass("buttonPosition").attr('id', 'leftColumn').appendTo('.rowOfButtons');
    // Play again button container
    let rightButton = $('<div></div>').addClass("buttonPosition").attr('id', 'rightColumn').appendTo('.rowOfButtons');

    // Calls home and play again buttons functions and stops sound
    homeButton();
    playAgainButton();
    victorySound.pause();
  }, 7000);
}

// backButton()
//
// Creates back button
function backButton() {
  $backbutton = $('<div></div>').attr('id', 'backbutton').text("back");
  $backbutton.css({
    "margin-top": "-2vw",
    "margin-left": "22vw",
    "font-size": "1.5vw",
    "color": "white",
    "background-color": "blueviolet",
    "display": "table"
  });
  $backbutton.button();
  // Appends the button to FirstPuzzleModels div
  $backbutton.appendTo("#puzzleBoard");
  // On click, goes back to main page
  $backbutton.on('click', function() {
    window.location.href = "index.html"
  });
}

// homeButton()
//
// Creates home button
function homeButton() {
  // Creates html element and assigns button function to
  $homebutton = $('<div></div>').attr('id', 'homeButton').text("Home").appendTo("#leftColumn");
  $homebutton.button();

  // On click, goes back to main page
  $homebutton.on('click', function() {
    window.location.href = "index.html"
  });
}

// playAgainButton()
//
// Creates play again button
function playAgainButton() {
  // Creates html element and assigns button function to
  $playAgain = $('<div></div>').attr('id', 'playAgainButton').text("Play again").appendTo("#rightColumn");
  $playAgain.button();
  // If it's gameOver screen, changes the background color
  if (isGameOver) {
    $playAgain.css({
      "background-color": "#189910"
    });
  }
  // On click, reloads the page
  $playAgain.on('click', function() {
    window.location.href = "modelTwo.html"
  });
}

// dataError()
//
// If there is an error...
function dataError(request, textStatus, error) {
  // Displays the error on console
  console.error(error);
}