import React, { useState, useEffect } from 'react'
import { Grid, Left, Middle } from '../Styled/Styled'
import RoomDetails from './RoomDetails'
import PlayerList from './PlayerList'
import GameSettings from './GameSettings/GameSettings'
import { Players } from '../../typings/types'

const categories = [
  'words',
  'movie',
  'tv shows',
  'place',
  'anime',
  'koreaboo',
  'brands',
  'bible books and characters',
]

const Lobby: React.FC<{ room: string; players: Players }> = ({
  room,
  players,
}) => {
  const [settings, updateSettings] = useState({
    scoreLimit: 10,
    selectedCategories: [],
  })
  return (
    <Grid>
      <Left>
        <RoomDetails roomName={room} />
        <GameSettings
          categories={categories}
          settings={settings}
          updateSettings={updateSettings}
        />
      </Left>
      <Middle>
        <PlayerList players={players} />
      </Middle>
    </Grid>
  )
}

export default Lobby
