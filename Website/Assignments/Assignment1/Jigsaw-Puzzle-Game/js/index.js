"use strict";

/********************************************************************
Project3 - Jigsaw puzzles
Zahra Ahmadi

Here is the Javascript code which lets the user clicks on the page elements,
open windows, see the game instructions and chooses their favorite puzzle to play

Reference

background image
https://www.freepik.com/free-vector/blue-puzzle-pieces-paint-splashes-background_714024.htm
********************************************************************/
$(document).ready(setup);
// Sets up everything
function setup() {
  // Stores the image id that was just clicked
  let puzzle1Id = "";
  let puzzle2Id = "";
  // Stores similar images ids names to be used in the following code
  let level1ImagesIds = ["PinkFlowers", "Tiles", "Fall", "Snail"];
  let level2ImagesIds = ["Armenia", "YellowFlowers", "GreenLeaves", "ElephantStone"];

  // Start screen
  introScreen();

  /* Displays the intro screen */
  function introScreen() {
    let introduction = $('<h1></h1>').addClass("gameTitle").text("Jigsaw Puzzle Game").appendTo('.introduction').after($('.gameLevels'));
    $('.model1Title').on("click", puzzleModel1);
    $('.model2Title').on("click", puzzleModel2);
  }

  // Once the model1 is clicked..
  function puzzleModel1() {
    // Hides the gameLevels div content..
    $('.gameLevels').css({
      "display": "none"
    });
    // Displays Model1 pop up window including options
    $('.level1Options').css({
      "display": "table"
    });
    // Model1 window exit button
    $('.windowExitButton').on('click', function() {
      $('.level1Options').hide();
      $('.gameLevels').show();
    });

    // Once the player clicks on one of the options...
    // Gets the option id and send it through the local storage to the relevent Js file
    for (let i = 0; i < level1ImagesIds.length; i++) {
      $(`#${level1ImagesIds[i]}`).click(function() {
        puzzle1Id = $(this).attr("id");
        localStorage.setItem('puzzle1Id', puzzle1Id);
        window.location.href = "modelOne.html";
      });
    }
  }

  // Once the model2 is clicked..
  function puzzleModel2() {
    // Hides the gameLevels div content..
    $('.gameLevels').css({
      "display": "none"
    });
    // Displays Model2 window including options
    $('.level2Options').css({
      "display": "table"
    });
    // Model2 window exit button
    $('.windowExitButton').on('click', function() {
      $('.level2Options').hide();
      $('.gameLevels').show();
    });
    
    for (let i = 0; i < level2ImagesIds.length; i++) {
      // Once the player clicked on one of the options...
      // Gets the option id and send it through the local storage
      $(`#${level2ImagesIds[i]}`).click(function() {
        puzzle2Id = $(this).attr("id");
        localStorage.setItem('puzzle2Id', puzzle2Id);
        window.location.href = "modelTwo.html";
      });
    }
  }
}