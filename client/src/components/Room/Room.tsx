import React, { useState, useEffect } from 'react'
import socket from '../../utils/socket'
import { getRoomData } from '../../utils/api'
import Lobby from './Lobby/Lobby'
import Game from './Game/Game'

const Room = ({ roomName, player }) => {
  const [gameActive, setGameActive] = useState(false)
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
        console.log(data.room.settings.selectedCategories)
        socket.emit('new-player', roomName, player)
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
    socket.on('player-disconnected', (allPlayers: []) => {
      console.log(allPlayers)
      setPlayers(allPlayers)
    })
    return () => {
      socket.emit('player-left', roomName, player)
      socket.disconnect()
    }
  }, [roomName, player])

  return name && players && settings ? (
    gameActive ? (
      <Game roomName={name} players={players} />
    ) : (
      <Lobby
        roomName={name}
        players={players}
        settings={settings}
        setGameActive={setGameActive}
      />
    )
  ) : (
    <div>Loading room...</div>
  )
}

export default Room
