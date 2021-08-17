import React, { useState } from 'react';

import { BuyButton, SellButton, ExchangeWrapper } from './exchangeStyles';
import ExchangeQuote from './ExchangeQuote';
import BuywNomMobile from './BuywNomMobile';
import SellwNomMobile from './SellwNomMobile';

export default function Exchange() {
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);

  return (
    <ExchangeWrapper>
      <ExchangeQuote strength="strong" />
      <ExchangeQuote strength="weak" />
      <BuyButton onClick={() => setShowBuy(true)}>Buy wNOM</BuyButton>
      <SellButton onClick={() => setShowSell(true)}>Sell wNOM</SellButton>
      {showBuy && <BuywNomMobile closeModalClickHandler={() => setShowBuy(false)} />}
      {showSell && <SellwNomMobile closeModalClickHandler={() => setShowSell(false)} />}
    </ExchangeWrapper>
  );
}
