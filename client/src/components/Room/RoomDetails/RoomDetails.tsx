import React, { useState, useRef, useContext } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import emoji from '.././../../utils/emoji'
import { H3, Box, Input, Button } from '../../Styled/Styled'
import { RoomContext, RoomContextProps } from '../../providers/RoomProvider'

const Details = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 1em;
`

const Address = styled.div`
  display: flex;
`

const RoomNameInput = styled(Input)`
  border-radius: 6px 0px 0px 6px;
  border: none;
  min-width: 1em;
  &:focus,
  &:hover {
    border: none;
    background-color: #f1f4f7;
  }
`

const CopyButton = styled(Button)`
  border-radius: 0px 6px 6px 0px;
  min-width: fit-content;
`

const RoomDetails = () => {
  const { room } = useContext(RoomContext) as RoomContextProps
  const [copySuccess, setCopySuccess] = useState('📋 Copy')
  const [passwordShown, setPasswordShown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function copyToClipboard(e) {
    ReactGA.event({
      category: 'Lobby',
      action: 'Copy room URL',
    })
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

  async function showPassword() {
    setPasswordShown(true)
    await new Promise((resolve) => setTimeout(() => resolve(true), 2000))
    setPasswordShown(false)
  }

  return (
    <Box>
      <H3>Share Room</H3>
      <Details>
        <Address>
          <RoomNameInput
            ref={inputRef}
            value={`${window.location.href}`}
            data-testid={'room-name'}
            readOnly
          />
          {document.queryCommandSupported('copy') && (
            <CopyButton onClick={copyToClipboard}>
              {emoji(copySuccess)}
            </CopyButton>
          )}
        </Address>
        {room.roomPassword && (
          <Address>
            <RoomNameInput
              value={
                passwordShown
                  ? room.roomPassword
                  : room.roomPassword.replace(/./g, '*')
              }
            />
            <CopyButton onClick={showPassword}>
              {emoji(passwordShown ? '🔓' : '🔒')} Show
            </CopyButton>
          </Address>
        )}
      </Details>
    </Box>
  )
}

export default RoomDetails
