import { AutoLogin } from './context/AutoLogin'
import { ThemeProvider } from 'styled-components'

import { dark } from 'theme/theme'
import { GlobalStyle } from 'theme/GlobalStyle'
import NOMTrust from 'pages/NOMTrust'
import MainHeader from 'components/MainHeader'
import ChainProvider from 'context/chain/ChainContext'

function App() {
  return (
    <AutoLogin>
      <ChainProvider theme={dark}>
        <ThemeProvider theme={dark}>
          <GlobalStyle/>
          <MainHeader/>
          <NOMTrust/>
        </ThemeProvider>
      </ChainProvider>
    </AutoLogin>
  );
}

export default App;
