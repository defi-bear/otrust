import { AutoLogin } from './context/AutoLogin'
import { ThemeProvider } from 'styled-components'

import { light } from 'theme/theme'
import { GlobalStyle } from 'theme/GlobalStyle'
import NOMTrust from 'pages/NOMTrust'
import MainHeader from 'components/MainHeader'
import ChainProvider from 'context/ChainContext'

function App() {
  return (
    <AutoLogin>
      <ChainProvider>
        <ThemeProvider theme={light}>
          <GlobalStyle/>
          <MainHeader/>
          <NOMTrust/>
        </ThemeProvider>
      </ChainProvider>
    </AutoLogin>
  );
}

export default App;
