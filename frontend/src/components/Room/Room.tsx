import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import { getRoomData } from '../../utils/api'
import Lobby from './Lobby'
import { SERVER_URL } from '../../config/config'

let socket

const Room: React.FC<{ room: string; player: string }> = ({ room, player }) => {
  const [players, setPlayers] = useState({})
  useEffect(() => {
    socket = socketIOClient(SERVER_URL)
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
    // return () => {
    //   socket.close()
    // }
  }, [room, player])

  return <Lobby room={room} players={players} />
}

export default Room
