import React from 'react'
import styled from 'styled-components'
import emoji from '../../utils/emoji'
import { Box, H2, Link } from '../Styled/Styled'

const SocialLinks = styled.div`
  display: flex;
`

const Facebook = styled(Link)`
  color: #fff;
  background-color: #1877f1;
  &:hover {
    background-color: #fff;
    color: #1877f1;
    border: #1877f1 3px solid;
  }
`

const Instagram = styled(Link)`
  color: #fff;
  background: linear-gradient(
    45deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );

  &:hover {
    background: #fff;
    color: #ce2362;
    border: #ce2362 3px solid;
  }
`

const Socials = () => {
  return (
    <Box>
      <H2> {emoji('👍')} Follow Mojiparty</H2>
      <SocialLinks>
        <Facebook href="https://www.facebook.com/mojiparty" target="blank">
          Facebook
        </Facebook>
        <Instagram href="https://www.instagram.com/mojiparty" target="blank">
          Instagram
        </Instagram>
      </SocialLinks>
    </Box>
  )
}

export default Socials
