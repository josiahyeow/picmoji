import React from 'react'
import styled from 'styled-components'
import { Box, H3, H4 } from '../../Styled/Styled'
import { GameSettings as IGameSettings } from '../../../typings/types'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
`

const Label = styled.label``

const ScoreLimitInput = styled.input`
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: none;
`

const CategorySelector = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
`

const Category = styled.div`
  margin-bottom: 0.5rem;
`

const CategoryCheckbox = styled.input`
  margin-right: 0.5rem;
`

const CategoryLabel = styled.label`
  text-transform: capitalize;
`

const GameSettings: React.FC<{
  categories: string[]
  settings: IGameSettings
  updateSettings: any
}> = ({ categories, settings, updateSettings }) => {
  const { scoreLimit, selectedCategories } = settings
  return (
    <Box>
      <Container>
        <H3>Game settings</H3>
        <Label htmlFor="scorelimit-input">Score limit</Label>
        <ScoreLimitInput
          id="scorelimit-input"
          value={scoreLimit}
          placeholder="Enter your name"
          type="number"
          onChange={(event) =>
            updateSettings((oldSettings: IGameSettings) => ({
              ...oldSettings,
              scoreLimit: event.target.value,
            }))
          }
        />
        <Label>Categories</Label>
        <CategorySelector>
          {categories.map((category) => (
            <Category key={category}>
              <CategoryCheckbox
                type="checkbox"
                name={`${category}-checkbox`}
                value={category}
              />
              <CategoryLabel htmlFor={`${category}-checkbox`}>
                {category}
              </CategoryLabel>
            </Category>
          ))}
        </CategorySelector>
      </Container>
    </Box>
  )
}

export default GameSettings
