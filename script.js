// **** USE THIS TO SET THE LENGTH OF THE "DEAL CARD" ANIMATION
const FLIP_ANIM_DURATION = 1; 

const gameBoard = document.querySelector("#game-board");
const sidebar = document.querySelector("#game-sidebar");
const setCounter = document.querySelector("#set-count");
const dom_scoreCount = document.querySelector("#score-count");
const setsFoundList = document.querySelector(".sets-found-list");
const dom_gameModeSettingsBox = document.querySelector(".sidebar-settings-game-mode");
const dom_gameModeSettingsInputs = document.querySelectorAll(".sidebar-settings-game-mode input[type='radio']");
const deckSizeCounter = document.querySelector("#deck-size");
const dom_dealButton = document.querySelector("#deal-btn-init")
const dom_drawThreeButton = document.querySelector("#draw-three-btn");
const deckStackText = document.querySelector("#deck-stack-text");
const dom_hintBtn = document.querySelector("#hint-btn");
const dom_hintText = document.querySelector("#hint-text");


const options = {
  "number": [1, 2, 3],
  "color": ["A","B","C"],
  "shape": ["diamond","oval","numeral"],
  "fill": ["filled","empty","striped"]
};

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


// Generate the complete deck
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
makeDeck();

function draw() {
  let n = Math.floor(Math.random() * deck.length);
  let drawnCard = deck[n];
  deck.splice(n,1);
  deckSizeCounter.innerText = deck.length;
  return drawnCard;
}

// DRAW SET OF THREE CARDS:
function drawThree() {
  let drawSet = [];
  for (let i=0; i < 3; i++) {
    drawSet.push(draw());
  }
  return drawSet;
}

function checkBoardSize() {
  return onTheBoard.length < 12 ? dom_drawThreeButton.click() : true;
}


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

function checkForSet(arr) {
    // Check for Game Mode:
    if (gameMode == "expert") return winCheckNum(arr) && winCheckColor(arr) &&  winCheckShape(arr) && winCheckFill(arr);
    else if (gameMode == "intermediate") return winCheckNum(arr) && winCheckColor(arr) &&  winCheckShape(arr);
    else if (gameMode == "novice") return winCheckNum(arr) && winCheckColor(arr);
    else if (gameMode == "basic") return winCheckNum(arr);
}

