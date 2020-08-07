import React, { useState, useEffect } from 'react'
import socket from '../../utils/socket'
import { Grid, Left, Middle } from '../Styled/Styled'
import RoomDetails from './RoomDetails'
import PlayerList from './PlayerList'
import GameSettings from './GameSettings/GameSettings'
import { Players } from '../../typings/types'

const Lobby: React.FC<{ room: string; players: Players }> = ({
  room,
  players,
}) => {
  const [scoreLimit, setScoreLimit] = useState(10)
  const [categories, setCategories] = useState({
    words: { name: 'Words', include: true },
    movies: { name: 'Movies', include: false },
    tv: { name: 'TV Shows', include: false },
    places: { name: 'Places', include: false },
    anime: { name: 'Anime', include: false },
    koreaboo: { name: 'Koreaboo', include: false },
    brands: { name: 'Brands', include: false },
  })

  useEffect(() => {
    socket.on('setting-updated', (setting, value) => {
      if (setting === 'scoreLimit') setScoreLimit(value)
      if (setting === 'categories') setCategories(value)
    })
  }, [])

  const updateScoreLimit = (newScoreLimit) => {
    setScoreLimit(newScoreLimit)
    socket.emit('update-setting', room, 'scoreLimit', newScoreLimit)
  }

  const updateCategories = (updatedCategories) => {
    setCategories(updatedCategories)
    socket.emit('update-setting', room, 'categories', updatedCategories)
  }

  return (
    <Grid>
      <Left>
        <RoomDetails roomName={room} />
        <GameSettings
          scoreLimit={scoreLimit}
          updateScoreLimit={updateScoreLimit}
          categories={categories}
          updateCategories={updateCategories}
        />
      </Left>
      <Middle>
        <PlayerList players={players} />
      </Middle>
    </Grid>
  )
}

export default Lobby
