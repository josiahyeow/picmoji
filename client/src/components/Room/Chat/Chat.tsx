import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ScrollToBottom from 'react-scroll-to-bottom'
import emoji from '../../../utils/emoji'
import { Box, Input, Button } from '../../Styled/Styled'
import socket from '../../../utils/socket'

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 1rem;
`
const SendContainer = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
`
const Messages = styled.div`
  display: flex;
  flex-direction: column;
  height: 23rem;
`

const Scroll = styled(ScrollToBottom)`
  overflow: auto;
  background-color: #fff;
  border-radius: 6px;
  padding: 1rem;
`

const Message = styled.div`
  margin: 0.5rem 0rem;
`
const Player = styled.span``

const Bubble = styled.span`
  background-color: #f1f4f7;
  border-radius: 1em;
  padding: 0.25em 0.75em;
  margin-left: 0.5rem;
`

const CorrectBubble = styled(Bubble)`
  background-color: #b0ffde;
  border: #00ff94 1px solid;
`

const Buttons = styled.div`
  display: flex;
`

const Spacer = styled.div`
  width: 0.5rem;
`

const Chat = ({ roomName, inGame, answer, players }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([] as any[])

  useEffect(() => {
    socket.on('new-chat-message', (message) =>
      setMessages((messages) => [...messages, message])
    )
    socket.on('emoji-guessed', () => {
      setMessage('')
    })
  }, [])

  const sendMessage = (event) => {
    event.preventDefault()

    if (inGame) {
      socket.emit('send-game-message', roomName, message, answer)
    } else {
      socket.emit('send-chat-message', roomName, message)
    }
    setMessage('')
  }

  const passEmojiSet = (event) => {
    event.preventDefault()
    socket.emit('pass-emojiset', roomName)
  }

  return (
    <Box>
      <Container>
        <Scroll>
          <Messages>
            {messages.map((message, index) => (
              <Message key={index}>
                <Player> {message.player.emoji}</Player>
                {message.correct ? (
                  <CorrectBubble>{message.text}</CorrectBubble>
                ) : (
                  <Bubble>{message.text}</Bubble>
                )}
              </Message>
            ))}
          </Messages>
        </Scroll>
        <SendContainer>
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            data-testid={'chat-message-input'}
            required
          />
          <Buttons>
            <Button
              onClick={(event) => message && sendMessage(event)}
              data-testid={'chat-send-button'}
            >
              {emoji('💬')} {inGame ? 'Guess' : 'Send'}
            </Button>
            {inGame && (
              <>
                <Spacer />
                <Button
                  onClick={(event) => passEmojiSet(event)}
                  data-testid={'pass-emojiset-button'}
                  disabled={players[socket.id] && players[socket.id].pass}
                >
                  {emoji('🙅')} Pass
                </Button>
              </>
            )}
          </Buttons>
        </SendContainer>
      </Container>
    </Box>
  )
}

export default Chat
