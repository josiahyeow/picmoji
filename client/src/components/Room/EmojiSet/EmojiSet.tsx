import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import Countdown from 'react-countdown'
import emoji from '../../../utils/emoji'
import { Box, H3 } from '../../Styled/Styled'
import Hint from './Hint/Hint'

const Container = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 13em;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 0.3fr 0.4fr 0.3fr;
  margin-bottom: 1rem;
`

const Category = styled.span`
  text-align: center;
  padding: 0.2rem 0.4rem;
  margin: 0rem 1rem;
  margin-bottom: 1rem;
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

const SetContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(11, 37, 105, 0.04),
    0px 1px 0px rgba(11, 37, 105, 0.04);
  border-radius: 6px;
  padding: 1em;
  min-width: 26em;
`

const Set = styled.span`
  text-align: center;
  font-size: 3rem;
`

const StyledCountdown = styled(Set)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  min-height: 3em;
`

const MessageText = styled.span`
  margin: 0em 1em;
`

const Message = ({ icon, message }) => (
  <>
    {emoji(`${icon}`)}
    <MessageText>{message}</MessageText>
    {emoji(`${icon}`)}
  </>
)

const EmojiSet = ({
  category,
  emojiSet,
  previousAnswer,
  answer,
  lastEvent,
}) => {
  const [counter, setCounter] = useState(1)
  useEffect(() => {
    setCounter((counter) => counter + 1)
  }, [lastEvent])

  const emojiSetElement = (
    <>
      <Hint answer={answer} />
      <SetContainer>
        <Category>
          What <strong>{category}</strong> is this?
        </Category>
        <Set>{emoji(emojiSet)}</Set>
      </SetContainer>
    </>
  )
  const renderer = ({ completed, seconds }) => {
    if (completed) {
      return emojiSetElement
    } else {
      if (
        lastEvent.type === 'correct' ||
        lastEvent.type === 'pass' ||
        lastEvent.type === 'start'
      ) {
        return (
          <>
            {previousAnswer && <Hint answer={previousAnswer} reveal={true} />}
            <SetContainer
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
            >
              <StyledCountdown>
                {lastEvent.type === 'correct' && (
                  <Message
                    icon={lastEvent.emoji}
                    message={`${lastEvent.name} guessed it!`}
                  />
                )}
                {lastEvent.type === 'pass' && (
                  <Message icon={'🙅'} message={`Emojiset passed`} />
                )}
                {lastEvent.type === 'start' && (
                  <Message icon={'🏁'} message={seconds} />
                )}
              </StyledCountdown>
            </SetContainer>
          </>
        )
      } else {
        return emojiSetElement
      }
    }
  }

  return (
    <Container>
      <Countdown date={Date.now() + 3000} renderer={renderer} key={counter} />
    </Container>
  )
}

export default EmojiSet
