import React from 'react'
import styled from 'styled-components'
import { Box, H3 } from '../../Styled/Styled'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Category = styled.span`
  text-align: center;
  font-weight: bold;
  padding: 0.2rem 0.4rem;
  margin: 0rem 0.5rem;
  background: #ffffff;
  border-radius: 6px;
  margin-bottom: 1rem;
`

const CategoryIcon = styled.span`
  margin-right: 0.2rem;
`

const CategoryName = styled.span``

const Set = styled.span`
  text-align: center;
  font-weight: bold;
  padding: 2rem;
  font-size: 5rem;
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(11, 37, 105, 0.04),
    0px 1px 0px rgba(11, 37, 105, 0.04);
  border-radius: 6px;
`

const EmojiSet = ({ category, emojiSet }) => {
  return (
    <Box>
      <H3>
        Category
        <Category>
          <CategoryName>{category}</CategoryName>
        </Category>
      </H3>
      <Container>
        <Set>{emojiSet}</Set>
      </Container>
    </Box>
  )
}

export default EmojiSet