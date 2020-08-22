import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import socket from '../../utils/socket'
import { getRoomData } from '../../utils/api'
import Lobby from './Lobby/Lobby'
import Game from './Game/Game'

const Room = ({ roomName, player }) => {
  const history = useHistory()
  const [activeGame, setActiveGame] = useState(false)
  const [name, setName] = useState()
  const [players, setPlayers] = useState({})
  const [settings, setSettings] = useState()
  useEffect(() => {
    ;(async () => {
      const response = await getRoomData(roomName)
      const data = await response.json()
      if (response.ok) {
        setName(data.room.name)
        setPlayers(data.room.players)
        setSettings(data.room.settings)
        if (data.room.game) {
          setActiveGame(data.room.game)
        }
        socket.emit('new-player', roomName, player)
      } else {
        history.push(`/`)
      }
    })()
    // In game listeners
    socket.on('room-update', ({ players, game, settings }) => {
      setPlayers(players)
      setActiveGame(game)
      setSettings(settings)
    })
    return () => {
      socket.emit('player-left', roomName, player)
    }
  }, [roomName, player])

  return name && players && settings ? (
    activeGame ? (
      <Game roomName={name} players={players} activeGame={activeGame} />
    ) : (
      <Lobby roomName={name} players={players} settings={settings} />
    )
  ) : (
    <div>Loading room...</div>
  )
}

export default Room
