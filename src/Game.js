import React, { useState } from "react";
import GameGrid from "./GameGrid.js";

function Game() {
   const [moves, setMoves] = useState(new Array(9).fill(""));
   const [turn, setTurn] = useState("X");
   const [isGameOver, setIsGameOver] = useState(false);
   const [winner, setWinner] = useState(null);

   function checkWinner(moves) {
      const winningCombos = [
         [0, 1, 2],
         [3, 4, 5],
         [6, 7, 8],
         [0, 3, 6],
         [1, 4, 7],
         [2, 5, 8],
         [0, 4, 8],
         [2, 4, 6],
      ];
      for (const [a, b, c] of winningCombos) {
         if (moves[a] && moves[a] === moves[b] && moves[a] === moves[c]) {
            return moves[a];
         }
      }
      return null;
   }

   function computerMove(movesCopy) {
      // Check for a winning move
      for (let i = 0; i < 9; i++) {
         if (movesCopy[i] === "") {
            movesCopy[i] = "O";
            if (checkWinner(movesCopy) === "O") return i;
            movesCopy[i] = ""; // Undo the move
         }
      }

      // Check for a blocking move
      for (let i = 0; i < 9; i++) {
         if (movesCopy[i] === "") {
            movesCopy[i] = "X";
            if (checkWinner(movesCopy) === "X") {
               movesCopy[i] = ""; // Undo the move
               return i;
            }
            movesCopy[i] = ""; // Undo the move
         }
      }

      // Make a random move
      const emptySpots = movesCopy
         .map((val, idx) => (val === "" ? idx : null))
         .filter((val) => val !== null);
      return emptySpots[Math.floor(Math.random() * emptySpots.length)];
   }

   function gridClick(whichSquare) {
      if (isGameOver || moves[whichSquare] !== "") return;

      const movesCopy = [...moves];
      movesCopy[whichSquare] = turn;
      setMoves(movesCopy);

      const currentWinner = checkWinner(movesCopy);
      if (currentWinner) {
         setWinner(currentWinner);
         setIsGameOver(true);
         return;
      }

      if (!movesCopy.includes("")) {
         setWinner("Tie");
         setIsGameOver(true);
         return;
      }

      // Alternate turn
      if (turn === "X") {
         setTurn("O");

         // Computer's turn
         setTimeout(() => {
            const computerMoveIndex = computerMove(movesCopy);
            if (computerMoveIndex !== undefined) {
               movesCopy[computerMoveIndex] = "O";
               setMoves(movesCopy);

               const computerWinner = checkWinner(movesCopy);
               if (computerWinner) {
                  setWinner(computerWinner);
                  setIsGameOver(true);
               } else if (!movesCopy.includes("")) {
                  setWinner("Tie");
                  setIsGameOver(true);
               }

               setTurn("X");
            }
         }, 500); // Delay for a more natural computer move
      }
   }

   function newGame() {
      setMoves(new Array(9).fill(""));
      setTurn("X");
      setIsGameOver(false);
      setWinner(null);
   }

   return (
      <>
         <h1>Tic-Tac-Toe</h1>
         <GameGrid moves={moves} click={gridClick} />
         <p>
            {isGameOver ? (
               winner === "Tie" ? (
                  <strong>It's a Tie!</strong>
               ) : (
                  <strong>Player {winner} Wins!</strong>
               )
            ) : (
               <>Turn: <strong className={turn}>{turn}</strong></>
            )}
         </p>
         <p>
            <button onClick={newGame}>New Game</button>
         </p>
      </>
   );
}

export default Game;
