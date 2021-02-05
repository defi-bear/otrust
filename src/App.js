import { AutoLogin } from './context/AutoLogin'
import { ThemeProvider } from 'styled-components'

import { light } from 'theme/theme'
import { GlobalStyle } from 'theme/GlobalStyle'
import NOMTrust from 'pages/NOMTrust'
import MainHeader from 'components/MainHeader'
import logo from 'assets/logo.png'

function App() {
  return (
    <AutoLogin>
      <ThemeProvider theme={light}>
        <GlobalStyle/>
        <MainHeader/>
        <NOMTrust/>
      </ThemeProvider>
    </AutoLogin>
  );
}

export default App;
