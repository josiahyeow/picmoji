import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should show game logo', () => {
    const { container } = render(<App />)
    expect(container).not.toBeNull()
  })
})
