import React, { useState, useEffect } from 'react'
import socket from '../../utils/socket'
import { getRoomData } from '../../utils/api'
import { Player } from '../../typings/types'
import Lobby from './Lobby/Lobby'
import Game from './Game/Game'

const Room: React.FC<{ room: string; player: Player }> = ({ room, player }) => {
  const [gameActive, setGameActive] = useState(false)
  const [players, setPlayers] = useState({})
  useEffect(() => {
    ;(async () => {
      const response = await getRoomData(room)
      const data = await response.json()
      if (response.ok) {
        setPlayers(data.room.players)
        socket.emit('new-player', room, player)
      }
    })()
    socket.on('player-joined', (newPlayer: string, allPlayers: []) => {
      console.log(`${newPlayer} joined`)
      setPlayers(allPlayers)
    })
    socket.on('player-left', (oldPlayer: string, allPlayers: []) => {
      console.log(`${oldPlayer} left`)
      setPlayers(allPlayers)
    })
    return () => {
      socket.emit('player-left', room, player)
      socket.disconnect()
    }
  }, [room, player])

  return gameActive ? (
    <Game room={room} players={players} />
  ) : (
    <Lobby room={room} players={players} setGameActive={setGameActive} />
  )
}

export default Room
