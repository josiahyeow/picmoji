import React, { useState, useEffect } from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import { Players } from '../../../typings/types'
import EmojiSet from '../EmojiSet/EmojiSet'

const Game: React.FC<{ room: string; players: Players }> = ({
  room,
  players,
}) => {
  useEffect(() => {}, [])

  return (
    <Grid>
      <Left>
        <RoomDetails roomName={room} />
        <PlayerList players={players} />
      </Left>
      <Middle>
        <EmojiSet
          category={{ name: 'Movies', icon: '🍿', include: false }}
          emojiSet={'🌊🌍🔥🌬👩‍🦲'}
        />
      </Middle>
    </Grid>
  )
}

export default Game
