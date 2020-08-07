import React from 'react'
import styled from 'styled-components'
import { Box, H3, H4 } from '../../Styled/Styled'
import {
  GameSettings as IGameSettings,
  Categories,
} from '../../../typings/types'

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

const GameSettings = ({
  scoreLimit,
  updateScoreLimit,
  categories,
  updateCategories,
}) => {
  const handleUpdateCategory = (category) => {
    const newCategories = categories
    newCategories[category].include = !categories[category].include
    updateCategories(JSON.parse(JSON.stringify(newCategories)))
  }

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
          onChange={(event) => updateScoreLimit(event.target.value)}
        />
        <Label>Categories</Label>
        <CategorySelector>
          {Object.keys(categories).map((category) => (
            <Category key={category}>
              <CategoryCheckbox
                type="checkbox"
                name={`${category}-checkbox`}
                value={`${category}`}
                checked={categories[category].include}
                onChange={(event) => handleUpdateCategory(event.target.value)}
              />
              <CategoryLabel htmlFor={`${category}-checkbox`}>
                {categories[category].name}
              </CategoryLabel>
            </Category>
          ))}
        </CategorySelector>
      </Container>
    </Box>
  )
}

export default GameSettings
