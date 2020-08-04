import React, { useState, useEffect } from 'react'
import { Grid, Left } from '../Styled/Styled'
import RoomDetails from './RoomDetails'
import PlayerList from './PlayerList'
import { Players } from '../../typings/types'

const Lobby: React.FC<{ room: string; players: Players }> = ({
  room,
  players,
}) => {
  return (
    <Grid>
      <Left>
        <RoomDetails roomName={room} />
        <PlayerList players={players} />
      </Left>
    </Grid>
  )
}

export default Lobby
