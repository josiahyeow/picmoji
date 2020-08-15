import React from 'react'
import styled from 'styled-components'
import { Box, Button } from '../../Styled/Styled'
import socket from '../../../utils/socket'

const Grid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
`

const ReadyStartButtons = ({ roomName }) => {
  const startGame = () => {
    socket.emit('start-game', roomName)
  }

  return (
    <Box>
      <Grid>
        <Button onClick={() => startGame()}>Start game</Button>
      </Grid>
    </Box>
  )
}

export default ReadyStartButtons
