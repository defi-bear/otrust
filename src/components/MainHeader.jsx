import React from "react";
import styled from "styled-components";

import logo from "assets/logo.svg";
import { Container } from "./UI";

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 160px;
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  gap: 20px;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  > strong {
    margin-bottom: 5px;

    color: ${(props) => props.theme.colors.textPrimary};
    font-family: "Bebas Neue", sans-serif;
    font-size: 32px;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;
  }

  > span {
    color: ${(props) => props.theme.colors.textThirdly};
    line-height: 1;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
`;
const HeaderInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  & + & {
    margin-left: 56px;
  }

  > strong {
    color: ${(props) => props.theme.colors.textThirdly};
    font-weight: 400;
  }
`;
const ExchangeRate = styled.div`
  display: flex;
  margin-right: 56px;
`;
const Issued = styled.div`
  padding-left: 56px;
  border-left: 1px solid ${(props) => props.theme.colors.bgHighlightBorder};
`;
const HeaderInfoItemValue = styled.div`
  > strong {
    margin-right: 12px;

    color: ${(props) => props.theme.colors.textPrimary};
    font-family: "Bebas Neue", sans-serif;
    font-size: 24px;
  }
`;
const Details = styled.span`
  color: ${(props) => {
    switch (props.type) {
      case "increase":
        return props.theme?.colors.highlightGreen;
      case "decrease":
        return props.theme?.colors.highlightRed;
      default:
        return props.theme?.colors.textPrimary;
    }
  }};
`;

export default function MainHeader(props) {
  return (
    <header>
      <Container>
        <HeaderWrapper>
          <Logo>
            <img src={logo} alt="Onomy" />
            <LogoText>
              <strong>Onomy</strong>
              <span>Bonding curve</span>
            </LogoText>
          </Logo>

          <HeaderInfo>
            <ExchangeRate>
              <HeaderInfoItem>
                <strong>NOM / USDT</strong>
                <HeaderInfoItemValue>
                  <strong>$10.12</strong>
                  <Details type="increase">24.2%</Details>
                </HeaderInfoItemValue>
              </HeaderInfoItem>
              <HeaderInfoItem>
                <strong>NOM / ETH</strong>
                <HeaderInfoItemValue>
                  <strong>0.07</strong>
                  <Details type="decrease">32.11%</Details>
                </HeaderInfoItemValue>
              </HeaderInfoItem>
            </ExchangeRate>
            <Issued>
              <HeaderInfoItem>
                <strong>NOM Issued</strong>
                <HeaderInfoItemValue>
                  <strong>14,024,810</strong>
                  <Details>/ 54,112,321</Details>
                </HeaderInfoItemValue>
              </HeaderInfoItem>
            </Issued>
          </HeaderInfo>
        </HeaderWrapper>
      </Container>
    </header>
  );
}

// I removed sticky header due to design
// I also removed header constant, because in this case it will be easier to control sizings in SC, it will be a cleaner way and since it doesn't have to be reused, there is no point to extract the values
