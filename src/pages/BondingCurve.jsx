import styled from "styled-components";
import SwapProvider from "context/SwapContext";

// Components
import AcctDash from "components/AcctDash";
import D3Chart from "components/Chart/D3Chart";
import { Container } from "components/UI";

const BondingCurveLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 375px;
  gap: 6px;

  padding-bottom: 150px;
`;

export default function BondingCurve() {
  return (
    <Container>
      <BondingCurveLayout>
        <SwapProvider>
          <D3Chart />
          <AcctDash />
        </SwapProvider>
      </BondingCurveLayout>
    </Container>
  );
}
