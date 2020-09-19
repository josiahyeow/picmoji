import React from 'react'
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
`
const revealAnswer = (answer) => {
  return answer.split('').join(' ')
}

const maskAnswer = (answer) => {
  return answer.replace(/\s/g, '  ').replace(/[a-z0-9]/gi, '_ ')
}

const Hint = ({ answer, reveal = false }) => {
  if (reveal) {
    return <HintLine>{revealAnswer(answer)}</HintLine>
  } else {
    return <HintLine>{maskAnswer(answer)}</HintLine>
  }
}

export default Hint
