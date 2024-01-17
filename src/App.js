import { useState, useEffect } from "react";

import blue from "./images/blue-candy.png";
import green from "./images/green-candy.png";
import orange from "./images/orange-candy.png";
import yellow from "./images/yellow-candy.png";
import purple from "./images/purple-candy.png";
import red from "./images/red-candy.png";
import white from "./images/blank.png";

const App = () => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0)

  const candyColors = [blue, green, orange, yellow, purple, red];
  const blank = white;
  const width = 8;

  const createBoard = () => {
    let randomColors = [];

    for (let i = 0; i < 64; i++) {
      let randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColors.push(randomColor);
    }
    setSelectedColors(randomColors);
  };

  const checkForColumnsOfThree = () => {
    for (let i = 0; i < 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const chosenColor = selectedColors[i];
      if (
        columnOfThree.every(
          (colorIndex) => selectedColors[colorIndex] === chosenColor
        )
      ) {
        if (chosenColor !== blank) {
          setScore((prevScore) => prevScore + 3);
          setMoves((prevMoves) => prevMoves + 1)
        }
        columnOfThree.forEach(
          (colorIndex) => (selectedColors[colorIndex] = blank)
        );
        return true;
      }
    }
  };

  const checkForColumnsOfFour = () => {
    for (let i = 0; i < 47; i++) {
      const chosenColor = selectedColors[i];
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      if (
        columnOfFour.every(
          (colorIndex) => selectedColors[colorIndex] === chosenColor
        )
      ) {
        if (chosenColor !== blank) {
          setScore((prevScore) => prevScore + 4);
          setMoves((prevMoves) => prevMoves + 1)
        }
        columnOfFour.forEach(
          (colorIndex) => (selectedColors[colorIndex] = blank)
        );
        return true;
      }
    }
  };

  const checkForRowsOfThree = () => {
    const notValid = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];
    for (let i = 0; i < 64; i++) {
      const chosenColor = selectedColors[i];
      if (notValid.includes(i)) continue;
      const rowOfThree = [i, i + 1, i + 2];
      if (
        rowOfThree.every(
          (colorIndex) => selectedColors[colorIndex] === chosenColor
        )
      ) {
        if (chosenColor !== blank) {
          setScore((prevScore) => prevScore + 3);
          setMoves((prevMoves) => prevMoves + 1)
        }
        rowOfThree.forEach(
          (colorIndex) => (selectedColors[colorIndex] = blank)
        );
        return true;
      }
    }
  };

  const checkForRowsOfFour = () => {
    const notValid = [
      5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
      54, 55, 61, 62, 63,
    ];
    for (let i = 0; i < 64; i++) {
      const chosenColor = selectedColors[i];
      if (notValid.includes(i)) continue;
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      if (
        rowOfFour.every(
          (colorIndex) => selectedColors[colorIndex] === chosenColor
        )
      ) {
        if (chosenColor !== blank) {
          setScore((prevScore) => prevScore + 4);
          setMoves((prevMoves) => prevMoves + 1)
        }
        rowOfFour.forEach((colorIndex) => (selectedColors[colorIndex] = blank));
      }
      return true;
    }
  };

  const moveIntoSquareBelow = () => {
    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let i = 0; i < 64; i++) {
      const chosenColor = selectedColors[i];
      if (firstRow.includes(i) && chosenColor === blank) {
        let randomColor =
          candyColors[Math.floor(Math.random() * candyColors.length)];
        selectedColors[i] = randomColor;
      } else if (selectedColors[i + width] === blank) {
        selectedColors[i + width] = selectedColors[i];
        selectedColors[i] = blank;
      }
    }
  };

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };

  let squareBeingDraggedId;
  let squareBeingReplacedId;

  const dragEnd = (e) => {
    squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute("data-id"));
    squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );

    selectedColors[squareBeingReplacedId] =
      squareBeingDragged.getAttribute("src");
    selectedColors[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute("src");

    const validMove = [
      squareBeingDraggedId + 1,
      squareBeingDraggedId - 1,
      squareBeingDraggedId + width,
      squareBeingDraggedId - width,
    ];
    const isValid = validMove.includes(squareBeingReplacedId);

    if (
      (isValid && checkForRowsOfFour()) ||
      (isValid && checkForColumnsOfFour()) ||
      (isValid && checkForColumnsOfThree()) ||
      (isValid && checkForRowsOfThree())
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      selectedColors[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute("src");
      selectedColors[squareBeingDraggedId] =
        squareBeingDragged.getAttribute("src");
    }
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForRowsOfFour();
      checkForColumnsOfFour();
      checkForRowsOfThree();
      checkForColumnsOfThree();
      moveIntoSquareBelow();
      setSelectedColors([...selectedColors]);
    }, 500);
    return () => clearInterval(timer);
  }, [selectedColors]);

  return (
    <div className="bluewrapper">
      <div className="gamewrapper">
        <div className="game">
          <div className="gameboard">
            {selectedColors.map((selectedColor, index) => (
              <img
                draggable={true}
                data-id={index}
                onDragStart={dragStart}
                onDrop={dragDrop}
                onDragEnd={dragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrahEnter={(e) => e.preventDefault()}
                onDragCapture={(e) => e.preventDefault()}
                key={index}
                alt={selectedColor}
                src={selectedColor}
              />
            ))}
          </div>
        </div>
        <div className="scoreboard">
          <div className="scoretitlewrapper">Candy Crush</div>
          <div className="scorewrapper">{score}</div>
          <div className="moveswrapper">
            <div className="movestoptext">Moves</div>
            <div className="movesbottomtext">{moves}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;