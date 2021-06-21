import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import emoji from '../../../utils/emoji'
import socket from '../../../utils/socket'
import { Box } from '../../Styled/Styled'

const Time = styled(Box)`
  background-color: #fff;
  white-space: pre;
  justify-self: center;
  min-width: 3em;
  margin-bottom: 1em;
  text-align: center;
  font-weight: bold;
  background-color: #f1f4f7;
  margin-left: 1em;
`

export const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(0)
  useEffect(() => {
    socket.on('time-update', (timeLeft) => setTimeLeft(timeLeft))
  }, [])

  if (timeLeft === -1) {
    return null
  }

  return (
    <Time>
      {emoji('⏰')} {timeLeft === 0 ? ' ' : timeLeft}
    </Time>
  )
}
