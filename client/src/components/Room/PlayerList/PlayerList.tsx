import React from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, H3 } from '../../Styled/Styled'
import emoji from '../../../utils/emoji'
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

const Row = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  align-items: center;
`

const Ranking = styled.span`
  font-weight: bold;
  margin-right: 1rem;
`

const Players = styled.div<{ inGame: boolean }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: ${({ inGame }) =>
    inGame ? '1fr' : 'repeat(auto-fill,minmax(6rem, 1fr))'};
  max-height: 30rem;
  overflow-y: ${({ inGame }) => (inGame ? 'auto' : 'hidden')};
  overflow-x: hidden;
`

const Player = styled(motion.div)<{ inGame: boolean; currentPlayer: boolean }>`
  ${({ inGame }) => inGame && 'flex-grow: 1'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: ${({ inGame }) => (inGame ? 'row' : 'column')};
  padding: 0.5rem;
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(11, 37, 105, 0.04),
    0px 1px 0px rgba(11, 37, 105, 0.04);
  border-radius: 6px;
  font-weight: bold;
  min-width: 5rem;
  ${({ currentPlayer }) => currentPlayer && 'border: #dde2e6 2px solid;'};
`

const Emoji = styled.div<{ color: string }>`
  // background-color: ${({ color }) => color};
  border-radius: 50%;
  padding: 0.5rem;
  padding-right: 1rem; // To account for react-easy-emoji adding padding
  width: 2rem;
  height: 2rem;
  font-size: 2rem;
  line-height: 2rem;
  text-align: center;
  left: 0.1em;
`

const Score = styled.div`
  background-color: #f1f4f7;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 6px;
`

const Name = styled.div`
  padding: 0.5rem;
`

const Pass = styled.span`
  font-weight: 400;
  color: #929292;
  margin-left: 0.5rem;
`

const PlayerList = ({ players, playerId, inGame, scoreLimit = 0 }) => {
  const compare = (a, b) => {
    if (players[a].score > players[b].score) return -1
    if (players[b].score > players[a].score) return 1
    return 0
  }

  return (
    <Box>
      <Container>
        <H3>{inGame ? 'Leaderboard' : 'Players'}</H3>
        <Players inGame={inGame}>
          <AnimatePresence>
            {Object.keys(players)
              .sort(compare)
              .map((key, index) => (
                <Row key={key}>
                  {inGame && <Ranking>#{index + 1}</Ranking>}

                  <Player
                    key={key}
                    inGame={inGame}
                    currentPlayer={key === playerId}
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0, opacity: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <Emoji color={getRandom(BACKGROUND_COLORS)}>
                      {players[key].pass
                        ? emoji('🙅')
                        : emoji(players[key].emoji)}
                    </Emoji>
                    <Name>
                      {players[key].name}
                      {players[key].pass && <Pass>(Pass)</Pass>}
                      {!inGame && players[key].host && <Pass>(Host)</Pass>}
                    </Name>
                    {inGame && (
                      <Score>
                        {players[key].score} / {scoreLimit}
                      </Score>
                    )}
                  </Player>
                </Row>
              ))}
          </AnimatePresence>
        </Players>
      </Container>
    </Box>
  )
}

export default PlayerList
