import { ThemeProvider } from 'styled-components'

import { darkNew } from 'theme/theme'
import { GlobalStyle } from 'theme/GlobalStyle'
import MainHeader from 'components/MainHeader'
import { AutoLogin } from 'context/AutoLogin'
import ChainProvider from 'context/chain/ChainContext'
import ExchangeProvider from 'context/exchange/ExchangeContext'
import ModalProvider from 'context/modal/ModalContext'
import BondingCurve from 'pages/BondingCurve'


function App() {
  return (
    <ThemeProvider theme={darkNew}>
      <AutoLogin>
        <ChainProvider theme={darkNew}>
            <ExchangeProvider>
              <ModalProvider>
                <GlobalStyle />
                <MainHeader />
                <BondingCurve />
              </ModalProvider >
            </ExchangeProvider>
        </ChainProvider>
      </AutoLogin>
    </ThemeProvider>
  );
}

export default App;
