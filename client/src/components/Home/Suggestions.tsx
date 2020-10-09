import React from 'react'
import styled from 'styled-components'
import emoji from '../../utils/emoji'
import { Box, H2, Link } from '../Styled/Styled'

const Links = styled.div`
  display: flex;
`

const Email = styled(Link)`
  background-color: #f1f1f1;
  width: 100%;
  &:hover {
    background-color: #fff;
    color: #a1a1a1;
    border: #a1a1a1 3px solid;
  }
`

const Contact = () => {
  return (
    <Box>
      <H2>{emoji('💡')}Feeling creative?</H2>
      <Links>
        <Email href="https://forms.gle/sWkGHGLtb78iKaHH6" target="blank">
          Submit your own Emoji Set
        </Email>
      </Links>
    </Box>
  )
}

export default Contact
