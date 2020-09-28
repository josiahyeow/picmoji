import React, { useState } from 'react'
import styled from 'styled-components'
import emoji from '../../../utils/emoji'
import { Button } from '../../Styled/Styled'

const TooBig = styled.div`
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 0px;
  max-width: 8em;
  border: none;
`

const TooBigButton = styled(Button)`
  padding: 0.5em;
  border-radius: 0px 0px 6px 6px;
  margin: 0px;
  border: #050509 3px solid;
`

const TooBigMessage = styled.span`
  font-size: 0.8em;
  background-color: #fff;
  padding: 1em;
  border: #050509 3px solid;
  border-bottom: none;
  border-top: none;
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
