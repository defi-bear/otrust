import { ThemeProvider } from 'styled-components'

import { darkNew } from 'theme/theme'
import { GlobalStyle } from 'theme/GlobalStyle'
import MainHeader from 'components/MainHeader'
import { AutoLogin } from 'context/AutoLogin'
import ChainProvider from 'context/chain/ChainContext'
import BondingCurve from 'pages/BondingCurve'


function App() {
  return (
    <AutoLogin>
      <ChainProvider theme={darkNew}>
        <ThemeProvider theme={darkNew}>
          <GlobalStyle />
          <MainHeader />
          <BondingCurve />
        </ThemeProvider>
      </ChainProvider>
    </AutoLogin>
  );
}

export default App;
