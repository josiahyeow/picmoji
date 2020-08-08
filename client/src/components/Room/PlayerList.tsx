import React from 'react'
import styled from 'styled-components'
import { Box, H3 } from '../Styled/Styled'
import { Players as IPlayers } from '../../typings/types'
import { getRandom } from '../../utils/random'

const BACKGROUND_COLORS = [
  '#ffb3ba',
  '#ffdfba',
  '#ffffba',
  '#baffc9',
  '#bae1ff',
]

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`

const Players = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
`

const Player = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f2f2f2;
  border-radius: 6px;
  font-weight: bold;
`

const Emoji = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  padding: 0.8rem;
  width: 2rem;
  height: 2rem;
  font-size: 2rem;
  line-height: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
`

const Name = styled.div``

const PlayerList: React.FC<{ players: IPlayers }> = ({ players }) => {
  return (
    <Box>
      <Container>
        <H3>Players</H3>
        <Players>
          {Object.keys(players).map((key) => (
            <Player key={key}>
              <Emoji color={getRandom(BACKGROUND_COLORS)}>
                {players[key].emoji}
              </Emoji>
              <Name>{players[key].name}</Name>
            </Player>
          ))}
        </Players>
      </Container>
    </Box>
  )
}

export default PlayerList
