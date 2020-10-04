import React from 'react'
import styled from 'styled-components'
import emoji from '../../utils/emoji'
import { Box, H2, Link } from '../Styled/Styled'

const Links = styled.div`
  display: flex;
`

const Email = styled(Link)`
  background-color: #f1f1f1;

  &:hover {
    background-color: #fff;
    color: #a1a1a1;
    border: #a1a1a1 3px solid;
  }
`

const Contact = () => {
  return (
    <Box>
      <H2>{emoji('💬')} Get in Touch</H2>
      <Links>
        <Email href="mailto:team@mojiparty.io" target="blank">
          team@mojiparty.io
        </Email>
        {/* <Email
          href="https://www.notion.so/5f1502e8112c44cba7801c6a534ff462?v=c8b4869dc0314c6b97a8dd900338bf8c"
          target="blank"
        >
          Meet the Team
        </Email> */}
      </Links>
    </Box>
  )
}

export default Contact
