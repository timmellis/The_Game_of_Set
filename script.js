const gameBoard = document.querySelector("#game-board");
const sidebar = document.querySelector("#game-sidebar");
const dealButton = document.querySelector("#deal-btn-init")
const drawThreeButton = document.querySelector("#draw-three-btn");
const setCounter = document.querySelector("#set-count");
const setsFoundList = document.querySelector(".sets-found-list");
const deckSizeCounter = document.querySelector("#deck-size");

const options = {
  "number": [1, 2, 3],
  "color": ["A","B","C"],
  "fill": ["filled","empty","striped"],
  "shape": ["diamond","oval","numeral"]
};

class Card {
  constructor(number, color, fill, shape, id) {
    this.number = number;
    this.color = color;
    this.fill = fill;
    this.shape = shape;
    this.id = id;
    this.isActive = false;
  }
  toggleActive() {
    console.log(`${this.id} got clicked.`);
       
  }
}

let deck = [];
let onTheBoard = [];
let selectedCards = [];
let foundSets = [];

// Generate the complete deck
function makeDeck() {
  const keys = Object.keys(options);
  for (let i=0; i < options.number.length; i++) {
    for (let j=0; j < options.color.length; j++) {
      for (let k=0; k < options.fill.length; k++) {
        for (let m=0; m < options.shape.length; m++) {
          const thisCard = new Card(options.number[i], options.color[j], options.fill[k], options.shape[m], `${options.color[j]}-${options.fill[k]}-${options.shape[m]}-${options.number[i]}`);
          deck.push(thisCard);
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
  return onTheBoard.length < 12 ? dealCards(drawThree()) : true;
  
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
  // IF the 3 selected cards meet the required win conditions:
  
  const setting_reqNumber = document.querySelector("#checkbox-number").checked;
  const setting_reqColor = document.querySelector("#checkbox-color").checked;
  const setting_reqShape = document.querySelector("#checkbox-shape").checked;
  const setting_reqFill = document.querySelector("#checkbox-fill").checked;
  
  const reqNum = setting_reqNumber ? winCheckNum(arr) : true;
  const reqColor = setting_reqColor ? winCheckColor(arr) : true;
  const reqShape = setting_reqShape ? winCheckShape(arr) : true;
  const reqFill = setting_reqFill ? winCheckFill(arr) : true;

  if (reqNum && reqColor && reqShape && reqFill) {
    console.log("Win? WIN!");
    foundSets.push(selectedCards);
  
                console.log("Found sets: ", foundSets.length, foundSets);

    setCounter.innerText = foundSets.length;

    const selectedDomCards = document.querySelectorAll(".selected");
    selectedDomCards.forEach(e => e.style.display = 'none');
    onTheBoard.forEach((e,i) => {
      if (arr.includes(e)) onTheBoard.splice(i,1);
    })
    
    checkBoardSize(); // If removing the 3 cards makes the board have <12, draw back up to 12;
    

  } else { 
    console.log("Win? No!");
  }

  // After win OR lose, for each selected card: 
  // remove class "selected" from DOM,
  // and reset object's "isActive" property to "false"; 
  // then empty selectedCards array.
  selectedCards.forEach(e => {
  const thisNode = document.getElementById(e.id);
  thisNode.classList.remove("selected");
  e.isActive = false;
  }) 
  selectedCards = [];

} // end "checkForSet()" function





/* ********** YOU CAN ONLY HAVE ONE OF THESE ACTIVE AT ONCE!!! ********** */
/* ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓  */

/* THIS IS THE DEALCARDS FUNCTION FOR GRID LAYOUT */
function dealCards(arr) {
  arr.forEach(e => {
    // Create a card-wrapper div, set class and id
    const domCard = document.createElement("div");
    domCard.setAttribute("class","card card-wrapper");
    domCard.setAttribute("id", `${e.id}`);

    // Create and append "shape" div n number of times, based on current object's "number" value
    let n = parseInt(e.number);
    for (let i=0; i < n; i++) {
    
      //Create a shape div according to the current object specs  
    const thisShape = document.createElement("div");
    thisShape.setAttribute("class",`shape-object color-${e.color} fill-${e.fill} shape-${e.shape}`);
    thisShape.setAttribute("id",`${e.id}-${i}`); // Set unique id.
    
      // DUMMY TEXT JUST TO SEE THAT IT'S WORKING (before styling for shapes is complete)
      // thisShape.innerText = `Demo: ${e.id}`;     

      domCard.appendChild(thisShape);       // Append the current shape div to card-wrapper div

    } 
    gameBoard.appendChild(domCard);         // Append ALL of that to DOM gameBoard.
    onTheBoard.push(e);                     // Adds card object to the onTheTable array. 

    domCard.addEventListener('click', () => {
      console.log(`you clicked ${e.id}`);
      e.isActive = !e.isActive;
                console.log("current card object:", e, "current card.isActive:", e.isActive);

      // Check if e is in the SelectedCards array: if not, add it; if yes, find it and remove it.
      if (!selectedCards.includes(e)) selectedCards.push(e);
       else if (selectedCards[0] == e) selectedCards.shift();
        else selectedCards.pop();
                  console.log("Selected cards array:", selectedCards);

      e.isActive ? domCard.classList.add("selected") : domCard.classList.remove("selected");

      // If this was the 3rd card, check for win conditions
      if (selectedCards.length > 2) {
        checkForSet(selectedCards);
        console.log("checking...");
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





///// EVENT LISTENERS
dealButton.addEventListener("click", () => {
  for (let i=0; i < 4; i++) {
    dealCards(drawThree());
  }
})
drawThreeButton.addEventListener("click", () => {
  dealCards(drawThree());
})

dealButton.click();