import styled from "styled-components";

import { responsive } from "theme/constants";

import { Panel } from "components/UI";
import Chart from "components/Chart/Chart";
import Exchange from "components/Exchange/Exchange"


const ContentLayout = styled.div`
  display: grid;
  grid-template-rows: 550px auto;

  @media screen and (max-width: ${responsive.laptop}) {
    grid-template-rows: 400px auto;
  }
`;

export default function Bonding() {

  return (
    <Panel>
      <ContentLayout>
        <Chart />
        <Exchange />
      </ContentLayout>
    </Panel>
  );
}
