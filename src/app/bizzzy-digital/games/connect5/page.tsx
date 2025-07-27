import { useState, useEffect } from "react"

const boardSize: number = 10
const winCondition: number = 5
const totalTime: number = 15000 // 15 seconds per player

export default function Connect5 () {
  const [board, setBoard] = useState<(string | null)[]>(
    Array(boardSize * boardSize).fill(null)
  )

  const [isXNext, setIsXNext] = useState<boolean>(false) // O starts first
  const [winner, setWinner] = useState<string | null>(null)
  const [winningCells, setWinningCells] = useState<number[]>([])

  const [xTime, setXTime] = useState<number>(totalTime)
  const [oTime, setOTime] = useState<number>(totalTime)
  const [gameStarted, setGameStarted] = useState<boolean>(false)

  useEffect(() => {
    if (!gameStarted || winner) return

    const timer = setInterval(() => {
      setIsXNext((prev) => {
        if (prev) {
          setXTime((prevTime) => {
            const nextTime = Math.max(prevTime - 10, 0)
            if (nextTime <= 0) setWinner("O")
            return nextTime
          })
        } else {
          setOTime((prevTime) => {
            const nextTime = Math.max(prevTime - 10, 0)
            if (nextTime <= 0) setWinner("X")
            return nextTime
          })
        }

        return prev
      })
    }, 10)

    return () => clearInterval(timer)
  }, [isXNext, winner, gameStarted])

  const formatTime = (time: number, player: string) => {
    const seconds = Math.floor(time / 1000)
    const milliseconds = (time % 1000).toString().padStart(3, "0")
    const isWinningPlayer = winner === player

    return (
      <span
        style={{
          color: isWinningPlayer ? "green" : "white",
          fontWeight: isWinningPlayer ? "bold" : "normal",
        }}
      >
        {seconds}.{milliseconds}s
      </span>
    )
  }

  const handleClick = (index: number) => {
    if (!gameStarted || board[index] || winner) return

    const newBoard = [...board]
    const currentPlayer = isXNext ? "X" : "O"

    newBoard[index] = currentPlayer
    setBoard(newBoard)
    setIsXNext(!isXNext)

    checkWinner(newBoard, index, currentPlayer)
  }

  const checkWinner = (newBoard: (string | null)[], index: number, player: string) => {
    const directions = [
      [1, -1], // Horizontal
      [boardSize, -boardSize], // Vertical
      [boardSize + 1, -(boardSize + 1)], // Diagonal (\)
      [boardSize - 1, -(boardSize - 1)], // Diagonal (/)
    ]

    for (const [step, negStep] of directions) {
      let cells = [index]

      cells = cells.concat(findCellsInDirection(newBoard, index, player, step))
      cells = cells.concat(findCellsInDirection(newBoard, index, player, negStep))

      if (cells.length >= winCondition) {
        setWinner(player)
        setWinningCells(cells)
        return
      }
    }
  }

  const findCellsInDirection = (
    board: (string | null)[],
    index: number,
    player: string,
    step: number
  ): number[] => {
    const cells: number[] = []
    let i = index + step

    while (i >= 0 && i < board.length && board[i] === player) {
      if (Math.abs((i % boardSize) - (index % boardSize)) > winCondition) break
      cells.push(i)
      i += step
    }

    return cells
  }

  const handleStart = () => {
    setGameStarted(true)
  }

  const handleReset = () => {
    setBoard(Array(boardSize * boardSize).fill(null))
    setWinner(null)
    setWinningCells([])
    setIsXNext(false)
    setXTime(totalTime)
    setOTime(totalTime)
    setGameStarted(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Connect 5</h1>

      <p className="text-2xl mb-2 text-center">
        Turn:{" "}
        <span style={{ color: isXNext ? "red" : "blue" }}>
          {isXNext ? "X" : "O"}
        </span>
      </p>

      <p className="text-xl mb-4 text-center">
        X Time: {formatTime(xTime, "X")} | O Time: {formatTime(oTime, "O")}
      </p>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          maxWidth: "100vw",
          overflowX: "auto",
        }}
      >
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-10 h-10 border border-white flex items-center justify-center text-xl font-bold sm:w-12 sm:h-12 sm:text-2xl"
            style={{
              color:
                value === "X"
                  ? "red"
                  : value === "O"
                  ? "blue"
                  : "white",
              backgroundColor: winningCells.includes(index)
                ? "green"
                : "transparent",
              transition: "background-color 0.3s ease-in-out",
            }}
          >
            {value}
          </button>
        ))}
      </div>

      <button
        onClick={gameStarted ? handleReset : handleStart}
        className={`mt-6 p-3 rounded text-lg ${
          gameStarted && !winner
            ? "bg-gray-500"
            : "bg-blue-500 hover:bg-blue-700 text-white"
        }`}
        disabled={gameStarted && !winner}
      >
        {gameStarted ? "Restart Game" : "Start Game"}
      </button>
    </div>
  )
}


