import React, { useState, useEffect } from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import EmojiSet from '../EmojiSet/EmojiSet'
import socket from '../../../utils/socket'
import Chat from '../Chat/Chat'

const Game = ({ roomName, players, activeGame, setActiveGame }) => {
  console.log(activeGame)
  const [currentEmojiSet, setCurrentEmojiSet] = useState(
    activeGame.currentEmojiSet
  )
  useEffect(() => {
    socket.on('new-emojiset', (emojiSet) => setCurrentEmojiSet(emojiSet))
    socket.on('game-ended', () => setActiveGame(null))
  }, [])

  return (
    <Grid>
      <Left>
        <RoomDetails roomName={roomName} />
        <PlayerList players={players} inGame={true} />
      </Left>
      <Middle>
        <EmojiSet
          category={currentEmojiSet.category}
          emojiSet={currentEmojiSet.emojiSet}
        />
        <Chat
          roomName={roomName}
          inGame={true}
          answer={currentEmojiSet.answer}
        />
      </Middle>
    </Grid>
  )
}

export default Game
