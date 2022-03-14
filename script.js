// **** USE THIS TO SET THE LENGTH OF THE "DEAL CARD" ANIMATION
const FLIP_ANIM_DURATION = 1; 

//////////////////////////////////////////////////////
//////////////////// DOM ELEMENTS //////////////////// 
//////////////////////////////////////////////////////

const gameBoard = document.querySelector("#game-board");
const sidebar = document.querySelector("#game-sidebar");
const setCounter = document.querySelector("#set-count");
const dom_scoreCount = document.querySelector("#score-count");
const dom_incorrectCounter = document.querySelector("#incorrect-counter")
const setsFoundList = document.querySelector(".sets-found-list");
const dom_gameModeSettingsBox = document.querySelector(".sidebar-settings-game-mode");
const dom_gameModeSettingsInputs = document.querySelectorAll(".sidebar-settings-game-mode input[type='radio']");
const deckSizeCounter = document.querySelector("#deck-size");
const dom_dealButton = document.querySelector("#deal-btn-init")
const dom_drawThreeButton = document.querySelector("#draw-three-btn");
const deckStackText = document.querySelector("#deck-stack-text");
const dom_hintBtn = document.querySelector("#hint-btn");
const dom_hintText = document.querySelector("#hint-text");
const gameOverScreen = document.querySelector(".game-over-screen");
const gameOverScreen_text = document.querySelector("#game-over-text");
const gameOverScreen_score = document.querySelector(".game-over-screen span#this-game-score");
const gameOverScreen_highscore = document.querySelector(".game-over-screen span#high-score");

const dom_playAgainBtn = document.querySelector("#play-again-btn");

//////////////////////////////////////////////////////
////////////////// GLOBAL VARIABLES ////////////////// 
//////////////////////////////////////////////////////

class Card {
  constructor(number, color, fill, shape, id, id_num) {
    this.number = number;
    this.color = color;
    this.fill = fill;
    this.shape = shape;
    this.id_num = id_num;
    this.isActive = false;
    this.id = id;
  }
}

// DO NOT EDIT: Css rules are based on these naming conventions
const options = {
  "number": [1, 2, 3],
  "color": ["A","B","C"],
  "shape": ["diamond","oval","numeral"],
  "fill": ["filled","empty","striped"]
};

let deck = [];
let onTheBoard = [];
let selectedCards = [];
let foundSets = [];
let scoreCounter = 0;
let incorrectCounter = 0;
let gameMode = "";
let gameModeMult = 1;
let solutions = [];
let currentHint = [];
let highScore = 0;


//////////////////////////////////////////////////////
/////////////////// SETUP FUNCTIONS ////////////////// 
//////////////////////////////////////////////////////

// Function to GENERATE the COMPLETE DECK
function makeDeck() {
  let c = 1;
  const keys = Object.keys(options);
  for (let i=0; i < options.number.length; i++) {
    for (let j=0; j < options.color.length; j++) {
      for (let k=0; k < options.fill.length; k++) {
        for (let m=0; m < options.shape.length; m++) {
          const thisCard = new Card(options.number[i], options.color[j], options.fill[k], options.shape[m], `${options.color[j]}-${options.fill[k]}-${options.shape[m]}-${options.number[i]}`, c);
          deck.push(thisCard);
          c++;
        }
      }
    }
  }
}

makeDeck();         // CALL the MAKEDECK FUNCTION to build deck



//////////////////////////////////////////////////////
////////////////////// FUNCTIONS ///////////////////// 
//////////////////////////////////////////////////////


///// RESET FUNCTION /////

