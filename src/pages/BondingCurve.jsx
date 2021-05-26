import styled from "styled-components";
import ExchangeProvider from "context/ExchangeContext";

// Components
import AcctDash from "components/AcctDash";
import Bonding from "components/Bonding";
import { Container } from "components/UI";
import { responsive } from "theme/constants";

// import { Dimmer } from "components/UI/Dimmer";
// import BridgeSwapModal from "components/Modals/BridgeSwapModal";
// import BridgeSwapMobile from "components/Modals/BridgeSwapMobile";
// import BridgeSwapModalDisconnected from "components/Modals/BridgeSwapModalDisconnected";
// import TransactionCompletedModal from "components/Modals/TransactionCompletedModal";
// import TransactionFailedModal from "components/Modals/TransactionFailedModal";
// import OnomyConfirmationModal from "components/Modals/OnomyConfirmationModal";
// import ConfirmTransactionModal from "components/Modals/ConfirmTransactionModal";

const BondingCurveLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 375px;
  gap: 6px;

  padding-bottom: 150px;

  @media screen and (max-width: ${responsive.laptop}) {
    grid-template-columns: 1fr 290px;
  }

  @media screen and (max-width: ${responsive.laptopSmall}) {
    grid-template-columns: 1fr 250px;
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

export default function BondingCurve() {
  return (
    <Container>
      {/* <Dimmer>
        <BridgeSwapModal />
      </Dimmer> */}
      {/* <BridgeSwapModalDisconnected /> */}
      {/* <OnomyConfirmationModal /> */}
      {/* <TransactionFailedModal /> */}
      {/* <TransactionCompletedModal /> */}
      {/* <ConfirmTransactionModal /> */}
      {/* <BridgeSwapMobile /> */}

      <ExchangeProvider>
        <BondingCurveLayout>
          <AcctDash />
          
        </BondingCurveLayout>
      </ExchangeProvider>
    </Container>
  );
}
