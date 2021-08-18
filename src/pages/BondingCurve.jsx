import styled from 'styled-components';
import Sidebar from 'components/Sidebar/Sidebar';
import Bonding from 'components/Bonding';
import { Steps } from 'intro.js-react';

import { Container } from 'components/UI';
import { responsive } from 'theme/constants';

const BondingCurveLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 375px;
  gap: 6px;

  @media screen and (max-width: ${responsive.laptop}) {
    grid-template-columns: 1fr 290px;
  }

  @media screen and (max-width: ${responsive.laptopSmall}) {
    // grid-template-columns: 1fr 250px;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    display: flex;
    flex-direction: column-reverse;
    grid-template-columns: none;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    gap: 0;
    flex-direction: column;

    padding: 0;
  }
`;

const StyledSteps = styled(Steps)`
  background-color: tomato !important;

  & > .introjs-helperLayer {
    box-shadow: rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgba(15, 15, 25, 0.9) 0px 0px 0px 5000px,
      inset rgba(255, 221, 160, 1) 0 0 0 3px, rgb(255, 221, 161) 0px 0px 50px 10px !important;

    border-radius: 8px;
  }
`;

export default function BondingCurve() {
  return (
    <Container>
      <BondingCurveLayout>
        <StyledSteps
          enabled={true}
          options={{ showBullets: false }}
          steps={[
            {
              title: 'Welcome to Onomy Bonding Curve',
              intro: `<p>
                        Delightful unreserved impossible few estimating men favourable see entreaties. She propriety immediate was improving. He or entrance humoured likewise moderate. Much nor game son say feel. Fat make met can must form into gate. Me we offending prevailed discovery.
                      </p>

                      <p>
                        Of friendship on inhabiting diminution discovered as. Did friendly eat breeding building few nor.
                      </p>`,
            },
            {
              title: 'Account Panel',
              intro:
                '<p>Here you can view your ETH and wNOM balances. You also can <strong>Withdraw wNOM</strong> to your Onomy wallet (and create one) from here.</p>',
              element: '#tour-sidebar',
            },
            {
              title: 'Prices / Stats',
              intro: 'The current price of NOM and the amount of NOM that has been issued can be viewed here.',
              element: '#tour-prices',
            },
            {
              title: 'Buying wNOM',
              intro:
                'Enter the amount of ETH you would like to use to purchase NOM here. A 1% fee will be applied per trade.',
              element: '#tour-buy',
            },
            {
              title: 'Selling wNOM',
              intro: `Enter the amount of NOM you would like to sell here. A 1% fee will be applied per trade.`,
              element: '#tour-sell',
            },
          ]}
          initialStep={0}
          onExit={() => {
            console.log('off');
          }}
        />
        <Bonding />
        <Sidebar />
      </BondingCurveLayout>
    </Container>
  );
}