function fullReset() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(e => e.remove());
  const allCardWrappers = document.querySelectorAll(".card-wrapper");
  allCardWrappers.forEach(e => e.remove());  
  setCounter.innerText = "0";
  setsFoundList.innerHTML = "";

  dom_dealButton.style.display = "flex";
  dom_drawThreeButton.style.display = "none";
  deckStackText.innerText = "Ready to play?";
  
  dom_hintBtn.style.removeProperty('animation');
  dom_hintBtn.style.opacity = "0";


  dom_gameModeSettingsInputs.forEach(e => e.disabled = false);

  dom_gameModeSettingsBox.style.opacity = "100%";
  

  gameOverScreen.style.display = "none";

  deck = [];
  onTheBoard = [];
  selectedCards = [];
  foundSets = [];
  scoreCounter = 0;
    dom_scoreCount.innerText = scoreCounter;
  incorrectCounter = 0;
    dom_
  gameMode = "";
  gameModeMult = 1;
  solutions = [];
  currentHint = [];
  highScore = 0;
  makeDeck();
}         // End fullReset() function

// CORE FUNCTION for DRAWING CARDS:
function draw() {
  let n = Math.floor(Math.random() * deck.length);
  let drawnCard = deck[n];
  deck.splice(n,1);
  deckSizeCounter.innerText = deck.length;
  return drawnCard;
}

// CORE FUNCTION to DRAW 3X CARDS:
function drawThree() {
  let drawSet = [];
  for (let i=0; i < 3; i++) {
    drawSet.push(draw());
  }
  return drawSet;
}

// FUNCTION to determine board size, draw new cards if less than 12
function checkBoardSize() {
  checkForSolutions();
  console.info("check board size:", {onTheBoard, deck, solutions});

  if (deck.length >= 3) {
    return onTheBoard.length < 12 ? dom_drawThreeButton.click() : null;
  } 
  else if (deck.length == 0 && checkForSolutions().length > 0) {
    console.log(`deck.length == 0, but checkForSolutions() returns true!`);
    return null;
  }
  else {    // deck.length == 0 && checkForSolutions().length == 0
    console.log(`deck.length == 0 AND checkForSolutions() returns false!`);

    if (scoreCounter > highScore) highScore = scoreCounter;

    //console.log("Nearing endgame!");
    if (onTheBoard.length == 0) {
      console.log(`onTheBoard.length == 0! Empty Board!`);

      gameOverScreen_text.innerHTML = `You cleared all Sets!<br />Congratulations!`;
    }
    else if (onTheBoard.length > 0) {
      console.log(`deck.length == 0, but checkForSolutions().length > 0!`);

      gameOverScreen_text.innerHTML = `There are no more Sets!<br />Game over!`;      
    } 
    gameOverScreen.style.display = "flex";
    gameOverScreen_score.innerText = scoreCounter;
    gameOverScreen_highscore.innerText = highScore; // GET THIS FROM SOME LOCAL VARIABLE. 
  }
}

///////////////////////////////////
///// WIN CONDITION FUNCTIONS /////
///////////////////////////////////

function winCheckNum(arr) {
  if (arr[0].number == arr[1].number && arr[1].number == arr[2].number) return true;
   else if (arr[0].number != arr[1].number && arr[0].number != arr[2].number && arr[1].number != arr[2].number) return true;
    else return false;
}
function winCheckShape(arr) {
  if (arr[0].shape == arr[1].shape && arr[1].shape == arr[2].shape) return true;
   else if (arr[0].shape != arr[1].shape && arr[0].shape != arr[2].shape && arr[1].shape != arr[2].shape) return true;
    else return false;
}
function winCheckColor(arr) {
  if (arr[0].color == arr[1].color && arr[1].color == arr[2].color) return true;
   else if (arr[0].color != arr[1].color && arr[0].color != arr[2].color && arr[1].color != arr[2].color) return true;
    else return false;
}
function winCheckFill(arr) {
  if (arr[0].fill == arr[1].fill && arr[1].fill == arr[2].fill) return true;
   else if (arr[0].fill != arr[1].fill && arr[0].fill != arr[2].fill && arr[1].fill != arr[2].fill) return true;
    else return false;
}

