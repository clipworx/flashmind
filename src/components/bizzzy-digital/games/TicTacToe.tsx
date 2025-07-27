import { useState, useEffect } from "react"

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(false) // O goes first
  const [winner, setWinner] = useState<"X" | "O" | null>(null)
  const [xMoves, setXMoves] = useState<number[]>([])
  const [oMoves, setOMoves] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (!gameStarted || winner) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setWinner(isXNext ? "O" : "X")
          return 0
        }
        return parseFloat((prev - 0.1).toFixed(1))
      })
    }, 100)

    return () => clearInterval(timer)
  }, [gameStarted, winner, isXNext])

  const handleClick = (index: number) => {
    if (!gameStarted || board[index] || winner) return

    const newBoard = [...board]
    const currentPlayer = isXNext ? "X" : "O"
    let newXMoves = [...xMoves]
    let newOMoves = [...oMoves]

    if (isXNext) {
      if (newXMoves.length === 3) {
        newBoard[newXMoves[0]] = null
        newXMoves.shift()
      }
      newXMoves.push(index)
    } else {
      if (newOMoves.length === 3) {
        newBoard[newOMoves[0]] = null
        newOMoves.shift()
      }
      newOMoves.push(index)
    }

    newBoard[index] = currentPlayer

    setBoard(newBoard)
    setXMoves(newXMoves)
    setOMoves(newOMoves)
    setIsXNext(!isXNext)

    checkWinner(newBoard)
  }

  const checkWinner = (board: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let line of lines) {
      const [a, b, c] = line
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a] as "X" | "O")
        return
      }
    }
  }

  const handleStart = () => {
    setGameStarted(true)
    setTimeLeft(15)
  }

  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setIsXNext(false)
    setXMoves([])
    setOMoves([])
    setTimeLeft(15)
    setGameStarted(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>

      {!gameStarted ? (
        <button
          onClick={handleStart}
          className="p-3 bg-green-500 hover:bg-green-700 text-white rounded text-lg"
        >
          Start Game
        </button>
      ) : (
        <>
          <div className="text-2xl mb-4">
            Time Left:{" "}
            <span className="font-bold">
              {timeLeft.toFixed(1)}s
            </span>
          </div>

          <p className="text-xl mb-4">
            Turn:{" "}
            <span style={{ color: isXNext ? "red" : "blue" }}>
              {isXNext ? "X" : "O"}
            </span>
          </p>

          <div className="grid grid-cols-3 gap-0">
            {board.map((value, index) => {
              let borderRadius = "0"
              if (index === 0) borderRadius = "15px 0 0 0"
              if (index === 2) borderRadius = "0 15px 0 0"
              if (index === 6) borderRadius = "0 0 0 15px"
              if (index === 8) borderRadius = "0 0 15px 0"

              return (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className="w-28 h-28 border-4 border-white flex items-center justify-center text-6xl font-bold"
                  style={{
                    color: value === "X" ? "red" : value === "O" ? "blue" : "white",
                    borderRadius: borderRadius,
                    borderTop: index < 3 ? "none" : "4px solid white",
                    borderBottom: index > 5 ? "none" : "4px solid white",
                    borderLeft: index % 3 === 0 ? "none" : "4px solid white",
                    borderRight: index % 3 === 2 ? "none" : "4px solid white",
                  }}
                >
                  {value}
                </button>
              )
            })}
          </div>

          {winner && (
            <div className="mt-6">
              <p className="text-2xl">
                Winner:{" "}
                <span style={{ color: winner === "X" ? "red" : "blue" }}>
                  {winner}
                </span>
              </p>

              <button
                onClick={handleReset}
                className="mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
              >
                Restart Game
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}


