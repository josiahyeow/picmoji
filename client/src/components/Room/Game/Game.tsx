import React, { useState, useEffect } from 'react'
import { Grid, Left, Middle } from '../../Styled/Styled'
import RoomDetails from '../RoomDetails/RoomDetails'
import PlayerList from '../PlayerList/PlayerList'
import { Players } from '../../../typings/types'
import EmojiSet from '../EmojiSet/EmojiSet'
import socket from '../../../utils/socket'

const Game: React.FC<{ room: string; players: Players }> = ({
  room,
  players,
}) => {
  const [currentEmojiSet, setCurrentEmojiSet] = useState({
    emojiSet: '',
    answer: '',
  })
  useEffect(() => {
    socket.on('game-started', (game) => {
      socket.emit('next-emojiset', room)
    })
    socket.on('new-emojiset', (emojiSet) => setCurrentEmojiSet(emojiSet))
  }, [])

  return (
    <Grid>
      <Left>
        <RoomDetails roomName={room} />
        <PlayerList players={players} />
      </Left>
      <Middle>
        <EmojiSet
          category={{ name: 'Movies', icon: '🍿', include: false }}
          emojiSet={currentEmojiSet.emojiSet}
        />
        <button onClick={() => socket.emit('next-emojiset', room)}>
          refresh
        </button>
      </Middle>
    </Grid>
  )
}

export default Game
