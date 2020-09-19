import React from 'react'
import styled from 'styled-components'
import { Box, H2 } from '../../Styled/Styled'

const Text = styled(H2)`
  margin: 0.4em 0em;
`

const GameEnd = () => {
  return (
    <Box>
      <Text>Game over!</Text>
    </Box>
  )
}

export default GameEnd
