import React from 'react'
import styled from 'styled-components'
import { Box } from '../../../Styled/Styled'

const HintLine = styled(Box)`
  background-color: #fff;
  white-space: pre;
  justify-self: center;
  width: fit-content;
  margin-bottom: 1em;
`
const maskAnswer = (answer) => {
  const masked = answer.replace(/\s/g, '  ').replace(/[a-z0-9]/gi, '_ ')
  console.log(masked)
  return masked
}

const Hint = ({ answer }) => {
  return <HintLine>{maskAnswer(answer)}</HintLine>
}

export default Hint
