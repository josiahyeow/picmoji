import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { createRoom, roomExists } from '../../utils/api'
import { Box, Input, Button } from '../Styled/Styled'
import EmojiPicker, { getRandomPlayerEmoji } from './EmojiPicker'

const Form = styled.form`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
`
const Label = styled.label`
  font-weight: bold;
`

const Player = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const EnterRoom: React.FC<{ room?: string }> = ({ room }) => {
  const history = useHistory()
  const [playerName, setPlayerName] = useState('')
  const [playerEmoji, setPlayerEmoji] = useState(getRandomPlayerEmoji())
  const [roomName, setRoomName] = useState(room)
  const [error, setError] = useState('')

  const handleSubmit = (action: 'create' | 'join') => {
    if (!playerName || !roomName) {
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
      history.push(`/${roomName}`, { playerName, playerEmoji })
    } else {
      setError(`Could not find room ${roomName}`)
    }
  }

  return (
    <Box>
      <Form>
        {error && <div>{error}</div>}
        <Label htmlFor="playername-input">Player name</Label>
        <Player>
          <EmojiPicker
            playerEmoji={playerEmoji}
            setPlayerEmoji={setPlayerEmoji}
          />
          <Input
            id="playername-input"
            value={playerName}
            placeholder="Enter your name"
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </Player>

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