"use strict";

/********************************************************************
Project3 - Jigsaw puzzles
Zahra Ahmadi

The game's level 1 most important elements are:
1. The puzzle board. The puzzle board is made of 30 similar shapes of puzzle pieces. 
All of these shapes are hidden and only once the player hover over them they become visible.
If the player wants to drop a piece they should first click on the shape and then drop the piece.
In this level it is totally possible that the player drops the wrong piece to a spot, as there is no
barrier to do so.
2. Light Slider. It contains the puzzle pieces. The arrows on top and bottom of the slider lets the player
to look for a certain piece if they want to. If the player doesn't want to use the piece they just took,
they can put it back to the slider and take an another one.
3. The game ends once all of the pieces are dropped. If the pieces are in their right spot, the victory
screen shows up otherwise the gameOver screen will be displayed.
*************************************************************************************
Reference

Images:

Nasir-ol-molk mosque
https://www.irandiamondtour.com/ArticleDetails/6/Shiraz-City

Snail
https://unsplash.com/photos/1SPu0KT-Ejg

Tiles
https://unsplash.com/

Color Mix
couldn't find the link

Gifs:
https://cdn.streamelements.com/uploads/24548f52-afb9-4338-b823-d2a5d1b5c793.gif
****************************************************************************************
Borrowed Codes:

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
********************************************************************************************
Sound Effects:

Fail sound
https://www.zapsplat.com/?s=applause&post_type=music&sound-effect-category-id=

Victory sound
https://freesound.org/people/qubodup/sounds/182825/
********************************************************************************************/
let puzzleScreen; // Stores puzzle template image 
let numSlides; // Stores the length of array which contains the puzzle pieces
let numSlidesToShow = 3; // Number of slides to show in the slider
let piecesInSlide; // An array which puzzle pieces elements with all of their properties are stored in
let allSlidesWereDropped = 0; // A variable to check if all pieces were dropped
let slide; // Stores new slide element
let arrowTop; // Stores top arrow element
let arrowBottom; // Stores bottom arrow element
let puzzlePiece; // Stores new puzzle piece in
let pieceImage; // An array stores pieces images address
let puzzleId; //SABINE variable to hold the puzzle id chosen (retrieved from local storage)
let puzzles; // An array which four different puzzles are stored in
let $backbutton; // Stores $backButton element in
let $reloadButton; // Stores $reloadButton element in
let $homebutton; // Stores $homekButton element in
let $playAgain; // Stores $playAgain button element in
let isGameOver = false; // Checks if game is over
let failSound = new Audio("assets/sounds/cartoon_fail_trumpet.mp3"); // Game over sound effect
let victorySound = new Audio("assets/sounds/applause.mp3"); // Victory sound effect

$(document).ready(setup);

// setup()
//
// Sets up everything
function setup() {
  piecesInSlide = [];
  pieceImage = [];

  // Calls required data from JSON file
  $.getJSON("data/data.json")
    .done(dataLoaded) // If there is no error, runs dataLoaded function
    .fail(dataError); // otherwise, runs the dataError function
  backButton();
  reloadButton();
}

// dataLoaded()
//
// Creates and runs dataLoaded funtion
function dataLoaded(data) {
  // Gets data from Json file and stores them in puzzles array
  puzzles = [{
      id: "Fall",
      length: data.puzzles.firstPuzzle.Fall.length,
      pieces: data.puzzles.firstPuzzle.Fall
    },
    {
      id: "Tiles",
      length: data.puzzles.firstPuzzle.tiles.length,
      pieces: data.puzzles.firstPuzzle.tiles
    },
    {
      id: "PinkFlowers",
      length: data.puzzles.firstPuzzle.PinkFlowers.length,
      pieces: data.puzzles.firstPuzzle.PinkFlowers
    },
    {
      id: "Snail",
      length: data.puzzles.firstPuzzle.Snail.length,
      pieces: data.puzzles.firstPuzzle.Snail
    }
  ];
  // Gets the puzzle id from the other script file using local storage
  puzzleId = localStorage.getItem("puzzle1Id");
  // Calls makePuzzle function
  makePuzzle(data);
}


// makePuzzle()
//
// Creates puzzle and prompts pieces() funtion
function makePuzzle(data) {
  puzzleScreen = $('<img>').addClass('puzzleScreen').attr('src', `${data.puzzles.firstPuzzle.puzzleScreen}`).appendTo('#template-container');
  let ul = $('<ul></ul>').addClass('content-slider').appendTo('.item');
  // Creates puzzle pieces and add them to the lightslider
  pieces(data);

}

