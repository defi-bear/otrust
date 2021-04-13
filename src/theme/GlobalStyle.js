import { createGlobalStyle } from 'styled-components'

import BebasNeueBold from 'assets/fonts/BebasNeueBold.ttf'
import BebasNeueBook from 'assets/fonts/BebasNeueBook.ttf'
import BebasNeueRegular from 'assets/fonts/BebasNeueRegular.ttf'
import { responsive } from './constants'

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
  
    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 12px;
    }
  }
  
  html, body {
    min-height: 100%;
  }

  button {
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  @font-face {
    font-family: 'Bebas Neue';
    font-weight: 300;
    src: url('${BebasNeueBook}') format("truetype");
  }

  @font-face {
    font-family: 'Bebas Neue';
    font-weight: 400;
    src: url('${BebasNeueRegular}') format('truetype');
  }
  
  @font-face {
    font-family: 'Bebas Neue';
    font-weight: 600;
    src: url('${BebasNeueBold}') format("truetype");
  }

  body {
    position: relative;
    
    font-family: 'Poppins', sans-serif;
    -webkit-font-smooth: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`