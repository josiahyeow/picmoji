import React from 'react'
import styled from 'styled-components'
import { Box, Button } from '../../Styled/Styled'
import emoji from '../../../utils/emoji'
import socket from '../../../utils/socket'

const Grid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
`

const ReadyStartButtons = ({ roomName, inGame }) => {
  const startGame = () => {
    socket.emit('start-game', roomName)
  }

  const endGame = () => {
    socket.emit('end-game', roomName)
  }

  return (
    <Box>
      <Grid>
        {inGame ? (
          <Button onClick={() => endGame()}>{emoji('🚪')} Back to lobby</Button>
        ) : (
          <Button onClick={() => startGame()}>{emoji('🏁')} Start game</Button>
        )}
      </Grid>
    </Box>
  )
}

export default ReadyStartButtons