// FUNCTION to check SELECTED CARDS against ALL WIN CONDITIONS
function checkForSet(arr) {
  // Check win conditions, as required by Game Mode:
  if (gameMode == "expert") return winCheckNum(arr) && winCheckColor(arr) &&  winCheckShape(arr) && winCheckFill(arr);
  else if (gameMode == "intermediate") return winCheckNum(arr) && winCheckColor(arr) &&  winCheckShape(arr);
  else if (gameMode == "novice") return winCheckNum(arr) && winCheckColor(arr);
  else if (gameMode == "basic") return winCheckNum(arr);
}

// FUNCTION TO FORMALLY SUBMIT A SET TO BE CHECKED and COUNTED
function submitASet(arr) {
  const selectedDomCards = document.querySelectorAll(".selected");
  const isASet = checkForSet(arr);
  
  
  if (checkForSet(arr)) {
  
    ///////////////////////
    // IF THE SET IS VALID:
  
    foundSets.push(selectedCards);
  
    // Update "Sets Found" counter & DOM
    setCounter.innerText = foundSets.length;

    // Update "Score" counter & DOM
    scoreCounter += (3*gameModeMult);
    scoreCounter < 0 ? scoreCounter = 0 : scoreCounter;
    dom_scoreCount.innerText = scoreCounter;


    // ADD CARD DIVS TO "Sets Found" container  
    const setFoundWrapper = document.createElement("div");                                      
    setFoundWrapper.setAttribute("class","set-found-wrapper");

    const state = Flip.getState(".card"); // *** <-- FLIP ANIMATION PRE-STATE

    selectedDomCards.forEach(e => {
      //const thisWidth = e.offsetWidth;
      e.style.position = "relative";
      e.style.width = "46px";
      e.style.height = "28px";
      e.style.borderWidth = "1px";
      e.style.borderRadius = "4px";
      e.style.boxShadow = "none";
      e.style.cursor = "default";
      setFoundWrapper.appendChild(e);
      Array.from(e.children).forEach(c => {
        c.style.borderWidth = "1px";
        c.style.backgroundSize = "4px 4px";
        c.classList.contains("shape-numeral") ? c.style.borderRadius = "1px" : null;
      });
    });

    setsFoundList.prepend(setFoundWrapper);

    // Remove those cards from js array "onTheBoard"
    let ontheboardCardIndexes = [];
    onTheBoard.forEach((e,i) => {
      if (arr.includes(e)) onTheBoard[i] = null;
    }) // End forEach loop

    onTheBoard = onTheBoard.filter(e => e !== null);

    // animate from the previous state to the current one:  
    Flip.from(state, {duration: FLIP_ANIM_DURATION , ease: "power1.inOut", absolute: true, absoluteOnLeave: false,
    onComplete: () => {
      setFoundWrapper.replaceWith(setFoundWrapper.cloneNode(true));
      (document.querySelectorAll(".set-found-wrapper .card")).forEach(e => e.classList.remove("card"));
      }
    });

    // If removing the 3 cards makes the board have <12, draw back up to 12;
    setTimeout(() => {checkBoardSize()}, FLIP_ANIM_DURATION*1000);

    // Reset hint system
    currentHint = [];
    dom_hintBtn.innerText = "Need a hint?";
    dom_hintText.style.animation = "fade-out 2s forwards";
  
  }         // END if SET IS VALID 

  else {    // ELSE (SET is invalid)
    incorrectCounter++;
    selectedDomCards.forEach(e => {
      e.classList.add("selected-wrong");
    });
    dom_incorrectCounter.innerText = incorrectCounter;
  }         // END else (SET invalid)

  // After win OR lose, for each selected card: remove class "selected" from DOM,
  // and reset object's "isActive" property to "false"; then empty selectedCards array.
const unsetSelecedCards = () => {
  selectedCards.forEach(e => {
    const thisNode = document.getElementById(e.id);
    thisNode.classList.remove("selected");
    thisNode.classList.remove("selected-wrong");
    e.isActive = false;
    }) 
  selectedCards = [];
}
if (isASet) unsetSelecedCards();
else setTimeout(() => {unsetSelecedCards()}, 500);

}         // end "checkForSet()" function



