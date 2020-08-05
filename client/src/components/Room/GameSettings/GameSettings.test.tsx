import React from 'react'
import { render } from '@testing-library/react'
import GameSettings from './GameSettings'

describe('GameSettings', () => {
  it('should show input field for score limit', () => {
    const { getByText } = render(
      <GameSettings
        categories={['foo']}
        settings={{ scoreLimit: 10, selectedCategories: [] }}
        updateSettings={jest.fn()}
      />
    )
    expect(getByText('Score limit'))
  })

  it('should show checkboxes to choose categories', () => {
    const categories = ['foo', 'bar']
    const { getByText } = render(
      <GameSettings
        categories={categories}
        settings={{ scoreLimit: 10, selectedCategories: [] }}
        updateSettings={jest.fn()}
      />
    )
    expect(getByText('foo'))
    expect(getByText('bar'))
  })
})
