import React, { useContext } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { Box, Button } from '../../Styled/Styled'
import emoji from '../../../utils/emoji'
import socket from '../../../utils/socket'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'

const Grid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
`

const ReadyStartButtons = ({ inGame }) => {
  const { room, player, players } = useContext(RoomContext) as RoomContextProps
  const isHost = players ? players[player?.id]?.host : player?.host

  const startGame = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Started game',
    })
    socket.emit('start-game', room.name)
  }

  const endGame = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Ended game',
    })
    socket.emit('end-game', room.name)
  }

  return (
    <Box>
      <Grid>
        {inGame ? (
          <Button
            onClick={() => endGame()}
            disabled={!isHost}
            title={!isHost ? 'Please ask the host to end the game' : ''}
          >
            {emoji('🚪')} Back to Lobby
          </Button>
        ) : (
          <Button
            onClick={() => startGame()}
            disabled={!isHost}
            title={!isHost ? 'Please ask the host to start the game' : ''}
          >
            {emoji('🏁')} Start Game
          </Button>
        )}
      </Grid>
    </Box>
  )
}

export default ReadyStartButtons
