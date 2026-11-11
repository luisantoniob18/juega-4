import { useEffect, useMemo, useState } from 'react'
import './App.css'

const ROWS = 6
const COLUMNS = 7
const PLAYER_CONFIG = {
  one: { color: 'red', label: 'ROJO' },
  two: { color: 'yellow', label: 'AMARILLO' },
}
const EMPTY_BOARD = () =>
  Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null))

const savedPlayers = JSON.parse(localStorage.getItem('conecta4-players') || 'null')

function getWinningCells(board, row, column, color) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]

  for (const [rowStep, columnStep] of directions) {
    const cells = [[row, column]]
    for (const sign of [1, -1]) {
      let nextRow = row + rowStep * sign
      let nextColumn = column + columnStep * sign
      while (
        nextRow >= 0 &&
        nextRow < ROWS &&
        nextColumn >= 0 &&
        nextColumn < COLUMNS &&
        board[nextRow][nextColumn] === color
      ) {
        cells.push([nextRow, nextColumn])
        nextRow += rowStep * sign
        nextColumn += columnStep * sign
      }
    }
    if (cells.length >= 4) return cells
  }
  return []
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [players, setPlayers] = useState({
    one: savedPlayers?.one || '',
    two: savedPlayers?.two || '',
  })
  const [currentPlayer, setCurrentPlayer] = useState('one')
  const [startingPlayer, setStartingPlayer] = useState('one')
  const [board, setBoard] = useState(EMPTY_BOARD)
  const [winner, setWinner] = useState(null)
  const [winningCells, setWinningCells] = useState([])
  const [lastMove, setLastMove] = useState(null)
  const [scores, setScores] = useState({ one: 0, two: 0 })
  const [isDraw, setIsDraw] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [editedName, setEditedName] = useState('')

  useEffect(() => {
    localStorage.setItem('conecta4-players', JSON.stringify(players))
  }, [players])

  const activePlayer = PLAYER_CONFIG[currentPlayer]
  const currentColor = activePlayer.color
  const currentName = players[currentPlayer] || `Jugador ${currentPlayer === 'one' ? '1' : '2'}`
  const statusText = winner
    ? `${players[winner]} ha ganado la partida`
    : isDraw
      ? 'El tablero está lleno: ¡empate!'
      : `Turno de ${currentName}`

  const winningCellKeys = useMemo(
    () => new Set(winningCells.map(([row, column]) => `${row}-${column}`)),
    [winningCells],
  )

  function startSetup() {
    setScreen('player-one')
  }

  function goToPlayerTwo() {
    if (players.one.trim()) setScreen('player-two')
  }

  function startGame() {
    if (!players.two.trim()) return
    setBoard(EMPTY_BOARD())
    setWinner(null)
    setWinningCells([])
    setLastMove(null)
    setIsDraw(false)
    setCurrentPlayer(startingPlayer)
    setScreen('game')
  }

  function resetRound() {
    const nextStartingPlayer = startingPlayer === 'one' ? 'two' : 'one'
    setStartingPlayer(nextStartingPlayer)
    setBoard(EMPTY_BOARD())
    setWinner(null)
    setWinningCells([])
    setLastMove(null)
    setIsDraw(false)
    setCurrentPlayer(nextStartingPlayer)
  }

  function resetScore() {
    setScores({ one: 0, two: 0 })
  }

  function beginEditing(player) {
    setEditingPlayer(player)
    setEditedName(players[player])
  }

  function savePlayerName(player) {
    const name = editedName.trim()
    if (name) setPlayers((currentPlayers) => ({ ...currentPlayers, [player]: name }))
    setEditingPlayer(null)
  }

  function dropToken(column) {
    if (winner || isDraw) return
    const row = [...Array(ROWS).keys()].reverse().find((index) => !board[index][column])
    if (row === undefined) return

    const nextBoard = board.map((boardRow) => [...boardRow])
    nextBoard[row][column] = currentColor
    const cells = getWinningCells(nextBoard, row, column, currentColor)
    setBoard(nextBoard)
    setLastMove({ row, column })

    if (cells.length) {
      setWinner(currentPlayer)
      setWinningCells(cells)
      setScores((currentScores) => ({
        ...currentScores,
        [currentPlayer]: currentScores[currentPlayer] + 1,
      }))
      return
    }

    if (nextBoard.every((boardRow) => boardRow.every(Boolean))) {
      setIsDraw(true)
      return
    }
    setCurrentPlayer((player) => (player === 'one' ? 'two' : 'one'))
  }

  function goHome() {
    setScreen('home')
    setBoard(EMPTY_BOARD())
    setWinner(null)
    setWinningCells([])
    setLastMove(null)
    setIsDraw(false)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label="Volver al inicio">
          <span className="brand-mark"><span /><span /><span /><span /></span>
          <span>Conecta<span className="brand-accent">4</span></span>
        </button>
        <span className="topbar-label">JUEGO CLÁSICO · 2 JUGADORES</span>
      </header>

      {screen === 'home' && (
        <section className="screen home-screen">
          <div className="hero-copy">
            <p className="eyebrow">EL TIEMPO NO ALCANZA</p>
            <h1>Cuatro en línea<br />
            <em>Una sola victoria</em></h1>
            <p className="hero-description">
              Desafía a tu rival, conecta cuatro fichas en horizontal, vertical o diagonal y demuestra quién domina el tablero.
            </p>
            <button className="primary-button" onClick={startSetup}>Jugar ahora <span>→</span></button>
          </div>
          <div className="hero-board" aria-hidden="true">
            <div className="hero-board-glow" />
            <div className="mini-board">
              {Array.from({ length: 42 }, (_, index) => (
                <span key={index} className={
                  [37, 38, 39, 40, 32, 33, 34, 25, 26, 27, 18, 19].includes(index)
                    ? index % 3 === 0 ? 'mini-disc red' : 'mini-disc yellow'
                    : 'mini-disc'
                } />
              ))}
            </div>
          </div>
          <div className="feature-row">
            <span><strong>01</strong> Crea tu partida</span>
            <span><strong>02</strong> Elige tu estrategia</span>
            <span><strong>03</strong> Conecta cuatro</span>
          </div>
        </section>
      )}

      {screen === 'player-one' && (
        <section className="screen setup-screen">
          <div className="setup-progress"><span className="active">01</span><i /><span>02</span><i /><span>03</span></div>
          <p className="eyebrow">CONFIGURACIÓN DE PARTIDA</p>
          <h1>¿Quién juega<br /><em>con rojo?</em></h1>
          <p className="screen-description">Introduce el nombre del primer jugador. La ficha roja comienza la primera partida.</p>
          <div className="player-form">
            <div className="color-preview red"><span /></div>
            <label htmlFor="player-one">Nombre del jugador 1</label>
            <input id="player-one" autoFocus maxLength="18" value={players.one} placeholder="Ej. Alex" onChange={(event) => setPlayers({ ...players, one: event.target.value })} onKeyDown={(event) => event.key === 'Enter' && goToPlayerTwo()} />
            <button className="primary-button" disabled={!players.one.trim()} onClick={goToPlayerTwo}>Continuar <span>→</span></button>
          </div>
        </section>
      )}

      {screen === 'player-two' && (
        <section className="screen setup-screen">
          <div className="setup-progress"><span className="complete">✓</span><i className="filled" /><span className="active">02</span><i /><span>03</span></div>
          <p className="eyebrow">CONFIGURACIÓN DE PARTIDA</p>
          <h1>¿Quién juega<br /><em>con amarillo?</em></h1>
          <p className="screen-description">Ahora presenta al segundo jugador. En cada partida el turno inicial se alternará.</p>
          <div className="player-form">
            <div className="color-preview yellow"><span /></div>
            <label htmlFor="player-two">Nombre del jugador 2</label>
            <input id="player-two" autoFocus maxLength="18" value={players.two} placeholder="Ej. Sam" onChange={(event) => setPlayers({ ...players, two: event.target.value })} onKeyDown={(event) => event.key === 'Enter' && startGame()} />
            <div className="form-actions"><button className="secondary-button" onClick={() => setScreen('player-one')}>Atrás</button><button className="primary-button" disabled={!players.two.trim()} onClick={startGame}>Comenzar <span>→</span></button></div>
          </div>
        </section>
      )}

      {screen === 'game' && (
        <section className="screen game-screen">
          <div className="game-heading">
            <div><p className="eyebrow">PARTIDA {startingPlayer === 'one' ? '· ROJO' : '· AMARILLO'} COMIENZA</p><h1>{winner ? '¡Partida terminada!' : isDraw ? 'Tablas' : 'Tu turno'}</h1></div>
            <div className="game-actions"><button className="text-button" onClick={resetRound}>↻ Reiniciar partida</button><button className="text-button danger" onClick={resetScore}>♧ Resetear marcador</button></div>
          </div>
          <div className="turn-status"><span className={`status-dot ${winner || isDraw ? '' : currentColor}`} />{statusText}</div>
          <div className="board-wrap">
            <div className={`player-card side-card ${currentPlayer === 'one' && !winner && !isDraw ? 'turn' : ''}`}>
              <span className="token red" />
              <div className="player-identity">
                {editingPlayer === 'one' ? (
                  <input
                    className="player-name-input"
                    value={editedName}
                    autoFocus
                    maxLength={18}
                    onChange={(event) => setEditedName(event.target.value)}
                    onBlur={() => savePlayerName('one')}
                    onKeyDown={(event) => event.key === 'Enter' && savePlayerName('one')}
                    aria-label="Editar nombre del jugador 1"
                  />
                ) : (
                  <strong>{players.one}</strong>
                )}
                <small>{PLAYER_CONFIG.one.label}</small>
              </div>
              <b>{scores.one}</b>
              <button className="edit-name-button" onClick={() => beginEditing('one')} aria-label="Editar nombre del jugador 1">✎</button>
            </div>
            <div className="board" role="grid" aria-label="Tablero de Conecta 4">
              {board.map((row, rowIndex) => row.map((cell, columnIndex) => {
                const isColumnSelector = rowIndex === 0
                const selectColumn = () => isColumnSelector && dropToken(columnIndex)
                return (
                  <div
                    className={`cell ${isColumnSelector ? 'column-selector' : ''}`}
                    role="gridcell"
                    tabIndex={isColumnSelector ? 0 : undefined}
                    key={`${rowIndex}-${columnIndex}`}
                    onClick={selectColumn}
                    onKeyDown={(event) => {
                      if (isColumnSelector && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault()
                        selectColumn()
                      }
                    }}
                    aria-label={isColumnSelector ? `Soltar ficha en columna ${columnIndex + 1}` : undefined}
                  >
                    <span className={`disc ${cell || ''} ${winningCellKeys.has(`${rowIndex}-${columnIndex}`) ? 'winner-disc' : ''} ${lastMove?.row === rowIndex && lastMove?.column === columnIndex ? 'drop-disc' : ''}`} />
                  </div>
                )
              }))}
            </div>
            <div className={`player-card side-card right ${currentPlayer === 'two' && !winner && !isDraw ? 'turn' : ''}`}>
              <b>{scores.two}</b>
              <div className="player-identity">
                {editingPlayer === 'two' ? (
                  <input
                    className="player-name-input"
                    value={editedName}
                    autoFocus
                    maxLength={18}
                    onChange={(event) => setEditedName(event.target.value)}
                    onBlur={() => savePlayerName('two')}
                    onKeyDown={(event) => event.key === 'Enter' && savePlayerName('two')}
                    aria-label="Editar nombre del jugador 2"
                  />
                ) : (
                  <strong>{players.two}</strong>
                )}
                <small>{PLAYER_CONFIG.two.label}</small>
              </div>
              <span className="token yellow" />
              <button className="edit-name-button" onClick={() => beginEditing('two')} aria-label="Editar nombre del jugador 2">✎</button>
            </div>
          </div>
          {(winner || isDraw) && <div className="result-actions"><button className="primary-button" onClick={resetRound}>Nueva partida <span>→</span></button><button className="secondary-button" onClick={goHome}>Volver al inicio</button></div>}
          <p className="game-hint">Selecciona una columna para dejar caer tu ficha · La ficha siempre cae hasta el último espacio disponible</p>
        </section>
      )}
    </main>
  )
}
