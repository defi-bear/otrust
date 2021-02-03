import { createGlobalStyle } from 'styled-components'
import GilroyRegularWoff from 'assets/fonts/Gilroy-Regular.woff'
import GilroyRegularTtf from 'assets/fonts/Gilroy-Regular.woff'
import GilroyMedium from 'assets/fonts/Gilroy-Medium.ttf'
import GilroyBold from 'assets/fonts/Gilroy-Bold.ttf'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :root {
    color: ${props => props.theme.colors.fontColor};
    background-color: ${props => props.theme.colors.background};

    font-size: 100%;
    font-family: 'Gilroy';

    @media (min-width: 768px) {
      font-size: 112.5%;
    }

    @media (min-width: 1920px) {
      font-size: 125%;
    }

    @media (min-width: 2560px) {
      font-size: 150%;
    }
  }
  @font-face {
    font-family: 'Gilroy';
    font-weight: 400;
    src: 
      url('${GilroyRegularWoff}') format("woff"),
      url('${GilroyRegularTtf}') format("true-type");
  }

  @font-face {
    font-family: 'Gilroy';
    font-weight: 500;
    src: url('${GilroyMedium}') format("truetype");
  }

  @font-face {
    font-family: 'Gilroy';
    font-weight: 600;
    src: url('${GilroyBold}') format("truetype");
  }

  body {
    font-family: 'Gilroy';
    -webkit-font-smooth: antialiased;
  }
`