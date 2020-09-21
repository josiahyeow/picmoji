import React from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import GameSettings from '../GameSettings/GameSettings'
import GameControls from '../GameControls/GameControls'
import Chat from '../Chat/Chat'

const Lobby = ({ roomName, playerId, players, settings }) => {
  return (
    <Grid>
      <Left>
        <RoomDetails roomName={roomName} />
        <GameSettings
          roomName={roomName}
          settings={settings}
          disabled={!players[playerId]?.host}
        />
        <GameControls
          roomName={roomName}
          inGame={false}
          disabled={!players[playerId]?.host}
        />
      </Left>
      <Middle>
        <PlayerList players={players} playerId={playerId} inGame={false} />
        <Chat
          roomName={roomName}
          inGame={false}
          answer={''}
          players={players}
        />
      </Middle>
    </Grid>
  )
}

export default Lobby
