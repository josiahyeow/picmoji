import React from 'react'
import styled from 'styled-components'
import emoji from '../../utils/emoji'
import { Box, H2 } from '../Styled/Styled'

const InstructionSet = styled(Box)`
  background-color: #fff;
  display: grid;
  grid-gap: 1rem;
`

const InstructionLine = styled.span``

const Instructions = () => {
  return (
    <Box>
      <H2>How to play</H2>
      <InstructionSet>
        <InstructionLine>
          {emoji('🤔')} Choose the number of <strong>points</strong> you want to
          play to.
        </InstructionLine>
        <InstructionLine>
          {emoji('📚')} Pick the <strong>categories</strong> of words you want
          to guess.
        </InstructionLine>
        <InstructionLine>
          {emoji('💬')} When the game starts, be the first player to{' '}
          <strong>guess the emojis</strong> - one point for each fastest correct
          guess.
        </InstructionLine>
        <InstructionLine>
          {emoji('🏆')} First to get the chosen number of points,{' '}
          <strong>wins!</strong>
        </InstructionLine>
      </InstructionSet>
    </Box>
  )
}

export default Instructions