///////////////////////////////
///// COMPUTER DETERMINED ///// 
///// SETS ON THE BOARD ///////

function checkForSolutions() {
  solutions = [];
  onTheBoard.forEach((e,i) => {
    for (let a=i+1; a < onTheBoard.length; a++) {
      for (let b=i+1; b < onTheBoard.length; b++) {
        if (a == i || b == i || a == b) null;
        else {
          const possibleSet = [e, onTheBoard[a], onTheBoard[b]];
          checkForSet(possibleSet) ? solutions.push(possibleSet) : null; 
        }
      }
    }
  })
  return solutions;
}         // End "checkForSolutions()" function





//////////////////////////////////////
/* DEALCARDS FUNCTION (GRID LAYOUT) */
//////////////////////////////////////

function dealCards(arr) {
  arr.forEach(e => {
    // Create a card-wrapper div, set class and id
    const domCard = document.createElement("div");
    domCard.setAttribute("class","card card-wrapper");
    domCard.setAttribute("id", `${e.id}`);
    domCard.setAttribute("data-id-num",e.id_num);

    // Create and append "shape" div n number of times, based on current object's "number" value
    let n = parseInt(e.number);
    for (let i=0; i < n; i++) {
    
      //Create a shape div according to the current object specs  
    const thisShape = document.createElement("div");
    thisShape.setAttribute("class",`shape-object color-${e.color} fill-${e.fill} shape-${e.shape}`);
    thisShape.setAttribute("id",`${e.id}-${i}`); // Set unique id.
    thisShape.setAttribute("data-shape-mult", `${i}`);
    
      domCard.appendChild(thisShape);       // Append the current shape div to card-wrapper div
    } 
    gameBoard.appendChild(domCard);        // Append ALL of that to DOM gameBoard.

    ///// ADD TO DOM /////

    domCard.classList.add("card-new");      // <-- Added for the sake of the animation
    
    const dealState = Flip.getState(".card"); // *** <-- FLIP ANIMATION PRE-STATE
    domCard.classList.remove("card-new");      // <-- Added for the sake of the animation

    // animate from the previous state to the current one:  
    Flip.from(dealState, {duration: FLIP_ANIM_DURATION, ease: "power1.inOut", absolute: true});

    onTheBoard.push(e);                     // Adds card object to the onTheTable array. 

    ///////////////////////////////////////////
    ///// ADD EVENT LISTENER TO EACH CARD /////
    ///// AS IT IS ADDED TO THE DOM ///////////

    domCard.addEventListener('click', () => {
      
      // Update "isActive" value in the Card object itself
      e.isActive = !e.isActive;

      // Check if e is in the SelectedCards array: if not, add it; if yes, find it and remove it.
      if (!selectedCards.includes(e)) selectedCards.push(e);
       else if (selectedCards[0] == e) selectedCards.shift();
        else selectedCards.pop();

      if (e.isActive) {
        domCard.classList.add("selected");
        domCard.style.animation = "none"; 
      } else { domCard.classList.remove("selected") };

      // If this was the 3rd card, check for win conditions
      if (selectedCards.length > 2) {
        submitASet(selectedCards);
      }
    })
  })
}





/////////////////////////////////////////////////////////
//////////////////// EVENT LISTENERS //////////////////// 
/////////////////////////////////////////////////////////

