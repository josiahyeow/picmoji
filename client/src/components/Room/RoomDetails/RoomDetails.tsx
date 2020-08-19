import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import config from '../../../config/config'
import { H3, Box, Input, Button } from '../../Styled/Styled'

const Details = styled.div`
  display: flex;
`

const RoomNameInput = styled(Input)`
  font-weight: bold;
  border-radius: 6px 0px 0px 6px;
`

const CopyButton = styled(Button)`
  border-radius: 0px 6px 6px 0px;
`

const RoomDetails: React.FC<{ roomName: string }> = ({ roomName }) => {
  const [copySuccess, setCopySuccess] = useState('📋 Copy')
  const inputRef = useRef<HTMLInputElement>(null)

  async function copyToClipboard(e) {
    if (inputRef && inputRef.current) {
      inputRef.current.select()
    }
    document.execCommand('copy')
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus()
    setCopySuccess('✅ Copied!')
    await new Promise((resolve) => setTimeout(() => resolve(true), 2000))
    setCopySuccess('📋 Copy')
  }

  return (
    <Box>
      <H3>Share room</H3>
      <Details>
        <RoomNameInput
          ref={inputRef}
          value={`${config.CLIENT_URL}/${roomName}`}
          readOnly
        />
        {document.queryCommandSupported('copy') && (
          <CopyButton onClick={copyToClipboard}>{copySuccess}</CopyButton>
        )}
      </Details>
    </Box>
  )
}

export default RoomDetails
