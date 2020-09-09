import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Countdown from 'react-countdown'
import emoji from '../../../utils/emoji'
import { Box, H3 } from '../../Styled/Styled'
import Hint from './Hint/Hint'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 0.3fr 0.4fr 0.3fr;
  margin-bottom: 1rem;
`

const ScoreLimit = styled(H3)`
  justify-self: flex-end;
`

const Value = styled.span`
  text-align: center;
  font-weight: bold;
  padding: 0.2rem 0.4rem;
  margin: 0rem 0.5rem;
  background: #ffffff;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-family: sans-serif;
  font-style: normal;
`

const Set = styled.span`
  text-align: center;
  padding: 2rem;
  font-size: 3rem;
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(11, 37, 105, 0.04),
    0px 1px 0px rgba(11, 37, 105, 0.04);
  border-radius: 6px;
`

const StyledCountdown = styled(Set)`
  font-size: 3rem;
`

const EmojiSet = ({ category, emojiSet, answer, scoreLimit, lastEvent }) => {
  const [counter, setCounter] = useState(1)
  useEffect(() => {
    setCounter((counter) => counter + 1)
  }, [lastEvent])
  const renderer = ({ completed }) => {
    if (completed) {
      return <Set>{emoji(emojiSet)}</Set>
    } else {
      if (
        lastEvent.type === 'correct' ||
        lastEvent.type === 'pass' ||
        lastEvent.type === 'start'
      ) {
        return (
          <StyledCountdown>
            {lastEvent.type === 'correct' &&
              emoji(`${lastEvent.emoji} ${lastEvent.name} guessed it!`)}
            {lastEvent.type === 'pass' && emoji(`🙅 Emojiset passed`)}
            {lastEvent.type === 'start' && emoji(`🏁 Game start!`)}
          </StyledCountdown>
        )
      } else {
        return <Set>{emoji(emojiSet)}</Set>
      }
    }
  }

  return (
    <Box>
      <Header>
        <H3>
          Category
          <Value>{category}</Value>
        </H3>
        <Hint answer={answer} />
        <ScoreLimit>
          First to
          <Value>{scoreLimit}</Value>
          points
        </ScoreLimit>
      </Header>
      <Container>
        <Countdown date={Date.now() + 1000} renderer={renderer} key={counter} />
      </Container>
    </Box>
  )
}

export default EmojiSet
