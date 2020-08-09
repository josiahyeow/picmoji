import React, { useState, useEffect } from 'react'
import socket from '../../../utils/socket'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import GameSettings from '../GameSettings/GameSettings'
import ReadyStartButtons from '../ReadyStartButtons/ReadyStartButtons'
import { Players } from '../../../typings/types'

const Lobby: React.FC<{
  room: string
  players: Players
  setGameActive: any
}> = ({ room, players, setGameActive }) => {
  const [scoreLimit, setScoreLimit] = useState(10)
  const [categories, setCategories] = useState({
    words: { name: 'Words', icon: '💬', include: true },
    movies: { name: 'Movies', icon: '🍿', include: false },
    tv: { name: 'TV Shows', icon: '📺', include: false },
    places: { name: 'Places', icon: '✈️', include: false },
    anime: { name: 'Anime', icon: '🇯🇵', include: false },
    koreaboo: { name: 'Koreaboo', icon: '🇰🇷', include: false },
    brands: { name: 'Brands', icon: '🛍', include: false },
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
        <ReadyStartButtons setGameActive={setGameActive} />
      </Left>
      <Middle>
        <PlayerList players={players} />
      </Middle>
    </Grid>
  )
}

export default Lobby
