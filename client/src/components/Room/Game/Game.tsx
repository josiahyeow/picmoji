import React from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import EmojiSet from '../EmojiSet/EmojiSet'
import Chat from '../Chat/Chat'

const Game = ({ roomName, players, activeGame }) => {
  return (
    <Grid>
      <Left>
        <RoomDetails roomName={roomName} />
        <PlayerList players={players} inGame={true} />
      </Left>
      <Middle>
        <EmojiSet
          category={activeGame.currentEmojiSet.category}
          emojiSet={activeGame.currentEmojiSet.emojiSet}
          scoreLimit={activeGame.scoreLimit}
        />
        <Chat
          roomName={roomName}
          inGame={true}
          answer={activeGame.currentEmojiSet.answer}
        />
      </Middle>
    </Grid>
  )
}

export default Game
