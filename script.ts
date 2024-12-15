interface Player {
    name: string;
    money: number;
    position: number;
    properties: string[];
    houses: number;
}

const monopolyBoard: string[] = [
    "GO", "Mediterranean Avenue", "Community Chest", "Baltic Avenue", "Income Tax",
    "Reading Railroad", "Oriental Avenue", "Chance", "Vermont Avenue", "Connecticut Avenue",
    "Jail/Just Visiting", "St. Charles Place", "Electric Company", "States Avenue", "Virginia Avenue",
    "St. James Place", "Tennessee Avenue", "New York Avenue", "Free Parking", "Kentucky Avenue",
    "Chance", "Indiana Avenue", "Illinois Avenue", "B&O Railroad", "Atlantic Avenue",
    "Ventnor Avenue", "Water Works", "Marvin Gardens", "Go to Jail", "Pacific Avenue",
    "North Carolina Avenue", "Community Chest", "Pennsylvania Avenue", "Short Line",
    "Chance", "Park Place", "Luxury Tax", "Boardwalk"
];


// Extend property details to include houses
const propertyDetails: { [key: string]: { price: number; housePrice: number; houses: number; owner: string | null } } = {
    "Mediterranean Avenue": { price: 60, housePrice: 50, houses: 0, owner: null },
    "Baltic Avenue": { price: 60, housePrice: 50, houses: 0, owner: null },
    "Oriental Avenue": { price: 100, housePrice: 50, houses: 0, owner: null },
    "Vermont Avenue": { price: 100, housePrice: 50, houses: 0, owner: null },
    "Connecticut Avenue": { price: 120, housePrice: 50, houses: 0, owner: null },
    "St. Charles Place": { price: 140, housePrice: 100, houses: 0, owner: null },
    "States Avenue": { price: 140, housePrice: 100, houses: 0, owner: null },
    "Virginia Avenue": { price: 160, housePrice: 100, houses: 0, owner: null },
    "St. James Place": { price: 180, housePrice: 100, houses: 0, owner: null },
    "Tennessee Avenue": { price: 180, housePrice: 100, houses: 0, owner: null },
    "New York Avenue": { price: 200, housePrice: 100, houses: 0, owner: null },
    "Kentucky Avenue": { price: 220, housePrice: 150, houses: 0, owner: null },
    "Indiana Avenue": { price: 220, housePrice: 150, houses: 0, owner: null },
    "Illinois Avenue": { price: 240, housePrice: 150, houses: 0, owner: null },
    "Atlantic Avenue": { price: 260, housePrice: 150, houses: 0, owner: null },
    "Ventnor Avenue": { price: 260, housePrice: 150, houses: 0, owner: null },
    "Marvin Gardens": { price: 280, housePrice: 150, houses: 0, owner: null },
    "Pacific Avenue": { price: 300, housePrice: 200, houses: 0, owner: null },
    "North Carolina Avenue": { price: 300, housePrice: 200, houses: 0, owner: null },
    "Pennsylvania Avenue": { price: 320, housePrice: 200, houses: 0, owner: null },
    "Park Place": { price: 350, housePrice: 200, houses: 0, owner: null },
    "Boardwalk": { price: 400, housePrice: 200, houses: 0, owner: null }
};
// Empty Grid Layout with IDs
const arr: (string | number)[] = new Array(100).fill(0);

// Place streets around the perimeter
const perimeterIndices: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    19, 29, 39, 49, 59, 69, 79, 89,
    98, 97, 96, 95, 94, 93, 92, 91, 90,
    80, 70, 60, 50, 40, 30, 20, 10
];

perimeterIndices.forEach((index, i) => {
    arr[index] = monopolyBoard[i];
});

// Player Details
const players: Player[] = [
    { name: "Player 1", money: 2000, position: 0, properties: [], houses: 0 },
    { name: "Player 2", money: 2000, position: 0, properties: [], houses: 0 }
];

let currentPlayer: number = 0;

// DOM Elements
const gameGrid = document.querySelector(".gameGrid") as HTMLDivElement | null;
const rollDiceButton = document.querySelector("#rollDice") as HTMLButtonElement | null;

if (!gameGrid || !rollDiceButton) {
    throw new Error("Required DOM elements are not available.");
}

