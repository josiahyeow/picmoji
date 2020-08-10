import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Box, Button } from '../../Styled/Styled'

const Grid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
`

const ReadyStartButtons = ({ startGame }) => {
  return (
    <Box>
      <Grid>
        <Button onClick={() => startGame()}>Start game</Button>
      </Grid>
    </Box>
  )
}

export default ReadyStartButtons