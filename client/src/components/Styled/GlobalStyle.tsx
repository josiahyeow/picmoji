import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
    input:focus,
    select:focus,
    textarea:focus,
    button:focus {
        outline: none;
    }
`
