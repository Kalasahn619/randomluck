const suits = ["♠", "♣", "♥", "♦"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
let cardStats = {};
let numberStats = {};
let historyLog = [];

function createDeck() {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawCardsAndNumber() {
  let deck = shuffle(createDeck());
  let drawnCards = deck.slice(0, 6);
  let randomNumber = Math.floor(Math.random() * 10) + 1;

  updateStats(drawnCards, randomNumber);
  displayDraw(drawnCards, randomNumber);
  updateTopStats();
}

function updateStats(cards, number) {
  for (let card of cards) {
    let key = `${card.value}${card.suit}`;
    cardStats[key] = (cardStats[key] || 0) + 1;
  }
  numberStats[number] = (numberStats[number] || 0) + 1;
}

function displayDraw(cards, number) {
  const cardDisplay = document.getElementById("cardDisplay");
  const numberDisplay = document.getElementById("numberDisplay");
  cardDisplay.innerHTML = "";
  numberDisplay.textContent = number;

  for (let card of cards) {
    const cardDiv = document.createElement("div");
    let colorClass = (card.suit === "♥" || card.suit === "♦") ? "red" : "black";
    cardDiv.className = `card ${colorClass}`;

    cardDiv.innerHTML = `
      <div class="corner top-left">${card.value}${card.suit}</div>
      <div class="center-suit">${card.suit}</div>
      <div class="corner bottom-right">${card.value}${card.suit}</div>
    `;

    cardDisplay.appendChild(cardDiv);
  }
}

function updateTopStats() {
  const topCardsDiv = document.getElementById("topCards");
  const topNumbersDiv = document.getElementById("topNumbers");

  const sortedCards = Object.entries(cardStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([card]) => card);

  const maxNumCount = Math.max(...Object.values(numberStats));
  const topNumbers = Object.entries(numberStats)
    .filter(([_, count]) => count === maxNumCount)
    .map(([num]) => num);

  topCardsDiv.textContent = sortedCards.join(", ");
  topNumbersDiv.textContent = topNumbers.join(", ");
}

function runSimulation() {
    let localCardStats, localNumberStats, topNumbers;
  
    do {
      localCardStats = {};
      localNumberStats = {};
  
      for (let i = 0; i < 100; i++) {
        let deck = shuffle(createDeck());
        let drawnCards = deck.slice(0, 6);
        let randomNumber = Math.floor(Math.random() * 10) + 1;
  
        for (let card of drawnCards) {
          let key = `${card.value}${card.suit}`;
          localCardStats[key] = (localCardStats[key] || 0) + 1;
        }
        localNumberStats[randomNumber] = (localNumberStats[randomNumber] || 0) + 1;
      }
  
      const maxNumCount = Math.max(...Object.values(localNumberStats));
      topNumbers = Object.entries(localNumberStats)
        .filter(([_, count]) => count === maxNumCount)
        .map(([num]) => num);
  
    } while (topNumbers.length > 1); // Repeat if there's a tie
  
    // Merge local stats into global stats
    for (let [card, count] of Object.entries(localCardStats)) {
      cardStats[card] = (cardStats[card] || 0) + count;
    }
    for (let [num, count] of Object.entries(localNumberStats)) {
      numberStats[num] = (numberStats[num] || 0) + count;
    }
  
    const sortedCards = Object.entries(localCardStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([card]) => card);
  
    historyLog.push({ cards: sortedCards, numbers: topNumbers });
    updateHistoryLog();
  }
  

function updateHistoryLog() {
    const log = document.getElementById("historyLog");
    log.innerHTML = "";
  
    historyLog.forEach((entry, index) => {
      const li = document.createElement("li");
  
      // Format each card with color
      const formattedCards = entry.cards.map(card => {
        const suit = card.slice(-1);
        const value = card.slice(0, -1);
        const color = (suit === "♥" || suit === "♦") ? "red" : "black";
        return `<span class="${color}">${value}${suit}</span>`;
      });
  
      li.innerHTML = `Simulation ${index + 1}: Top Cards - ${formattedCards.join(", ")}, Top Number(s) - ${entry.numbers.join(", ")}`;
      log.appendChild(li);
    });
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("Service Worker Registered"));
  }
   

function resetApp() {
  cardStats = {};
  numberStats = {};
  historyLog = [];
  document.getElementById("cardDisplay").innerHTML = "";
  document.getElementById("numberDisplay").textContent = "";
  document.getElementById("topCards").textContent = "";
  document.getElementById("topNumbers").textContent = "";
  document.getElementById("historyLog").innerHTML = "";
}

document.getElementById("drawButton").addEventListener("click", drawCardsAndNumber);
document.getElementById("simulateButton").addEventListener("click", runSimulation);
document.getElementById("resetButton").addEventListener("click", resetApp);
