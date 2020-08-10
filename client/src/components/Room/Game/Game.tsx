import React, { useState, useEffect } from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import EmojiSet from '../EmojiSet/EmojiSet'
import socket from '../../../utils/socket'
import Chat from '../Chat/Chat'

const Game = ({ roomName, players }) => {
  const [currentEmojiSet, setCurrentEmojiSet] = useState({
    emojiSet: '...loading',
    answer: '',
    category: '',
  })
  useEffect(() => {
    socket.on('game-started', (game) => {
      socket.emit('next-emojiset', roomName)
    })
    socket.on('new-emojiset', (emojiSet) => setCurrentEmojiSet(emojiSet))
  }, [])

  return (
    <Grid>
      <Left>
        <RoomDetails roomName={roomName} />
        <PlayerList players={players} />
      </Left>
      <Middle>
        <EmojiSet
          category={currentEmojiSet.category}
          emojiSet={currentEmojiSet.emojiSet}
        />
        <Chat roomName={roomName} />
      </Middle>
    </Grid>
  )
}

export default Game
