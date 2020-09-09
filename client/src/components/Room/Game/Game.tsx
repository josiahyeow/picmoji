import React from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import EmojiSet from '../EmojiSet/EmojiSet'
import Chat from '../Chat/Chat'
import GameControls from '../GameControls/GameControls'
import GameEnd from '../GameEnd/GameEnd'

const Game = ({ roomName, players, activeGame }) => {
  return (
    <Grid>
      <Left>
        <RoomDetails roomName={roomName} />
        {!activeGame.winners && <PlayerList players={players} inGame={true} />}
        <GameControls roomName={roomName} inGame={true} />
      </Left>
      <Middle>
        {activeGame.winners ? (
          <>
            <GameEnd />
            <PlayerList players={players} inGame={true} />
          </>
        ) : (
          <EmojiSet
            category={activeGame.currentEmojiSet.category}
            emojiSet={activeGame.currentEmojiSet.emojiSet}
            answer={activeGame.currentEmojiSet.answer}
            scoreLimit={activeGame.scoreLimit}
            lastEvent={activeGame.lastEvent}
          />
        )}
        <Chat
          roomName={roomName}
          inGame={true}
          answer={activeGame.currentEmojiSet.answer}
          players={players}
        />
      </Middle>
    </Grid>
  )
}

export default Game
