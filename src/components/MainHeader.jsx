import React from "react";
import styled from "styled-components";

import logo from "assets/logo.svg";
import { Container } from "./UI";
import { responsive } from "theme/constants";

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 160px;
  width: 100%;

  @media screen and (max-width: ${responsive.laptop}) {
    height: 90px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    height: auto;
    padding: 20px;

    background-color: ${(props) => props.theme.colors.bgNormal};
  }
`;

const Logo = styled.div`
  display: flex;
  gap: 20px;
`;

const LogoImg = styled.img`
  @media screen and (max-width: ${responsive.laptop}) {
    height: 50px;
    width: 40px;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }

  > strong {
    margin-bottom: 5px;

    color: ${(props) => props.theme.colors.textPrimary};
    font-family: "Bebas Neue", sans-serif;
    font-size: 32px;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 20px;
    }
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

  @media screen and (max-width: ${responsive.laptop}) {
    gap: 5px;
  }

  & + & {
    margin-left: 56px;

    @media screen and (max-width: ${responsive.laptop}) {
      margin-left: 32px;
    }
  }

  > strong {
    color: ${(props) => props.theme.colors.textThirdly};
    font-weight: 400;

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 10px;
    }
  }
`;

const ExchangeRate = styled.div`
  display: flex;
  margin-right: 56px;

  @media screen and (max-width: ${responsive.laptop}) {
    margin-right: 32px;
  }
`;

const Issued = styled.div`
  padding-left: 56px;
  border-left: 1px solid ${(props) => props.theme.colors.bgHighlightBorder};

  @media screen and (max-width: ${responsive.laptop}) {
    padding-left: 32px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding: 0;

    border: none;
  }
`;

const HeaderInfoItemValue = styled.div`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column;

    gap: 5px;
  }

  > strong {
    margin-right: 12px;

    color: ${(props) => props.theme.colors.textPrimary};
    font-family: "Bebas Neue", sans-serif;
    font-size: 24px;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 20px;
    }

    @media screen and (max-width: ${responsive.smartphoneLarge}) {
      font-size: 18px;
    }
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
            <LogoImg src={logo} alt="Onomy" />
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
