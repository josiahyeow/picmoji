import React from 'react'
import { render } from '@testing-library/react'
import EmojiSet from './EmojiSet'

describe('EmojiSet', () => {
  it('should show category and emoji set', () => {
    const { getByText } = render(
      <EmojiSet
        category={'Movies'}
        emojiSet={'🌊🌍🔥🌬👩‍🦲'}
        previousAnswer={'not avatar'}
        hint={'______'}
        lastEvent={{}}
        gameEnd={false}
      />
    )
    expect(getByText('Movies'))
  })
})
