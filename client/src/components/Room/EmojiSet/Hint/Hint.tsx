import React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Box } from '../../../Styled/Styled'

const HintLine = styled(Box)`
  background-color: #fff;
  white-space: pre;
  justify-self: center;
  min-width: 26em;
  margin-bottom: 1em;
  text-align: center;
  font-weight: bold;
  background-color: #f1f4f7;
`
const Letters = styled(motion.div)`
  display: flex;
  justify-content: center;
`

const Letter = styled(motion.div)`
  margin-right: 0.3em;

  &:last-child {
    margin-right: 0em;
  }
`

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
}

const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

const Hint = ({ answer, reveal = false }) => {
  const answerLetters: string[] = Array.from(answer)

  return (
    <HintLine>
      <Letters variants={container} initial="hidden" animate="show">
        {answerLetters.map((letter, index) =>
          reveal ? (
            <Letter key={index} variants={listItem}>
              {letter as any}
            </Letter>
          ) : /[a-z0-9]/gi.test(letter) ? (
            '_ '
          ) : (
            letter
          )
        )}
      </Letters>
    </HintLine>
  )
}

export default Hint
