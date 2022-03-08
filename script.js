const gameBoard = document.querySelector("#game-board");
const sidebar = document.querySelector("#game-sidebar");
const dealButton = document.querySelector("#deal-btn-init")
const drawThreeButton = document.querySelector("#draw-three-btn");

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

// Generate the complete deck
let deck = [];
let onTheBoard = [];
let selectedCards = [];

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
  return drawnCard;
}

// console.log(draw());
// console.log(deck);

// *** FIRST DRAW FUNCTION: Draw the initial 12 cards for the game:
function firstDraw() {
  let firstDrawSet = [];
  for (let i=0; i<12; i++) {
    firstDrawSet.push(draw());
  }
  return firstDrawSet;
}

function drawThree() {
  let drawSet = [];
  for (let i=0;i<3;i++) {
    drawSet.push(draw());
  }
  return drawSet;
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
  if (winCheckNum(arr)) {
    console.log("Numbers check out!");
   } else { 
     console.log("nope! Removing active...");
     selectedCards.forEach(e => {
       const thisNode = document.getElementById(e.id);
       thisNode.classList.remove("selected");
       e.isActive = false;
     })
     selectedCards = [];

     console.log("Removed!", arr, selectedCards);
   }
}






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

      // Check if e is in the SelectedCards array: if not, add it; if yes, find it and remove it.
      if (!selectedCards.includes(e)) selectedCards.push(e);
       else if (selectedCards[0] == e) selectedCards.shift();
        else selectedCards.pop();

      
      e.isActive = !e.isActive;                                   // Should move this to the end, and reshuffle the logic here.
      e.isActive ? domCard.classList.add("selected") : domCard.classList.remove("selected");
      console.log(selectedCards);


      // If this was the 3rd card, check for win conditions
      if (selectedCards.length > 2) {
        checkForSet(selectedCards);
        console.log("checking...");
      }
    })
  })
}







///// EVENT LISTENERS
dealButton.addEventListener("click", () => {
  let firstDrawDeck = firstDraw(12);
  dealCards(firstDrawDeck);
})
drawThreeButton.addEventListener("click", () => {
  dealCards(drawThree());
})