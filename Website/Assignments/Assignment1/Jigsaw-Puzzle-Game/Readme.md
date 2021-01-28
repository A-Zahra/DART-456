#### Name Zahra Ahmadi
#### Date 04/11/2020
#### Professor Pippin Barr
#### Project 3 - “This time it’s personal”
______

For project 3 I have made a Jigsaw puzzle game which is inspired by the chess’s games made By Professor Pippin Barr. As I found out, the main feature of his chesses is that; although the appearance of the game is still the same, the structure and rules are different. For instance, the movements of the pieces on the chess board may not have the same result as they have in the regular game. Therefore, this deconstruction in the way games are played, which are always played in the same way, encouraged me to use this idea in programming my own game.

The puzzle game that I made has two levels. In level one which is the easy one, there is a light slider on the screen and a hidden puzzle board. The slider holds all of the puzzle pieces. Using the arrows on top and bottom of the slider, the player can search through the slider and find the piece they are looking for. All of the pieces are draggable and as long as they are not dropped to an empty spot, the player has the chance to put the piece back to the slider. Making a slider with these features was so challenging and exciting for me at the same time. I spent four or five days to figure out how to make the slides goes up and down once an arrow is clicked. Then, as the puzzle pieces should be draggable, I didn’t know how to remove them from the slider and adds them to the puzzle board without ruining the slider proper function. After spending several hours and testing different styles of coding I ended up giving up and emailed Sabine to get help. Thanks to the great help I received from her, I eventually made the slider work the way I liked. 

There After, I started making the board. The puzzle board is made of 30 images which have the same shape as the game pieces. They reserve the empty spot till a real piece is dropped to the spot. If the player wants to drop a piece to the board, they should first click on the spot and then drag and drop the piece on the board. 

To make this level a little bit hard, I considered three factors. First, I chose images which contains repetitive elements. Second, some of the puzzle pieces shapes are so similar and if the player doesn’t pay attention to the shape, they are totally possible to makes mistake. Third, if the player clicks on two empty spots— which are close to each other— at the same time, the puzzle piece is dropped to both spot and takes the chance from the player to drop the correct piece to the other spot. 

In level two which is the hard one, there is a puzzle board at the middle of screen, puzzle pieces are spread out on the sides and on top of the board number of questions is displayed. The puzzle board is made of 48 images which have the same shape as the puzzle pieces. They reserve the spot till a piece is dropped. The difference between the spots on the level one puzzle board and level two puzzle board is that; while the former accepts wrong pieces, the later does not. If the player wants to drop a wrong piece, the spot shakes and does accept the wrong piece.

In level two there is a question loop which acts as the timer of the game as well. In my Json file there is a list of 60 questions which 15 questions are randomly chosen to be displayed. Every 17 seconds a new question pops up. The player has 15 seconds to answer. If their answer would be wrong or they do not answer the question, the next question pops up right after. As long as the player does not give a right answer, they won’t be able to complete the puzzle board. The challenging part of this step was to set the questions in terms of time interval in a way that the next question would not be displayed until the previous question time was finished. 
Also, there are two elements which are supposed to helps the player. First, the red bars on top of the board which lets the player knows how many questions are left. Second, the clue on the question window guides the user to know how to say their answer that is accepted by the game.

In programming this game, proper function of both puzzles was so important to me. Thereby, spending a lion share of my time only on the puzzles left me a limited time to work on the victory and game over screens. I decided to keep them simply but pretty. The common feature of these two screens is the pop-up window which lets the player to play the same puzzle again or goes back to the home page.

Reference
You can find links of websites I got codes, images or sounds from in my Js files.


