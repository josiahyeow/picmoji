import React, { useEffect } from 'react'
import socket from '../../utils/socket'

const RepairRoom = ({
  roomName,
  players,
  settings,
  game = undefined,
  setRepairing,
}) => {
  // useEffect(() => {
  //   socket.on('room-disconnected', ({ error }) => {
  //     socket.emit('repair-room', {
  //       name: roomName,
  //       players,
  //       settings,
  //       game,
  //     })
  //     setRepairing(true)
  //   })
  //   socket.on('room-repaired', () => {
  //     setRepairing(false)
  //   })
  // }, [players])
  return <></>
}

export default RepairRoom
