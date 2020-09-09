import React from 'react'
import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import Chat from './Chat'

describe.skip('Chat', () => {
  it('should create new room and join it', () => {
    const { getByText, getByTestId } = render(
      <Chat roomName={'foo'} inGame={false} answer={''} />
    )
    userEvent.type(getByTestId('chat-message-input'), 'foo')
    fireEvent.click(getByTestId('chat-send-button'))
    // mock socket
  })
})
