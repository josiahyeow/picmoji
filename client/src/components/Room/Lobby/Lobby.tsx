import React from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import GameSettings from '../GameSettings/GameSettings'
import GameControls from '../GameControls/GameControls'
import Chat from '../Chat/Chat'

const Lobby = () => {
  return (
    <Grid>
      <Left>
        <RoomDetails />
        <GameSettings />
        <GameControls inGame={false} />
      </Left>
      <Middle>
        <PlayerList inGame={false} />
        <Chat inGame={false} />
      </Middle>
    </Grid>
  )
}

export default Lobby
