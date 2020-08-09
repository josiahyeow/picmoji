import React from 'react'
import { render } from '@testing-library/react'
import EmojiSet from './EmojiSet'

describe('EmojiSet', () => {
  it('should show category and emoji set', () => {
    const { getByText } = render(
      <EmojiSet
        category={{ name: 'Movies', icon: '🍿' }}
        emojiSet={'🌊🌍🔥🌬👩‍🦲'}
      />
    )
    expect(getByText('🍿'))
    expect(getByText('Movies'))
    expect(getByText('🌊🌍🔥🌬👩‍🦲'))
  })
})
