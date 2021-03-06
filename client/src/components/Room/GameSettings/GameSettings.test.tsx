import React from 'react'
import { render } from '@testing-library/react'
import GameSettings from './GameSettings'

describe('GameSettings', () => {
  it('should show input field for score limit and category checkboxes', () => {
    const { getByText } = render(
      <GameSettings
        roomName={'foo'}
        settings={{
          scoreLimit: 10,
          selectedCategories: {
            words: { icon: '💬', name: 'Words', include: true },
            movies: { icon: '🍿', name: 'Movies', include: false },
          },
        }}
        disabled={false}
      />
    )
    expect(getByText('Score Limit'))
    expect(getByText('Words'))
    expect(getByText('Movies'))
  })
})
