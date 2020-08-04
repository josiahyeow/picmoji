import React from 'react'
import styled from 'styled-components'
import { Box, H3 } from '../Styled/Styled'
import { Players } from '../../typings/types'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`

const Player = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
`

const PlayerList: React.FC<{ players: Players }> = ({ players }) => {
  return (
    <Box>
      <Container>
        <H3>Players</H3>
        {Object.keys(players).map((key) => (
          <Player key={key}>{players[key]}</Player>
        ))}
      </Container>
    </Box>
  )
}

export default PlayerList
