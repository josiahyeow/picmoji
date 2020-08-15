import React from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import GameSettings from '../GameSettings/GameSettings'
import ReadyStartButtons from '../ReadyStartButtons/ReadyStartButtons'
import Chat from '../Chat/Chat'

const Lobby = ({ roomName, players, settings }) => {
  return (
    <Grid>
      <Left>
        <RoomDetails roomName={roomName} />
        <GameSettings roomName={roomName} settings={settings} />
        <ReadyStartButtons roomName={roomName} />
      </Left>
      <Middle>
        <PlayerList players={players} inGame={false} />
        <Chat roomName={roomName} inGame={false} answer={''} />
      </Middle>
    </Grid>
  )
}

export default Lobby
