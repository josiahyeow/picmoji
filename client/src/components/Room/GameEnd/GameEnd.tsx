import React from 'react'
import styled from 'styled-components'
import { Box, H2 } from '../../Styled/Styled'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const GameEnd = () => {
  return (
    <Box>
      <H2>Game over!</H2>
    </Box>
  )
}

export default GameEnd
