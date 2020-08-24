import { createGlobalStyle } from 'styled-components'

import AileronRegularFont from '../../fonts/Aileron-Regular.otf'
import AileronBoldFont from '../../fonts/Aileron-Bold.otf'

export default createGlobalStyle`
    @font-face {
        font-family: 'Aileron';
        src: url(${AileronRegularFont});
        font-weight: 400;
        font-style: normal;
    }
     @font-face {
        font-family: 'Aileron';
        src: url(${AileronBoldFont});
        font-weight: 700;
        font-style: normal;
        font-display: auto;
    }
`