function submitASet(arr) {
  const selectedDomCards = document.querySelectorAll(".selected");
  const isASet = checkForSet(arr);

  if (checkForSet(arr)) {
    foundSets.push(selectedCards);
  
    setCounter.innerText = foundSets.length;

    scoreCounter += (3*gameModeMult);
    scoreCounter < 0 ? scoreCounter = 0 : scoreCounter;
    dom_scoreCount.innerText = scoreCounter;

      const setFoundWrapper = document.createElement("div");
      setFoundWrapper.setAttribute("class","set-found-wrapper");

        // FLIP STATE SAVE:
        const state = Flip.getState(".card"); // *** <-- ANIMATION PRE-STATE

    selectedDomCards.forEach(e => {
      //const thisWidth = e.offsetWidth;
      e.style.position = "relative";
      e.style.width = "35px";
      e.style.height = "22px";
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
  
  } else { 
    incorrectCounter++;
    selectedDomCards.forEach(e => {
      e.classList.add("selected-wrong");
    });
    document.querySelector("#incorrect-counter").innerText = incorrectCounter;
  }

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

} // end "checkForSet()" function



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

}




/* ********** YOU CAN ONLY HAVE ONE OF THESE ACTIVE AT ONCE!!! ********** */
/* ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓  */

/* THIS IS THE DEALCARDS FUNCTION FOR GRID LAYOUT */
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
    
      // DUMMY TEXT JUST TO SEE THAT IT'S WORKING (before styling for shapes is complete)
      // thisShape.innerText = `Demo: ${e.id}`;     

      domCard.appendChild(thisShape);       // Append the current shape div to card-wrapper div

    } 
    gameBoard.appendChild(domCard);        // Append ALL of that to DOM gameBoard.

                                            // *** DOM ADD ***
    domCard.classList.add("card-new");      // <-- Added for the sake of the animation
    // FLIP STATE SAVE:
    const dealState = Flip.getState(".card"); // *** <-- ANIMATION PRE-STATE
    domCard.classList.remove("card-new");      // <-- Added for the sake of the animation
    // animate from the previous state to the current one:  
    Flip.from(dealState, {duration: FLIP_ANIM_DURATION, ease: "power1.inOut", absolute: true
    //onComplete: myFunc
    });

   
   
    onTheBoard.push(e);                     // Adds card object to the onTheTable array. 

    domCard.addEventListener('click', () => {
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

/* THIS IS THE DEALCARDS FUNCTION FOR FLEX MATRIX LAYOUT */
// function dealCards(arr) {       
//   const domCardCol = document.createElement("div");       // Create a card column for each set of 3 cards
//   domCardCol.setAttribute("class","card-col-flex-wrapper");

//   arr.forEach(e => {

//     const domCard = document.createElement("div");        // Create a card-wrapper div, set class and id
//     domCard.setAttribute("class","card card-wrapper");
//     domCard.setAttribute("id", `${e.id}`);

//     // Create and append "shape" div n number of times, based on current object's "number" value
//     let n = parseInt(e.number);
//     for (let i=0; i < n; i++) {
    
//       //Create a shape div according to the current object specs  
//     const thisShape = document.createElement("div");
//     thisShape.setAttribute("class",`shape-object color-${e.color} fill-${e.fill} shape-${e.shape}`);
//     thisShape.setAttribute("id",`${e.id}-${i}`); // Set unique id.
    
//       // DUMMY TEXT JUST TO SEE THAT IT'S WORKING (before styling for shapes is complete)
//       // thisShape.innerText = `Demo: ${e.id}`;     

//       domCard.appendChild(thisShape);       // Append the current shape n times to card div (to make 1, 2, or 3 shapes on a card)
//     } 

//     domCardCol.appendChild(domCard);      // Append each card to the domCardColumn
//     onTheBoard.push(e);                     // Adds card object to the onTheBoard array. 

//     // ADDS THE EVENT LISTENER TO EACH INDIVIDUAL CARD ONCE IT IS CREATED
//     domCard.addEventListener('click', () => {
//       console.log(`you clicked ${e.id}`);
//       e.isActive = !e.isActive;
//                 console.log("current card object:", e, "current card.isActive:", e.isActive);

//       // Check if e is in the SelectedCards array: if not, add it; if yes, find it and remove it.
//       if (!selectedCards.includes(e)) selectedCards.push(e);
//        else if (selectedCards[0] == e) selectedCards.shift();
//         else selectedCards.pop();
//                   console.log("Selected cards array:", selectedCards);

//       e.isActive ? domCard.classList.add("selected") : domCard.classList.remove("selected");

//       // If this was the 3rd card, check for win conditions
//       if (selectedCards.length > 2) {
//         checkForSet(selectedCards);
//       }
//     })
//   })
//   gameBoard.appendChild(domCardCol);      // Finally, append ALL of that to DOM gameBoard.
// }

/* ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑  */
/* ********** YOU CAN ONLY HAVE ONE OF THESE ACTIVE AT ONCE!!! ********** */


function fullReset() {
  if (prompt("Are you sure you want to reset the game?")) {
    document.querySelectorAll(".card").remove();
    gameBoard.innerHTML = "";
  }
}





/////////////////////// EVENT LISTENERS

// TO START THE GAME AND DRAW 12 CARDS
dom_dealButton.addEventListener("click", () => {
  for (let i=0; i < 4; i++) {
    dealCards(drawThree());
  }
  dom_dealButton.style.display = "none";
  dom_drawThreeButton.style.display = "flex";
  deckStackText.innerText = "Can't find a set?";
  dom_hintBtn.style.display = "inherit";

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

// FOR ALL SUBSEQUENT CARD DRAWS, INCLUDING COMPUTER-INITIATED ONES:
dom_drawThreeButton.addEventListener("click", () => {
  dealCards(drawThree());
});

// FOR THE HINT BUTTON
dom_hintBtn.addEventListener("click", () => {
  
  // ON first HINT click:
  if (!currentHint.length) {

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
    console.log(hint1);
    dom_hintText.innerText = hint1;
    dom_hintText.style.animation = "fade-in 4s";
    dom_hintBtn.innerText = "Need a bigger hint?";

  } // End first hint section
  else {        // second hint section 

    scoreCounter -= 2*gameModeMult;   // penalty for taking a 2nd hint (2/3 of points)

    const cardHint1 = document.querySelector(`[data-id-num="${currentHint[0].id_num}"]`);
    const cardHint2 = document.querySelector(`[data-id-num="${currentHint[1].id_num}"]`);
    cardHint1.style.animation = "glow-fade-in-out 3s infinite";
    cardHint2.style.animation = "glow-fade-in-out 3s infinite";
  }
});

//dom_dealButton.click();









