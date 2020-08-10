import React, { useState, useEffect } from 'react'
import socket from '../../../utils/socket'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import GameSettings from '../GameSettings/GameSettings'
import ReadyStartButtons from '../ReadyStartButtons/ReadyStartButtons'
import Chat from '../Chat/Chat'

const Lobby = ({ roomName, players, settings, setGameActive }) => {
  const [scoreLimit, setScoreLimit] = useState(settings.scoreLimit)
  const [categories, setCategories] = useState(settings.selectedCategories)

  useEffect(() => {
    socket.on('setting-updated', (setting, value) => {
      if (setting === 'scoreLimit') setScoreLimit(value)
      if (setting === 'categories') setCategories(value)
    })
    socket.on('game-started', () => setGameActive(true))
  }, [])

  const updateScoreLimit = (newScoreLimit) => {
    setScoreLimit(newScoreLimit)
    socket.emit('update-setting', roomName, 'scoreLimit', newScoreLimit)
  }

  const updateCategories = (updatedCategories) => {
    setCategories(updatedCategories)
    socket.emit('update-setting', roomName, 'categories', updatedCategories)
  }

  const startGame = () => {
    socket.emit('start-game', roomName)
    setGameActive(true)
  }

  return (
    <Grid>
      <Left>
        <RoomDetails roomName={roomName} />
        <GameSettings
          scoreLimit={scoreLimit}
          updateScoreLimit={updateScoreLimit}
          categories={categories}
          updateCategories={updateCategories}
        />
        <ReadyStartButtons startGame={startGame} />
      </Left>
      <Middle>
        <PlayerList players={players} />
        <Chat roomName={roomName} />
      </Middle>
    </Grid>
  )
}

export default Lobby
