import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import socket from '../../../utils/socket'
import { SERVER_URL } from '../../../config/config'
import { createRoom, roomExists } from '../../../utils/api'

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
`

const EnterRoom: React.FC<{ room?: string }> = ({ room }) => {
  const history = useHistory()
  const [player, setPlayer] = useState('')
  const [roomName, setRoomName] = useState(room)
  const [error, setError] = useState('')

  const handleCreateRoom = async () => {
    const response = await createRoom(roomName as string)
    if (response.ok) {
      handleJoinRoom(true)
    } else {
      setError(`Room ${roomName} already exists. Please choose another name.`)
    }
  }

  const handleJoinRoom = async (checkIfExist: boolean = true) => {
    let response
    if (checkIfExist) {
      response = await roomExists(roomName as string)
    } else {
      response = { ok: true }
    }
    console.log(response.body)
    if (response.ok) {
      socket.emit('new-player', roomName, player)
      history.push(`/${roomName}`, { player })
    } else {
      setError(`Could not find room ${roomName}`)
    }
  }

  return (
    <Container>
      {error && <div>{error}</div>}
      <input
        id="player"
        value={player}
        onChange={(event) => setPlayer(event.target.value)}
      ></input>
      <input
        id="roomName"
        value={roomName}
        onChange={(event) => setRoomName(event.target.value)}
      ></input>
      {!room && (
        <button
          id="create-room-button"
          type="button"
          onClick={() => handleCreateRoom()}
        >
          Create Room
        </button>
      )}
      <button
        id="join-room-button"
        type="button"
        onClick={() => handleJoinRoom()}
      >
        Join Room
      </button>
    </Container>
  )
}

export default EnterRoom
