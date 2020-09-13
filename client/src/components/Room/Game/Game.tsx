import React from 'react'
import styled from 'styled-components'
import { Grid, Left, Middle } from '../../Styled/Styled'
import PlayerList from '../PlayerList/PlayerList'
import EmojiSet from '../EmojiSet/EmojiSet'
import Chat from '../Chat/Chat'
import GameControls from '../GameControls/GameControls'
import GameEnd from '../GameEnd/GameEnd'

const GameSidebar = styled(Left)`
  grid-template-rows: auto 0.1fr;
`

const Game = ({ roomName, players, activeGame }) => {
  return (
    <Grid>
      <GameSidebar>
        {!activeGame.winners && (
          <PlayerList
            players={players}
            inGame={true}
            scoreLimit={activeGame.scoreLimit}
          />
        )}
        <GameControls roomName={roomName} inGame={true} />
      </GameSidebar>
      <Middle>
        {activeGame.winners ? (
          <>
            <GameEnd />
            <PlayerList
              players={players}
              inGame={true}
              scoreLimit={activeGame.scoreLimit}
            />
          </>
        ) : (
          <EmojiSet
            category={activeGame.currentEmojiSet.category}
            emojiSet={activeGame.currentEmojiSet.emojiSet}
            answer={activeGame.currentEmojiSet.answer}
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
