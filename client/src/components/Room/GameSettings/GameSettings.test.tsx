import React from 'react'
import { render } from '@testing-library/react'
import GameSettings from './GameSettings'

describe('GameSettings', () => {
  it('should show input field for score limit', () => {
    const { getByText } = render(
      <GameSettings
        categories={['foo']}
        scoreLimit={10}
        updateScoreLimit={jest.fn()}
        categories={{
          words: { name: 'Words', include: true },
        }}
        updateCategories={jest.fn()}
      />
    )
    expect(getByText('Score limit'))
  })

  it('should show checkboxes to choose categories', () => {
    const categories = {
      words: { name: 'Words', include: true },
      movies: { name: 'Movies', include: false },
    }
    const { getByText } = render(
      <GameSettings
        categories={categories}
        scoreLimit={10}
        updateScoreLimit={jest.fn()}
        categories={categories}
        updateCategories={jest.fn()}
      />
    )
    expect(getByText('Words'))
    expect(getByText('Movies'))
  })
})