// pieces()
//
// Creates puzzle pieces, adds them to the lightslider, makes them draggable
function pieces(data) {
  // Creates the top arrow
  arrowTop = $('<img>').addClass('arrowTop').attr('src', 'assets/images/arrowTop.png').appendTo(`.content-slider`);

  // Stores puzzle id 
  let getPuzzleId;
  // Based on the id of the puzzle, gets data from Json file
  for (let i = 0; i < puzzles.length; i++) {
    if (puzzleId === puzzles[i].id) {
      getPuzzleId = i;
      // Gets data from JSON file
      // Stores slide's length in a variable
      numSlides = puzzles[i].length;
      // Stores all images in an array
      for (var h = 0; h < numSlides; h++) {
        let imgAddress = puzzles[i].pieces[h];
        // Stores all images address in an array
        pieceImage.push(imgAddress);
      }
    }
  }

  // Stores the first piece image address length in a variable
  let firstPieceLength = puzzles[getPuzzleId].pieces[0].length;
  // Creates pieces and adds them to their relative slide
  for (let i = 0; i < numSlides; i++) {
    // Gets random image from the array
    let randomPieceImg = getRandomElement(pieceImage);
    // Gets the image Id
    let imageId;
    // As The number embeded in the images address is going to be used the address length matters
    if (randomPieceImg.length === firstPieceLength) {
      imageId = randomPieceImg.charAt(randomPieceImg.length - 5);
    } else if (randomPieceImg.length === (firstPieceLength + 1)) {
      imageId = randomPieceImg.substring(randomPieceImg.length - 6, randomPieceImg.length - 4);
    }

    // Creates slide
    slide = $('<li></li>').addClass(`slide${i}`).addClass("slideC").appendTo('.content-slider');
    // Gets the piece's image address
    let imgAddress = randomPieceImg;
    // Creates the image element and assigns it to the slide
    puzzlePiece = $('<img>').addClass(`piece${imageId}Img`).css({
      "width": "6vw",
      "padding": "14px"
    }).attr('src', `${imgAddress}`).appendTo(`.slide${i}`);

    // Makes the piece draggable
    puzzlePiece.draggable();

    //SABINE EDIT
    //push the ENTIRE OBJECT to the pieceInSlide array
    piecesInSlide.push(puzzlePiece);

    // Removes the image used from the array so that it won't be picked again
    removeImageAfterAssignment(randomPieceImg);

    // Displays only the first four pieces
    if (i > numSlidesToShow) {
      $(`.slide${i}`).hide();
    }
  }

  // Creates spots on the puzzle template to place the pieces
  spotsToPositionPieces(data);
  // Makes bottom arrow
  arrowBottom = $('<img>').addClass('arrowBottom').attr('src', 'assets/images/arrowBottom.png').appendTo(`.content-slider`);
  // On click, moves the slides up or down
  arrowTop.on('click', goNext);
  arrowBottom.on('click', goPrev);
}

// getRandomElement()
//
// Gets random element from the images array to assign them to the slides
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}

// removeImageAfterAssignment()
//
// Removes the last used image from array to not be chosen again
function removeImageAfterAssignment(image) {
  pieceImage.splice($.inArray(image, pieceImage), 1);
}

// spotsToPositionPieces()
//
// Creates spots on the puzzle template to place the pieces and makes them droppable
function spotsToPositionPieces(data) {
  let numSpots = 5;
  let totalNumSpots = 0;
  let numRows = 5;
  // Creates five rows..
  for (var j = 0; j < numRows; j++) {
    //each containing six spots
    for (var i = numSpots; i >= totalNumSpots; i--) {
      // Gets data from JSON file
      let image = data.puzzles.firstPuzzle.emptySpots[i];
      // Adds a piece with a similar shape of puzzle piece image to occupy the space until the real piece is dropped
      let pieceHidingLayer = $('<img>').addClass(`hidingLayer${i}`).addClass("spotImage").attr({
        src: `${image}`
      }).appendTo(`#spotToPosition${i}`);
      // On click, changes the layer opacity to 0.6
      pieceHidingLayer.one("click", function() {
        $(this).addClass("clicked").css({
          "opacity": "0.6"
        });
      });

      // Makes the spot droppable
      $(`#spotToPosition${i}`).droppable({
        drop: onDrop
      });
    }
    // Goes for the next row
    numSpots += 6;
    totalNumSpots += 6;
  }
}

