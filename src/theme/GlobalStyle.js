import { createGlobalStyle } from 'styled-components'

import GilroyRegularWoff from 'assets/fonts/Gilroy-Regular.woff'
import GilroyRegularTtf from 'assets/fonts/Gilroy-Regular.woff'
import GilroyMedium from 'assets/fonts/Gilroy-Medium.ttf'
import GilroyBold from 'assets/fonts/Gilroy-Bold.ttf'
import BebasNeueRegular from 'assets/fonts/BebasNeue-Regular.ttf'
import PoppinsRegular from 'assets/fonts/Poppins-Regular.ttf'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :root {
    color: ${props => props.theme.colors.textPrimary};
    background: linear-gradient(135deg, #16161f, #06060f);

    font-size: 14px;
    font-family: 'Poppins';
  }
  
  html, body {
    min-height: 100%;
  }

  @font-face {
    font-family: 'Bebas Neue';
    src: url('${BebasNeueRegular}') format("truetype");
  }

  @font-face {
    font-family: 'Poppins';
    src: url('${PoppinsRegular}') format("truetype");
  }

  body {
    font-family: 'Poppins', sans-serif;
    -webkit-font-smooth: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`