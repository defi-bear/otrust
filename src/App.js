import { AutoLogin } from './context/AutoLogin'
import { ThemeProvider } from 'styled-components'

import { light } from 'theme/theme'
import { GlobalStyle } from 'theme/GlobalStyle'
import NOMTrust from 'pages/NOMTrust'

function App() {
  return (
    <AutoLogin>
      <ThemeProvider theme={light}>
        <GlobalStyle/>
        <NOMTrust />
      </ThemeProvider>
    </AutoLogin>
  );
}

export default App;
