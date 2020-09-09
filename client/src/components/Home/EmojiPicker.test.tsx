import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmojiPicker from './EmojiPicker'

describe('EmojiPicker', () => {
  it('should show open emoji picker when emoji input is clicked', async () => {
    let playerEmoji = '😀'
    const setPlayerEmojiMock = (newEmoji) => {
      playerEmoji = newEmoji
    }
    const { getByDisplayValue, getByLabelText } = render(
      <EmojiPicker
        playerEmoji={playerEmoji}
        setPlayerEmoji={setPlayerEmojiMock}
      />
    )
    expect(getByDisplayValue('😀'))
    userEvent.click(getByDisplayValue('😀'))
    expect(getByLabelText('Pick your emoji'))

    // TODO: test whether the emoji is updated when selected
  })
})
