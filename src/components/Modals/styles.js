import styled from "styled-components";
import { darken, lighten } from "polished";

import { responsive } from "theme/constants";

export const Wrapper = styled.div`
  width: 500px;
  padding: 4px;

  position: absolute;
  top: 50%;
  left: 50%;

  background-color: ${(props) => props.theme.colors.bgNormal};
  border-radius: 8px;

  transform: translate(-50%, -50%);
  z-index: 11;

  @media screen and (max-width: ${responsive.laptop}) {
    width: 400px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    width: 100%;
    border-radius: 0;

    top: unset;
    left: 0;
    bottom: 0;

    transform: none;
  }

  main {
    padding: 32px;

    @media screen and (max-width: ${responsive.laptop}) {
      padding: 24px;
    }
  }

  footer {
    padding: 32px 36px 0;

    background-color: ${(props) => props.theme.colors.bgDarken};

    @media screen and (max-width: ${responsive.laptop}) {
      padding: 24px 24px 0;
    }
  }
`;

export const FooterControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-bottom: 32px;

  @media screen and (max-width: ${responsive.laptop}) {
    padding-bottom: 24px;
  }
`;

export const CloseIcon = styled.button`
  width: 24px;
  height: 24px;

  position: absolute;
  top: 10px;
  right: 10px;

  background: transparent;
  border: none;

  svg {
    fill: ${(props) => props.theme.colors.textThirdly};
  }

  &:hover {
    svg {
      fill: ${(props) => lighten(0.1, props.theme.colors.textThirdly)};
    }
  }
`;

export const PrimaryButton = styled.button`
  width: 170px;
  height: 50px;

  background-color: ${(props) => props.theme.colors.textPrimary};
  border: none;
  border-radius: 8px;

  color: ${(props) => props.theme.colors.bgDarken};
  font-weight: 600;
  font-size: 14px;

  @media screen and (max-width: ${responsive.laptop}) {
    width: 135px;
    height: 40px;

    font-size: 12px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 14px;
  }

  &:hover {
    background-color: ${(props) =>
    lighten(0.1, props.theme.colors.textPrimary)};
  }

  &:active {
    background-color: ${(props) => darken(0.1, props.theme.colors.textPrimary)};
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background-color: ${(props) => props.theme.colors.bgHighlightBorder};

  color: ${(props) => props.theme.colors.textPrimary};

  &:hover {
    background-color: ${(props) =>
    lighten(0.05, props.theme.colors.bgHighlightBorder)};
  }

  &:active {
    background-color: ${(props) =>
    darken(0.05, props.theme.colors.bgHighlightBorder)};
  }
`;


export const ExchangeResult = styled.div`
  padding: 32px;
  margin: 32px 0 24px;

  background-color: ${(props) => props.theme.colors.bgDarken};
  border-radius: 8px;

  font-size: 28px;
  font-weight: 500;
  text-align: center;

  @media screen and (max-width: ${responsive.laptop}) {
    padding: 24px;
    margin: 24px 0 20px;

    font-size: 24px;
  }

  sup {
    font-size: 14px;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 12px;
    }
  }
`;

export const ExchangeRateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-weight: 400;
    color: ${(props) => props.theme.colors.textThirdly};
  }

  strong {
    font-weight: 500;
  }
`;

export const Caption = styled.h3`
  margin: 0 0 24px;

  font-size: 16px;
  font-weight: 500;

  text-align: center;

  @media screen and (max-width: ${responsive.laptop}) {
    font-size: 14px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 16px;
  }
`;

export const ModalIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 88px;
  width: 88px;
  margin: 0 auto 16px;

  background-color: ${(props) => props.theme.colors.highlightGreen};
  border-radius: 50%;
  border: 6px solid #324946;

  @media screen and (max-width: ${responsive.laptop}) {
    width: 72px;
    height: 72px;
  }

  svg {
    width: 35px;
    height: 35px;

    @media screen and (max-width: ${responsive.laptop}) {
      width: 24px;
      height: 24px;
    }
  }
`;

export const DetailsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  border: none;
  background: transparent;

  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 14px;

  @media screen and (max-width: ${responsive.laptop}) {
    font-size: 12px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 14px;
  }

  svg {
    width: 20px;
    height: 20px;

    transform: ${(props) => (props.active ? "rotate(180deg)" : "rotate(0deg)")};
    transition: 0.1s ease;

    @media screen and (max-width: ${responsive.laptop}) {
      width: 16px;
      height: 16px;
    }
  }

  &:hover {
    color: ${(props) => lighten(0.05, props.theme.colors.textSecondary)};
  }

  &:active {
    color: ${(props) => darken(0.05, props.theme.colors.textSecondary)};
  }
`;

export const Spent = styled.span`
  color: ${(props) => props.theme.colors.textThirdly};
`;

export const DetailsSeparator = styled.span`
  margin: 0 20px;

  color: ${(props) => props.theme.colors.iconsNormal};
`;

export const FooterDetails = styled.div`
  padding: 32px 0;

  border-top: 1px solid ${(props) => props.theme.colors.bgHighlightBorder};
`;

export const FooterDetailsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & + & {
    margin-top: 16px;
  }

  span {
    color: ${(props) => props.theme.colors.textThirdly};
  }

  strong {
    font-weight: 500;
  }
`;

