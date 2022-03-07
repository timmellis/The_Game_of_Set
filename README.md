# The_Game_of_Set
*An attempt to create the card game "Set" using front-end web development, as part of the General Assembly SEI Program*

*by Tim E.*

### Description
![Card examples](https://www.tylerbarron.com/static/media/setBoard.0d8a40f5.jpg)

SET is a card game based on logic and visual reasoning, in which players race to find as many SETs as they can. A SET is three cards where each individual feature (color, shape, number and shading) is either **all** the same OR **all** different! The game is a little heady, but definitely builds skills and exercises the brain: because it has a rule of logic, and because players must apply this rule to the spatial array of patterns all at once, they must use both left brain and right brain thought processes. It's great as a solo game, or in a group. In normal game play, there are no "turns": instead, the first player to see a SET calls out “SET!” and grabs the cards. At the end of the game, the player with the most SETs wins! 

### How to Get Started
For the javascript-based version, I plan to start by first creating the basic design and layout, hopefully using pure CSS to create the board and cards, as well as each card's shapes, colors and shadings. Then I plan to build up the basic functionality of the game, for example: creating a "deck" of all possible cards; dealing out cards from the "deck" to the DOM; listening for card clicks; checking for win condition(s) once three cards are selected; removing cards from play if they pass; and, keeping score of successfully matched SETs. 

I hope to make use of the following skills we have learned over the first 2 weeks of class to accomplish the MVPs:
- (MVP #1) Creating the game inside this repository.
- (MVP #2) Replacing this "Getting Started" README file with a more comprehensive document detailing the game and its features. 
- (MVP #4) HTML & CSS styling to create a landing page, instructions page, and gameplay page.
- (MVP #3) Flexbox layout for the game board, and card designs
- Creating Object Classes to create the cards and store methods that can apply for each card. (Post MVP)
- (MVP #5) Adding eventListeners for every card as it is dealt
- Using Higher Order Functions to sift and apply actions to nested sets of data.
- (MVP #7, 8) Use proper formatting and scope-usage for javascript code (indentation, camelCase, section comments, etc.),  clean up the final code.
- (MVP #6) Use git to commit meaningful progress checkpoints during the development phase. 
- (MVP #9) Deploy on Surge upon completion.

### Plan and Progress
For my initial plan for this week, please see the associated [Trello Board](https://trello.com/b/rqeBxQwd/ga-project-1-workflow-board). 

### Post-MVP Features
If I can complete the basic functionality of the game, I hope to also include:
- Difficulty-level game modes, (i.e. requiring only 2 or 3 "individual features" instead of all 4; maybe I'll even add a 5th for "Expert" mode!)
- Dark Mode and/or Colorblind-friendly mode(s).
- CSS Animation for dealing of the cards.
- Multiple player score tracking.
- Mobile-friendly layout options.

### Credits
So far, my research has led me to the following useful resources that I plan to use during game development:
- Game rules:
  - [SET Card game wikipedia page](https://en.wikipedia.org/wiki/Set_(card_game)) (for game rules)
- CSS Shapes:
  - [W3 Schools: How To - CSS Shapes](https://www.w3schools.com/howto/howto_css_shapes.asp)
  - [CSS-Tricks: The shapes of CSS](https://css-tricks.com/the-shapes-of-css/)
- CSS Background patterns:
  - [Magicpattern.design: CSS backgrounds toolbox](https://www.magicpattern.design/tools/css-backgrounds)
