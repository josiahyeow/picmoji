import React from 'react'
import styled from 'styled-components'
import { Box } from '../../Styled/Styled'

const RoomName = styled.span`
  font-weight: bold;
`

const RoomDetails: React.FC<{ roomName: string }> = ({ roomName }) => {
  return (
    <Box>
      Room: <RoomName>{roomName}</RoomName>
    </Box>
  )
}

export default RoomDetails