// onDrop()
//
// On drop, implements the following code
function onDrop(event, ui) {

  // If the spot has not been already filled...
  if (!($(this).hasClass("dropped"))) {

    // Gets the spot id, Gets the piece first class name
    // Finds the digit embeded in the spot and the piece + assigns them to variables
    let itemId = $(this).attr("id");
    let setSpotId = findSpotId(itemId);
    let droppedPieceFirstClass = $(ui.draggable[0]).attr("class").split(' ')[0];
    let setPieceId = findPieceId(droppedPieceFirstClass);

    if ($(`.hidingLayer${setSpotId}`).hasClass("clicked")) {
      // Adds "dropped" class so that this spot can't be filled again
      $(this).addClass("dropped");

      // SABINE EDIT START:
      //The one we dropped AND CHECK THAT IT IS NOT ONE ALREADY DROPPED ...
      let classNameOfParent = $(ui.draggable[0]).parent().attr('class');
      if (classNameOfParent.includes("slideC")) {
        //CUSTOM FUNCTION TO REMOVE FROM THE ARRAY (BASED ON THE SRC OF THE IMAGE)
        let indexToRemove = findArrayIndex(ui.draggable, piecesInSlide);
        piecesInSlide.splice(indexToRemove, 1);
        // SABINE EDIT END.


        // SABINE EDITS START:
        // Makes a copy ..
        // Removes the other ...
        let droppedOne = $('<img>').addClass(`droppedPiece${setSpotId}`).css({
          "width": "100%",
          "opacity": "1"
        }).attr({
          id: `piece${setPieceId}Img`,
          src: `${ui.draggable[0].src}`
        }).appendTo($(this));
        $(`.hidingLayer${setSpotId}`).remove();
        // Removes everyone up ...
        $(ui.draggable[0]).parent().remove();
      }

      //SABINE: also needs to ensure that the correct ones are showing
      let slides = $(".slideC");

      // SHOWS THE FIRST FOUR ..
      for (let j = 0; j <= numSlidesToShow; j++) {
        $(slides[j]).show();
      }
      // SABINE EDITS END.
    }

    // Once all the pieces were dropped to the empty spots, calls the makePuzzleFullSize function
    if (piecesInSlide.length === allSlidesWereDropped) {
      makePuzzleFullSize();
    }
  } else {
    console.log("not in list and is a different type of droppable");
  }
}

// goNext()
// Sabine simplified and modified my code
// Once the up arrow is clicked, shows the next hidden piece on bottom and hides the first piece on top of slider
function goNext() {
  let slides = $(".slideC");
  // Stores first piece in the slider
  let putATend = piecesInSlide[0];

  // Moves along
  for (let i = 0; i < piecesInSlide.length - 1; i++) {
    piecesInSlide[i] = piecesInSlide[i + 1];
    $(slides[i]).html(piecesInSlide[i]);
  }
  // Hides last piece
  piecesInSlide[piecesInSlide.length - 1] = putATend;
  // Needs to remake it draggable
  piecesInSlide[piecesInSlide.length - 1].draggable();
  $(slides[piecesInSlide.length - 1]).html(piecesInSlide[piecesInSlide.length - 1]);
}

// goPrev()
// Sabine simplified and modified my code
// Once the down arrow is clicked, shows the next hidden piece on top and hides the last piece on bottom of slider
function goPrev() {
  let slides = $(".slideC");
  let pieceToKeep = 0;
  // Stores last piece in the slider
  let firstPiece = piecesInSlide[piecesInSlide.length - 1];

  // Moves along
  for (let i = piecesInSlide.length - 1; i > pieceToKeep; i--) {
    piecesInSlide[i] = piecesInSlide[i - 1];
    $(slides[i]).html(piecesInSlide[i]);
  }
  // Hides last
  piecesInSlide[0] = firstPiece;
  // Needs to remake it draggable
  piecesInSlide[0].draggable();
  $(slides[0]).html(piecesInSlide[0]);
}

// makePuzzleFullSize()
//
// Removes the slider column, reveals the pieces dropped to the puzzle board
// checks the piece arrangment. If it is true, displays victory screen, else displays game over screen
function makePuzzleFullSize() {
  let numPiecesFadeIn = 0;
  let totalNumPiecesFadeIn = 5;
  let fadeTime = 700;
  let numRowsToFade = 6;
  // Removes light slider column
  $('.columnToRemove').remove();
  $('.column').css({
    "width": "100%",
    "float": "none"
  });
  // Makes the rows of pieces fade in with delay
  for (var i = 1; i < numRowsToFade; i++) {
    $(`.row${i}`).css({
      "margin-left": "7.5vw"
    });
    for (var j = numPiecesFadeIn; j <= totalNumPiecesFadeIn; j++) {
      $(`.droppedPiece${j}`).fadeTo(fadeTime, 1);
    }
    numPiecesFadeIn += 6;
    totalNumPiecesFadeIn += 6;
  }
  // Calls checkPuzzleArrangement function
  checkPuzzleArrangement();
}

