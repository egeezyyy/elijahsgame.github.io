document.addEventListener("DOMContentLoaded", function () {
    const mainBoard = document.getElementById("main-chessboard");
    let selectedPawn = null;

    function createBoard() {
        setupBoard(mainBoard, 8, 5); // Main board
        initializePawns();
    }

    function setupBoard(board, rows, cols) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement("div");
                cell.className = "cell " + ((row + col) % 2 === 0 ? "white" : "black");
                cell.id = `${board.id}-cell-${row}-${col}`;
                cell.addEventListener("click", cellClicked);
                board.appendChild(cell);
            }
        }
    }

    function initializePawns() {
        placePawn(0, 0, 'blue', 'sword', true);
        placePawn(0, 1, 'blue', 'mace', true);
        placePawn(0, 2, 'none', 'bow', false);
        placePawn(0, 3, 'none', 'wand', false);
        placePawn(0, 4, 'none', 'spear', false);
        placePawn(7, 0, 'blue', 'sword', true);
        placePawn(7, 1, 'blue', 'mace', true);
        placePawn(7, 2, 'none', 'bow', false);
        placePawn(7, 3, 'none', 'wand', false);
        placePawn(7, 4, 'none', 'spear', false);
    }

    function placePawn(row, col, background, weapon, hasShield) {
        const cell = mainBoard.querySelector(`.cell:nth-child(${col + 1 + row * 5})`);
        const pawn = document.createElement("div");
        pawn.className = `pawn ${background}`;
        pawn.dataset.weapon = weapon;
        pawn.dataset.hasShield = hasShield ? "true" : "false";
        pawn.textContent = weaponIcon(weapon);
        pawn.addEventListener("click", function (event) {
            event.stopPropagation();
            pawnClicked(event.currentTarget);
        });
        cell.appendChild(pawn);
    }

    function weaponIcon(weapon) {
        switch (weapon) {
            case 'sword': return '🗡️';
            case 'spear': return '🔱';
            case 'mace': return '🔨';
            case 'bow': return '🏹';
            case 'wand': return '🪄';
            default: return '';
        }
    }

    function pawnClicked(pawn) {
        if (selectedPawn === pawn) {
            clearHighlights();
            selectedPawn.classList.remove("selected");
            selectedPawn = null;
        } else {
            if (selectedPawn) {
                selectedPawn.classList.remove("selected");
                clearHighlights();
            }
            selectedPawn = pawn;
            pawn.classList.add("selected");
            highlightMoves(pawn);
        }
    }

    function cellClicked(event) {
        const cell = event.currentTarget;
        if (selectedPawn && !cell.firstChild) {
            tryMoveOrAttack(selectedPawn, cell);
            clearHighlights();
        }
    }

    function tryMoveOrAttack(pawn, targetCell) {
        if (targetCell.classList.contains("highlight-green")) {
            // Move pawn
            targetCell.appendChild(pawn);
            pawn.classList.remove("selected");
            selectedPawn = null;
            clearHighlights();
        } else if (targetCell.classList.contains("highlight-red") && targetCell.firstChild) {
            // Attack
            targetCell.removeChild(targetCell.firstChild);
            targetCell.appendChild(pawn);
            pawn.classList.remove("selected");
            selectedPawn = null;
            clearHighlights();
        }
    }

    function highlightMoves(pawn) {
        const weapon = pawn.dataset.weapon;
        const range = getAttackRange(weapon);
        const rows = mainBoard.children.length / 5;
        const cols = 5;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = mainBoard.querySelector(`.cell:nth-child(${col + 1 + row * 5})`);
                const dist = Math.max(Math.abs(row - parseInt(pawn.parentNode.id.split('-')[3])), Math.abs(col - parseInt(pawn.parentNode.id.split('-')[4])));
                if (dist <= range && !cell.firstChild) {
                    cell.classList.add("highlight-green");
                } else if (dist <= range && cell.firstChild && cell !== pawn.parentNode) {
                    cell.classList.add("highlight-red");
                }
            }
        }
    }

    function getAttackRange(weapon) {
        switch (weapon) {
            case 'sword': return 1;
            case 'spear': return 2;
            case 'mace': return 1;
            case 'bow': return 4;
            case 'wand': return 3;
            default: return 0;
        }
    }

    function clearHighlights() {
        document.querySelectorAll(".highlight-green, .highlight-red").forEach(cell => {
            cell.classList.remove("highlight-green");
            cell.classList.remove("highlight-red");
        });
    }

    createBoard();
});
