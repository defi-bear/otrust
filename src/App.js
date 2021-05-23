import { ThemeProvider } from 'styled-components'

import { darkNew } from 'theme/theme'
import { GlobalStyle } from 'theme/GlobalStyle'
import MainHeader from 'components/MainHeader'
import { AutoLogin } from 'context/AutoLogin'
import ChainProvider from 'context/chain/ChainContext'
import ModalProvider from 'context/modal/ModalContext'
import BondingCurve from 'pages/BondingCurve'
import ContractProvider from 'context/chain/ContractContext'


function App() {
  return (
    <ThemeProvider theme={darkNew}>
      <AutoLogin>
        <ChainProvider theme={darkNew}>
          <ContractProvider>
            <ModalProvider>
              <GlobalStyle />
              <MainHeader />
              <BondingCurve />
            </ModalProvider >
          </ContractProvider>
        </ChainProvider>
      </AutoLogin>
    </ThemeProvider>
  );
}

export default App;
