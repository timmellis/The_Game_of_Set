const gameBoard = document.querySelector("#game-board");
const sidebar = document.querySelector("#game-sidebar");
const dealButton = document.querySelector("#deal-btn-init")
const drawThreeButton = document.querySelector("#draw-three-btn");

const options = {
  "number": [1, 2, 3],
  "color": ["purple","teal","orange"],
  "fill": ["filled","empty","striped"],
  "shape": ["diamond","oval","pillar"]
};

class Card {
  constructor(number, color, fill, shape, id) {
    this.number = number;
    this.color = color;
    this.fill = fill;
    this.shape = shape;
    this.id = id;
  }
  isActive() {
    console.log(`${this.id} got clicked.`);   
  }
}

// Generate the complete deck
let deck = [];

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
      thisShape.innerText = `Demo: ${e.id}`;     

      domCard.appendChild(thisShape);       // Append the current shape div to card-wrapper div

    } 
    gameBoard.appendChild(domCard);         // Append ALL of that to DOM gameBoard
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