// DEAL BUTTON: START THE GAME AND DRAW 12 CARDS
dom_dealButton.addEventListener("click", () => {
  for (let i=0; i < 4; i++) {
    dealCards(drawThree());
  }
  dom_dealButton.style.display = "none";
  dom_drawThreeButton.style.display = "flex";
  deckStackText.innerText = "Can't find a set?";
  dom_hintBtn.style.animation = "fade-in 3s forwards";

  if (document.querySelector("input#mode-basic").checked) { 
    gameMode = "basic";
    gameModeMult = 1;
  }
  if (document.querySelector("input#mode-novice").checked) { 
    gameMode = "novice";
    gameModeMult = 2;
  }
  if (document.querySelector("input#mode-intermediate").checked) { 
    gameMode = "intermediate";
    gameModeMult = 3;
  }
  if (document.querySelector("input#mode-expert").checked) { 
    gameMode = "expert";
    gameModeMult = 4;
  }
  dom_gameModeSettingsInputs.forEach(e => e.disabled = true);

  dom_gameModeSettingsBox.style.opacity = "50%";
  checkForSolutions();
});

// DRAW-THREE BUTTON: FOR ALL SUBSEQUENT CARD DRAWS, INCLUDING COMPUTER-INITIATED ONES:
dom_drawThreeButton.addEventListener("click", () => {
  dealCards(drawThree());
});


// HINT BUTTON: GENERATE SOLUTIONS AND PICK ONE TO SHARE WITH PLAYER //
dom_hintBtn.addEventListener("click", () => {
  
  if (!currentHint.length) {        
    
    //////////////////////
    // ON FIRST HINT click 

    scoreCounter -= gameModeMult;   // penalty for taking a 1st hint (1/3 of points)
    
    const sols = checkForSolutions();
    const randIndex = Math.floor(Math.random() * sols.length);
    currentHint = sols[randIndex];
    
    const numSame = currentHint[0].number == currentHint[1].number;
    const colSame = currentHint[0].color == currentHint[1].color;
    const shapeSame = currentHint[0].shape == currentHint[1].shape;
    const fillSame = currentHint[0].fill == currentHint[1].fill;

    let hint1 = "";
    if (gameMode == "basic") {
      if (numSame) hint1 += `You can make a Set using all the same number...`; 
      else hint1 += "You can make a Set using all different numbers...";
    }
    else if (gameMode == "novice") {
      if (colSame) hint1 += "You can make a Set using all the same color..."
      else if (numSame) hint1 += "You can make a Set using all the same number..."
      else hint1 += "You can make a Set where both colors and numbers are ALL different...";
    }
    else if (gameMode == "intermediate") {
      if (colSame) hint1 += "You can make a Set using all the same color..."
      else if (shapeSame) hint1 += "You can make a Set using all the same shape..."
      else if (numSame) hint1 += "You can make a Set using all the same number..."
      else hint1 += "You can make a Set where colors, shapes and numbers are ALL different...";
    }
    else if (gameMode == "expert") {
      if (colSame) hint1 += "You can make a Set using all the same color..."
      else if (shapeSame) hint1 += "You can make a Set using all the same shape..."
      else if (fillSame) hint1 += "You can make a Set using all the same fill pattern..."
      else if (numSame) hint1 += "You can make a Set using all the same number..."
      else hint1 += "You can make a Set where ALL elements are different...";
    }
    dom_hintText.innerText = hint1;
    dom_hintText.style.animation = "fade-in 4s";
    dom_hintBtn.innerText = "Need a bigger hint?";

  }             // End first hint section
  
  else {        // Start second hint section 

    scoreCounter -= 2*gameModeMult;   // penalty for taking a 2nd hint (2/3 of points)

    const cardHint1 = document.querySelector(`[data-id-num="${currentHint[0].id_num}"]`);
    const cardHint2 = document.querySelector(`[data-id-num="${currentHint[1].id_num}"]`);
    cardHint1.style.animation = "glow-fade-in-out 3s infinite";
    cardHint2.style.animation = "glow-fade-in-out 3s infinite";
  }             // End second hint section
});

dom_playAgainBtn.addEventListener("click", () => {
  fullReset();
})









// // TROUBLESHOOTING FOR ENDGAME: TRIM THE DECK DOWN TO 15 CARDS
// for (let i=0; i < 81-15; i++) {
//   let r = Math.floor(Math.random() * deck.length);
//   deck.splice(r,1);

//   // OR:

//   // deck.pop();
// }