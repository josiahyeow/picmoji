import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, H2 } from '../Styled/Styled'

const EnterRoom = () => {
  return (
    <Box>
      <H2>How to play</H2>
      <ul>
        <li>Choose the number of points</li>
        <li>Pick the categories of words you want to guess</li>
        <li>
          When the game starts, be the first player to guess what the emojis
          mean
        </li>
        <li>First to reach the points set, wins!</li>
      </ul>
    </Box>
  )
}

export default EnterRoom
