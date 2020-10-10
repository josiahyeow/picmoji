import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import socket from '../../../../utils/socket'
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

const Hint = ({ value }) => {
  const [hint, setHint] = useState(value)
  const letters: string[] = Array.from(hint)

  useEffect(() => {
    socket.on('hint-update', (updatedHint) => setHint(updatedHint))
  }, [])

  return (
    <HintLine>
      <Letters variants={container} initial="hidden" animate="show">
        {letters.map((letter, index) => (
          <Letter key={index} variants={listItem}>
            {letter as any}
          </Letter>
        ))}
      </Letters>
    </HintLine>
  )
}

export default Hint
