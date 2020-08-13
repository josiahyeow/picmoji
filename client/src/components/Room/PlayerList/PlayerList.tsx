import React from 'react'
import styled from 'styled-components'
import { Box, H3 } from '../../Styled/Styled'
import { Players as IPlayers } from '../../../typings/types'
import { getRandom } from '../../../utils/random'

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

const Players = styled.div<{ inGame: boolean }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: ${({ inGame }) =>
    inGame ? '1fr' : 'repeat(auto-fit,minmax(6rem, 1fr))'};
`

const Player = styled.div<{ inGame: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: ${({ inGame }) => (inGame ? 'row' : 'column')};
  padding: 1rem;
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(11, 37, 105, 0.04),
    0px 1px 0px rgba(11, 37, 105, 0.04);
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

const Score = styled.div`
  background-color: #f1f4f7;
  padding: 0.5rem;
  border-radius: 6px;
`

const Name = styled.div``

const PlayerList = ({ players, inGame }) => {
  return (
    <Box>
      <Container>
        <H3>Players</H3>
        <Players inGame={inGame}>
          {Object.keys(players).map((key) => (
            <Player key={key} inGame={inGame}>
              <Emoji color={getRandom(BACKGROUND_COLORS)}>
                {players[key].emoji}
              </Emoji>
              <Name>{players[key].name}</Name>
              {inGame && <Score>{players[key].score}</Score>}
            </Player>
          ))}
        </Players>
      </Container>
    </Box>
  )
}

export default PlayerList
