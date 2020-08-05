import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { createRoom, roomExists } from '../../../utils/api'
import { Box } from '../../Styled/Styled'

const Form = styled.form`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
`
const Label = styled.label`
  font-weight: bold;
`

const Input = styled.input`
  padding: 1rem;
  border-radius: 6px;
  border: none;
`

const Button = styled.button`
  padding: 1rem;
  border-radius: 6px;
  border: none;
  background: black;
  font-weight: bold;
  color: white;
`

const EnterRoom: React.FC<{ room?: string }> = ({ room }) => {
  const history = useHistory()
  const [player, setPlayer] = useState('')
  const [roomName, setRoomName] = useState(room)
  const [error, setError] = useState('')

  const handleSubmit = (action: 'create' | 'join') => {
    if (!player || !roomName) {
      setError('Please enter both your player and room name')
    } else {
      if (action === 'create') handleCreateRoom()
      if (action === 'join') handleJoinRoom()
    }
  }

  const handleCreateRoom = async () => {
    const response = await createRoom(roomName as string)
    if (response.ok) {
      handleJoinRoom(false)
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
    if (response.ok) {
      history.push(`/${roomName}`, { player })
    } else {
      setError(`Could not find room ${roomName}`)
    }
  }

  return (
    <Box>
      <Form>
        {error && <div>{error}</div>}
        <Label htmlFor="playername-input">Player name</Label>
        <Input
          id="playername-input"
          value={player}
          placeholder="Enter your name"
          onChange={(event) => setPlayer(event.target.value)}
        ></Input>
        <Label htmlFor="roomname-input">Room name</Label>
        <Input
          id="roomname-input"
          value={roomName}
          placeholder="Enter room name"
          onChange={(event) => setRoomName(event.target.value)}
        ></Input>
        {!room && (
          <Button
            id="create-room-button"
            type="button"
            onClick={() => handleSubmit('create')}
          >
            Create Room
          </Button>
        )}
        <Button
          id="join-room-button"
          type="button"
          onClick={() => handleSubmit('join')}
        >
          Join Room
        </Button>
      </Form>
    </Box>
  )
}

export default EnterRoom
