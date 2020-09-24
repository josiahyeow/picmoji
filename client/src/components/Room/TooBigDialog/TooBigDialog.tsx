import React, { useState } from 'react'
import styled from 'styled-components'
import emoji from '../../../utils/emoji'
import { Button, Box } from '../../Styled/Styled'

const TooBig = styled(Box)`
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 0px;
  max-width: 8em;
  box-shadow: 0px 2px 5px rgba(11, 37, 105, 0.04),
    0px 1px 0px rgba(11, 37, 105, 0.04);
`

const TooBigButton = styled(Button)`
  padding: 0.5em;
  border-radius: 0px 0px 6px 6px;
  border: #050509 2px solid;
`

const TooBigMessage = styled.span`
  margin: 0.5em;
  font-size: 0.8em;
  background-color: #fff;
  padding: 0.5em;
  border-radius: 6px;
`

const TooBigDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <TooBig>
      {isOpen && <TooBigMessage>Use Ctrl- or ⌘- to zoom out 🔍</TooBigMessage>}
      <TooBigButton onClick={() => setIsOpen(!isOpen)}>
        {emoji('👀 Too big?')}
      </TooBigButton>
    </TooBig>
  )
}

export default TooBigDialog
