import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import emoji from '../../utils/emoji'
import { MotionBox } from '../Styled/Styled'
import socket from '../../utils/socket'
import { getRoomData } from '../../utils/api'
import Lobby from './Lobby/Lobby'
import Game from './Game/Game'
import TooBigDialog from './TooBigDialog/TooBigDialog'
import RepairRoom from './RepairRoom'

const Message = styled(MotionBox)`
  background-color: #e0fff8;
  margin: 1rem 0rem;
  padding: 1rem;
  text-align: center;
`

const Error = styled(MotionBox)`
  background-color: #ffe0e4;
  margin: 1rem 0rem;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
`

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  max-width: 80em;
`

const Room = ({ room, player }) => {
  const history = useHistory()
  const [playerId, setPlayerId] = useState('')
  const [activeGame, setActiveGame] = useState()
  const [players, setPlayers] = useState({})
  const [settings, setSettings] = useState()
  const [error, setError] = useState('')
  const [repairing, setRepairing] = useState(false)

  const playerKicked = (players) => {
    return !Object.keys(players).find(
      (key) => players[key].name === player.name
    )
  }

  useEffect(() => {
    ;(async () => {
      const response = await getRoomData(room.name)
      const data = await response.json()
      if (response.ok) {
        setPlayers(data.room.players)
        setSettings(data.room.settings)
        if (data.room.game) {
          setActiveGame(data.room.game)
        }
        socket.emit(
          'player-joined',
          { roomName: room.name, roomPassword: room.password },
          player
        )
      } else {
        history.push(`/`)
      }
    })()
    socket.on('joined-room', (playerId) => setPlayerId(playerId))
    socket.on('room-disconnected', ({ error }) => {
      ReactGA.event({
        category: 'Room',
        action: 'Error occurred',
        nonInteraction: true,
      })
      console.error(error)
      setError(`An error occurred. Please try that again.`)
      // setTimeout(() => history.push(`/`), 3000)
    })
    socket.on('error-message', (error) => {
      console.error(error)
      setError(error)
    })
    // In game listeners
    socket.on('room-update', ({ players, game, settings }) => {
      if (playerKicked(players)) {
        setError('You have been kicked from the game')
      } else {
        setPlayers(players)
        setActiveGame(game)
        setSettings(settings)
        setError('')
      }
    })
    return () => {
      ReactGA.event({
        category: 'Room',
        action: 'Left room',
        nonInteraction: true,
      })
      socket.emit('player-left', room.name, player)
    }
  }, [room.name, player, history])

  return (
    <>
      <TopBar>
        <TooBigDialog />
      </TopBar>
      {error && <Error>{error}</Error>}
      {room.name && players && settings && !repairing ? (
        activeGame ? (
          <>
            {players[playerId]?.host && (
              <Message
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
              >
                {emoji('👑')} You are the <strong>game host</strong>. You can
                return everyone <strong>back to the lobby</strong> if needed. If
                you leave, a new host will be assigned.
                {emoji('👑')}
              </Message>
            )}
            <Game
              roomName={room.name}
              playerId={playerId}
              players={players}
              activeGame={activeGame}
            />
          </>
        ) : (
          <>
            {players[playerId]?.host && (
              <Message
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
              >
                {emoji('👑')} You are the <strong>game host</strong>. You can{' '}
                <strong>change the game settings</strong> and{' '}
                <strong>start the game</strong>. If you leave, a new host will
                be assigned.{emoji('👑')}
              </Message>
            )}
            <Lobby
              roomName={room.name}
              roomPassword={room.password}
              playerId={playerId}
              players={players}
              settings={settings}
            />
          </>
        )
      ) : (
        <div>Loading room...</div>
      )}
      <RepairRoom
        roomName={room.name}
        players={players}
        settings={settings}
        game={activeGame}
        setRepairing={setRepairing}
      />
    </>
  )
}

export default Room