// Update the board and player statuses
// Update the board to show houses on properties
function updateBoard(): void {
    if (!gameGrid) return;

    gameGrid.innerHTML = "";
    arr.forEach((cell, index) => {
        const player1Here = index === perimeterIndices[players[0].position];
        const player2Here = index === perimeterIndices[players[1].position];

        let housesDisplay = "";
        if (typeof cell === "string" && propertyDetails[cell]) {
            const property = propertyDetails[cell];
            housesDisplay = property.houses > 0 ? `🏠 x${property.houses}` : "";
        }

        gameGrid.innerHTML += `
            <div class="grid-item" id="cell-${index}">
                ${cell || ""}
                ${housesDisplay}
                ${player1Here ? '<div class="player">😀</div>' : ""}
                ${player2Here ? '<div class="player">😎</div>' : ""}
            </div>
        `;
    });

    // Update Player 1 Status
    const player1Money = document.getElementById("player1Money");
    const player1Properties = document.getElementById("player1Properties");
    const player1Houses = document.getElementById("player1Houses");

    if (player1Money && player1Properties && player1Houses) {
        player1Money.innerText = players[0].money.toString();
        player1Properties.innerText = players[0].properties.join(", ") || "None";
        player1Houses.innerText = players[0].houses.toString();
    }

    // Update Player 2 Status
    const player2Money = document.getElementById("player2Money");
    const player2Properties = document.getElementById("player2Properties");
    const player2Houses = document.getElementById("player2Houses");

    if (player2Money && player2Properties && player2Houses) {
        player2Money.innerText = players[1].money.toString();
        player2Properties.innerText = players[1].properties.join(", ") || "None";
        player2Houses.innerText = players[1].houses.toString();
    }
}

// Add a button for buying houses
const buyHouseButton = document.querySelector("#buyHouse") as HTMLButtonElement | null;
if (buyHouseButton) {
    buyHouseButton.onclick = () => {
        buyHouse();
    };
}

// Initial render
updateBoard();

// Add a function to handle buying houses
function buyHouse(): void {
    const player = players[currentPlayer];
    const currentCell = arr[perimeterIndices[player.position]];

    // Check if the cell is a property and owned by the current player
    if (typeof currentCell === "string" && propertyDetails[currentCell]) {
        const property = propertyDetails[currentCell];

        if (property.owner !== player.name) {
            alert(`You do not own ${currentCell}.`);
        } else if (player.money < property.housePrice) {
            alert(`Not enough money to buy a house for ${currentCell}.`);
        } else if (property.houses >= 4) {
            alert(`${currentCell} already has the maximum number of houses.`);
        } else {
            // Deduct money and add a house
            player.money -= property.housePrice;
            property.houses += 1;
            player.houses += 1;

            alert(`${player.name} bought a house for ${currentCell}.`);
        }
    } else {
        alert("You cannot buy a house on this cell.");
    }

    updateBoard();
}

// Add a function to handle property purchase
function buyProperty(): void {
    const player = players[currentPlayer];
    const currentCell = arr[perimeterIndices[player.position]];

    // Check if the cell is a property
    if (typeof currentCell === "string" && propertyDetails[currentCell]) {
        const property = propertyDetails[currentCell];

        if (property.owner) {
            alert(`This property is already owned by ${property.owner}.`);
        } else if (player.money >= property.price) {
            // Deduct money and assign ownership
            property.owner = player.name;
            player.money -= property.price;
            player.properties.push(currentCell);

            alert(`${player.name} bought ${currentCell} for $${property.price}.`);
        } else {
            alert(`Not enough money to buy ${currentCell}.`);
        }
    } else {
        alert("This cell is not a property you can buy.");
    }

    updateBoard();
}

// Modify rollDiceButton to allow property purchase
rollDiceButton.onclick = () => {
    const roll = Math.ceil(Math.random() * 6);
    const player = players[currentPlayer];
    player.position += roll;

    if (player.position >= perimeterIndices.length) {
        player.position -= perimeterIndices.length;
        player.money += 200; // Passing "GO"
    }

    alert(`${player.name} rolled: ${roll}`);
    const currentCell = arr[perimeterIndices[player.position]];

    if (typeof currentCell === "string" && propertyDetails[currentCell]) {
        const property = propertyDetails[currentCell];
        if (!property.owner) {
            const buyDecision = confirm(`You landed on ${currentCell}. Do you want to buy it for $${property.price}?`);
            if (buyDecision) {
                buyProperty();
            }
        }
    }

    currentPlayer = 1 - currentPlayer; // Switch players
    updateBoard();
};

// Initial render
updateBoard();