// checkPuzzleArrangement()
//
// Checks whether the pieces are placed in the right position or not
function checkPuzzleArrangement() {
  let numCorrectPositionedPieces = 0;
  for (var p = 0; p < numSlides; p++) {
    // Gets spots and pieces ids
    let getSpotId = `spotToPosition${p}`;
    let checkSpotId = findSpotId(getSpotId);
    let getPieceId = $(`.droppedPiece${p}`).attr("id");
    let checkPieceId = findPieceId(getPieceId);

    // Compare the spot and the piece ids.
    if (checkSpotId === checkPieceId) {
      // If it is true, adds one to the numCorrectPositionedPieces variable
      numCorrectPositionedPieces++;
    }
  }
  // If pieces are placed in right spot, displayes victory screen, else gameOver screen
  if (numCorrectPositionedPieces < numSlides) {
    isGameOver = true;
    gameOver();
  } else if (numCorrectPositionedPieces === numSlides) {
    victoryScreen();
  }
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
  $('.row').effect("shake", {
    direction: "left",
    times: 5,
    distance: 10
  }, 700);
  // Hides background image
  $('body').css({
    "background-image": "url('')"
  });
  // Hides buttons
  $backbutton.hide();
  $reloadButton.hide();
  // After 6 seconds, runs the following code
  setTimeout(function() {
    // Creates a pop up window
    let popUpWindow = $('<div></div>').addClass("popUpWindow").appendTo('.FirstPuzzleModels');
    popUpWindow.css({
      "background-color": "black"
    });
    let message = $('<h3></h3>').addClass("message").text("Game over!!!").appendTo('.popUpWindow');
    message.css({
      "color": "white"
    });
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
  let imageUrl = "https://cdn.streamelements.com/uploads/24548f52-afb9-4338-b823-d2a5d1b5c793.gif";
  $('.victoryReward').css({
    "display": "block",
    "background-image": 'url(' + imageUrl + ')'
  });
  // Hides background
  $('body').css({
    "background-image": "url('')"
  });
  // Hides buttons
  $backbutton.hide();
  $reloadButton.hide();
  // After 6 seconds, runs the following code
  setTimeout(function() {
    // Creates a pop up window
    let popUpWindow = $('<div></div>').addClass("popUpWindow").appendTo('.FirstPuzzleModels');
    let message = $('<h3></h3>').addClass("message").text("Good Job Buddy!!!").appendTo('.popUpWindow');
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

// findArrayIndex()
// FUNCTION MADE BY SABINE
// FINDS INDEX OF THE ELEMENT WHICH SHOULD BE REMOVED
function findArrayIndex(obj, list) {
  for (let i = 0; i < list.length; i++) {
    let e = list[i];
    if (e[0].src === obj[0].src) {
      return i;
    }
  }
  return -1;
}

// findSpotId()
//
// Finds the digit placed in the spot id name in order to be used as the spot id
function findSpotId(itemId) {
  let spotId;
  let spotImgLength = 16;
  if (itemId.length < spotImgLength) {
    spotId = itemId.charAt(itemId.length - 1);
  } else if (itemId.length > spotImgLength - 1) {
    spotId = itemId.substring(itemId.length - 2, itemId.length);
  }
  return spotId;
}

// findSpotId()
//
// Finds the digit placed in the piece class name in order to be used as the piece id
function findPieceId(pieceId) {
  let droppedPieceId;
  let pieceIdLength = 10;
  let charToChoose = 5;
  if (pieceId.length < pieceIdLength) {
    droppedPieceId = pieceId.charAt(charToChoose);
  } else if (pieceId.length > pieceIdLength - 1) {
    droppedPieceId = pieceId.substring(charToChoose, pieceId.length - 3);
  }
  return droppedPieceId;
}

// backButton()
//
// Creates back button
function backButton() {
  $backbutton = $('<div></div>').attr('id', 'backbutton').text("Back");
  $backbutton.button();
  // Appends the button to buttons div
  $backbutton.appendTo(".buttons");
  // On click, goes back to main page
  $backbutton.on('click', function() {
    window.location.href = "index.html"
  });
}

// reloadButton()
//
// Creates reload button
function reloadButton() {
  $reloadButton = $('<div></div>').attr('id', 'reloadButton').text("Reload");
  $reloadButton.button();
  // Appends the button to buttons div
  $reloadButton.appendTo(".buttons");
  // On click, reloads the page
  $reloadButton.on('click', function() {
    window.location.href = "modelOne.html"
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
    window.location.href = "modelOne.html"
  });
}

// dataError()
//
// If there is an error...
function dataError(request, textStatus, error) {
  // Displays the error on console
  console.error(error);
}