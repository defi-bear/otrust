import { ThemeProvider } from 'styled-components';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/client';
import { render } from '@testing-library/react';
import { BigNumber } from 'bignumber.js';

import { darkNew } from 'Theme/theme';
import { ChainContext } from '../context/chain/ChainContext';
import { ExchangeContext } from '../context/exchange/ExchangeContext';
import { ModalContext } from '../context/modal/ModalContext';
import { UpdateExchangeContext } from '../context/exchange/ExchangeContext';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

export const renderWithTheme = (Component, props, children) => {
  if (children) {
    return render(
      <ThemeProvider theme={darkNew}>
        <Component {...props}>{children}</Component>
      </ThemeProvider>,
    );
  }
  return render(
    <ThemeProvider theme={darkNew}>
      <Component {...props} />
    </ThemeProvider>,
  );
};

export const ThemeWrapper = (Component, props, children) => {
  return (
    <ThemeProvider theme={darkNew}>
      <Component {...props}>{children}</Component>
    </ThemeProvider>
  );
};

export const ChainContextWrapper = (children, contextProps) => {
  return (
    <ChainContext.Provider
      value={{
        blockNumber: new BigNumber(0),
        currentETHPrice: new BigNumber(0),
        currentNOMPrice: new BigNumber(0),
        NOMallowance: new BigNumber(0),
        strongBalance: new BigNumber(0),
        supplyNOM: new BigNumber(0),
        weakBalance: new BigNumber(0),
        ...contextProps,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export const ExchangeContextWrapper = (children, contextProps) => {
  return (
    <ExchangeContext.Provider
      value={{
        askAmount: new BigNumber(0),
        bidAmount: new BigNumber(0),
        bidDenom: 'strong',
        status: 'Not Approved',
        strong: 'ETH',
        weak: 'NOM',
        ...contextProps,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const UpdateExchangeContextWrapper = (children, contextProps) => {
  return (
    <UpdateExchangeContext.Provider
      value={{ objDispatch: () => {}, strDispatch: () => {}, setInputPending: false, ...contextProps }}
    >
      {children}
    </UpdateExchangeContext.Provider>
  );
};

export const ModalContextWrapper = (children, contextProps) => {
  return (
    <ModalContext.Provider
      value={{ handleModal: () => {}, modal: false, modalContent: 'Modal Content', ...contextProps }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const renderWithContext = (Component, props) => {
  return render(
    <ThemeProvider theme={darkNew}>
      <ApolloProvider client={client}>
        <ChainContext.Provider value={{ supplyNOM: new BigNumber(0), theme: darkNew }}>
          <UpdateExchangeContext.Provider
            value={{ objDispatch: jest.fn(), strDispatch: jest.fn(), setInputPending: false }}
          >
            <ExchangeContext.Provider
              value={{
                askAmount: new BigNumber(0),
                bidAmount: new BigNumber(0),
                bidDenom: 'strong',
                status: 'Not Approved',
                strong: 'ETH',
                weak: 'NOM',
              }}
            >
              <ModalContext.Provider value={{ handleModal: jest.fn(), modal: false, modalContent: 'Modal Content' }}>
                <Component {...props} />
              </ModalContext.Provider>
            </ExchangeContext.Provider>
          </UpdateExchangeContext.Provider>
        </ChainContext.Provider>
      </ApolloProvider>
    </ThemeProvider>,
  );
};
