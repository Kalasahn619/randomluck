// Create a 40-card deck: Ace (1) to 10 of each suit
function getCustomSuitOrder() {
  const suitList = document.getElementById("suitOrderList");
  return Array.from(suitList.children).map(li => li.getAttribute("data-suit"));
}

function createDeck() {
  const suits = getCustomSuitOrder();
  const deck = [];
  for (let suit of suits) {
    for (let value = 1; value <= 10; value++) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

// Draw 6 unique cards from the deck
function drawUniqueCards(deck, count = 6) {
  const shuffled = deck.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Display drawn cards
function displayCards(cards) {
  const cardDisplay = document.getElementById("cardDisplay");
  cardDisplay.innerHTML = cards.map(card => {
    const isRed = card.suit === "♥" || card.suit === "♦";
    const suitClass = isRed ? "red-suit" : "black-suit";
    return `<div class="card ${suitClass}">${card.value}${card.suit}</div>`;
  }).join("");
}

// Draw a random number (1–40)
function drawRandomNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

// Display random number
function displayNumber(number) {
  document.getElementById("numberDisplay").textContent = number;
}

// Convert card to real number based on suit
function cardToRealNumber(card) {
  const suitOrder = getCustomSuitOrder();
  const suitIndex = suitOrder.indexOf(card.suit);
  if (suitIndex === -1) return null;
  return card.value + suitIndex * 10;
}

// Run 500 simulations and display each result in historyLog
function runSimulations(numSimulations = 500) {
  const historyLog = document.getElementById("historyLog");
  // historyLog.innerHTML = ""; // Remove this line to keep history

  let firstDrawCards = null;
  let firstDrawNumber = null;

  for (let i = 0; i < numSimulations; i++) {
    const deck = createDeck();
    const drawnCards = drawUniqueCards(deck, 6);
    const randomNumber = drawRandomNumber();

    if (i === 0) {
      firstDrawCards = drawnCards;
      firstDrawNumber = randomNumber;
    }
  }

  // Display only the first draw
  const entry = document.createElement("li");
  const drawHtml = firstDrawCards.map(card => {
    const isRed = card.suit === "♥" || card.suit === "♦";
    const suitClass = isRed ? "red-suit" : "black-suit";
    return `<span class="${suitClass}">${card.value}${card.suit}</span>`;
  }).join(" ");
  entry.innerHTML = `Draw: ${drawHtml} | Number: <span>${firstDrawNumber}</span>`;

  // Real numbers line
  const realNumbers = firstDrawCards.map(cardToRealNumber).join(" ");
  const realNumbersDiv = document.createElement("div");
  realNumbersDiv.textContent = `Real Numbers: ${realNumbers}`;

  entry.appendChild(realNumbersDiv);
  historyLog.appendChild(entry);

  displayCards(firstDrawCards);
  displayNumber(firstDrawNumber);
}

// Reset display
function resetApp() {
  document.getElementById("cardDisplay").innerHTML = "";
  document.getElementById("numberDisplay").textContent = "";
  document.getElementById("historyLog").innerHTML = "";
}

// Save custom suit order (placeholder)
function saveSuitOrder() {
  const order = getCustomSuitOrder();
  alert("Suit order saved: " + order.join(", "));
  document.getElementById("suitOrderControl").style.display = "none";
  resetApp(); // Optional: reset or redraw
}

// Event listeners
document.getElementById("drawButton").addEventListener("click", () => {
  const deck = createDeck();
  const drawnCards = drawUniqueCards(deck, 6);
  const randomNumber = drawRandomNumber();

  displayCards(drawnCards);
  displayNumber(randomNumber);

  const historyLog = document.getElementById("historyLog");
  const entry = document.createElement("li");
  const drawHtml = drawnCards.map(card => {
    const isRed = card.suit === "♥" || card.suit === "♦";
    const suitClass = isRed ? "red-suit" : "black-suit";
    return `<span class="${suitClass}">${card.value}${card.suit}</span>`;
  }).join(" ");
  entry.innerHTML = `Draw: ${drawHtml} | Number: <span>${randomNumber}</span>`;

  // Real numbers line
  const realNumbers = drawnCards.map(cardToRealNumber).join(" ");
  const realNumbersDiv = document.createElement("div");
  realNumbersDiv.textContent = `Real Numbers: ${realNumbers}`;

  entry.appendChild(realNumbersDiv);
  historyLog.prepend(entry);
});

document.getElementById("simulateButton").addEventListener("click", () => {
  runSimulations(500);
});

document.getElementById("saveSuitOrderButton").addEventListener("click", saveSuitOrder);

document.getElementById("resetButton").addEventListener("click", () => {
  resetApp();
  document.getElementById("suitOrderControl").style.display = "";
});

// Drag-and-drop for suit order
const suitOrderList = document.getElementById("suitOrderList");
let draggedItem = null;

suitOrderList.addEventListener("dragstart", function(e) {
  draggedItem = e.target;
  e.dataTransfer.effectAllowed = "move";
  // Highlight the dragged item
  draggedItem.classList.add("dragging");
});

suitOrderList.addEventListener("dragend", function(e) {
  // Remove highlight
  if (draggedItem) draggedItem.classList.remove("dragging");
  draggedItem = null;
});

suitOrderList.addEventListener("dragover", function(e) {
  e.preventDefault();
  const target = e.target.closest("li");
  if (target && target !== draggedItem) {
    target.classList.add("drag-over");
  }
});

suitOrderList.addEventListener("dragleave", function(e) {
  const target = e.target.closest("li");
  if (target) {
    target.classList.remove("drag-over");
  }
});

suitOrderList.addEventListener("drop", function(e) {
  e.preventDefault();
  const target = e.target.closest("li");
  if (target && target !== draggedItem) {
    target.classList.remove("drag-over");
    suitOrderList.insertBefore(draggedItem, target);
  }
});