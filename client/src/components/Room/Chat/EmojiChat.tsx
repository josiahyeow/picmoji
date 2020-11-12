import React, { useState } from 'react'
import ReactGA from 'react-ga'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Picker } from 'emoji-mart'
import emoji from '../../../utils/emoji'
import { Button } from '../../Styled/Styled'
import socket from '../../../utils/socket'

const Container = styled(motion.div)``

const Buttons = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr auto 1fr 1fr;
  width: 100%;
  margin-top: 1em;
`

const Divider = styled.div`
  width: 3px;
  background-color: black;
`

const EmojiChat = ({ roomName }) => {
  const [emojiSet, setEmojiSet] = useState('')
  const [undo, setUndo] = useState('')

  const updateEmojiSet = (emojiSet) => {
    socket.emit('send-game-emoji', roomName, emojiSet)
  }

  const skipWord = () => {
    socket.emit('skip-word', roomName)
    setEmojiSet('')
  }

  return (
    <Container
      animate={{ scale: 1, opacity: 1 }}
      initial={{ scale: 0.6, opacity: 0 }}
    >
      <Picker
        color={'#000000'}
        useButton={true}
        emoji={'pencil'}
        title={'Describe the word using emojis'}
        set={'twitter'}
        onSelect={(emoji) => {
          setUndo(emojiSet)
          setEmojiSet((emojiSet) => emojiSet + emoji.native)
          updateEmojiSet(emojiSet + emoji.native)
        }}
        showPreview={false}
        style={{
          width: '100%',
        }}
      />
      <Buttons>
        <Button
          onClick={(event) => skipWord()}
          data-testid={'skip-word-button'}
        >
          {emoji('🙅')} Skip word
        </Button>
        <Divider />
        <Button onClick={() => updateEmojiSet(undo)}>{emoji('↩')} Undo</Button>
        <Button
          onClick={() => {
            updateEmojiSet('')
            setEmojiSet('')
          }}
        >
          {emoji('🗑')} Clear
        </Button>
      </Buttons>
    </Container>
  )
}

export default EmojiChat
