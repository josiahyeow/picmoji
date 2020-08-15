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
            words: { name: 'Words', include: true },
            movies: { name: 'Movies', include: false },
          },
        }}
      />
    )
    expect(getByText('Score limit'))
    expect(getByText('Words'))
    expect(getByText('Movies'))
  })
})
