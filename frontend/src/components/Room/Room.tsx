import React, { useState, useEffect } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { getRoomData } from '../../utils/api'
import socket from '../../utils/socket'

const Lobby: React.FC<{ player: string; players: {}; room: string }> = ({
  player,
  players,
  room,
}) => {
  return (
    <div>
      {player}
      {room}
      {JSON.stringify(players)}
    </div>
  )
}

const Room = (props: any) => {
  const { room } = useParams()
  const [player, setPlayer] = useState(props.location?.state?.player)
  const [players, setPlayers] = useState([])
  useEffect(() => {
    ;(async () => {
      const response = await getRoomData(room)
      const playerData = await response.json()
      if (response.ok) {
        setPlayers(playerData)
      } else {
        setPlayer(undefined)
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
      socket.close()
    }
  }, [])

  if (!player) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { room },
        }}
      />
    )
  } else {
    return <Lobby player={player} players={players} room={room} />
  }
}

export default Room
