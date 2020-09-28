import React from 'react'
import styled from 'styled-components'
import { Grid, Left, Middle } from '../../Styled/Styled'
import PlayerList from '../PlayerList/PlayerList'
import EmojiSet from '../EmojiSet/EmojiSet'
import Chat from '../Chat/Chat'
import GameControls from '../GameControls/GameControls'

const GameSidebar = styled(Left)`
  grid-template-rows: 0.1fr auto;
`

const GameOver = styled(Middle)`
  grid-template-rows: 0.1fr auto;
`

const Game = ({ roomName, playerId, players, activeGame }) => {
  return (
    <Grid>
      <GameSidebar>
        <GameControls
          roomName={roomName}
          inGame={true}
          disabled={!players[playerId]?.host}
        />
        {activeGame.winners ? (
          <Chat
            roomName={roomName}
            inGame={false}
            answer={activeGame.currentEmojiSet.answer}
          />
        ) : (
          <PlayerList
            playerId={playerId}
            players={players}
            inGame={true}
            scoreLimit={activeGame.scoreLimit}
          />
        )}
      </GameSidebar>

      {activeGame.winners ? (
        <GameOver>
          <EmojiSet
            category={activeGame.currentEmojiSet.category}
            emojiSet={activeGame.currentEmojiSet.emojiSet}
            previousAnswer={activeGame.previousEmojiSet.answer}
            answer={activeGame.currentEmojiSet.answer}
            lastEvent={activeGame.lastEvent}
            gameEnd={true}
          />
          <PlayerList
            playerId={playerId}
            players={players}
            inGame={true}
            scoreLimit={activeGame.scoreLimit}
          />
        </GameOver>
      ) : (
        <Middle>
          <EmojiSet
            category={activeGame.currentEmojiSet.category}
            emojiSet={activeGame.currentEmojiSet.emojiSet}
            previousAnswer={activeGame.previousEmojiSet.answer}
            answer={activeGame.currentEmojiSet.answer}
            lastEvent={activeGame.lastEvent}
            gameEnd={false}
          />
          <Chat
            roomName={roomName}
            inGame={true}
            answer={activeGame.currentEmojiSet.answer}
          />
        </Middle>
      )}
    </Grid>
  )
}

export default Game
