import React from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import { Panel } from "components/UI";
import { useChain } from "context/chain/ChainContext";
import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

const SidebarLayout = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  height: 240px;
  padding: 40px 48px;

  background-color: ${(props) => props.theme.colors.bgDarken};
  border-radius: 4px;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

const Avatar = styled.img`
  border-radius: 12px;
  border: 3px solid ${(props) => props.theme.colors.bgHighlightBorder};
`;

const AccountNumber = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  span {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const Balances = styled.div`
  display: flex;
  gap: 56px;

  padding: 40px;

  border-bottom: 1px solid ${(props) => props.theme.colors.bgHighlightBorder};

  strong {
    display: block;
    margin-bottom: 12px;

    font-size: 12px;
    font-weight: 400;
    color: ${(props) => props.theme.colors.textSecondary};
  }

  span {
    font-family: "Bebas Neue", sans-serif;
    font-size: 28px;
  }
`;

const Connection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 40px;
`;

const ConnectionRow = styled.div`
  display: flex;
  justify-content: space-between;

  > strong {
    font-weight: 400;
    color: ${(props) => props.theme.colors.textSecondary};
  }

  > span {
    font-weight: 500;
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  color: ${(props) => props.theme.colors.highlightGreen};
  font-weight: 500;

  &:before {
    content: "";
    display: block;

    width: 12px;
    height: 12px;

    background-color: currentColor;
    border-radius: 50%;
  }
`;

const Info = styled.footer`
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 50px 40px;
  margin-top: auto;
`;

const Link = styled.a`
  display: block;
  margin-right: auto;

  color: ${(props) => props.theme.colors.textSecondary};
  text-decoration: none;
`;

const ControlsBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  width: 40px;

  background-color: ${(props) => props.theme.colors.bgDarken};
  border: 1px solid ${(props) => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;

  font-size: 16px;
  color: ${(props) => props.theme.colors.iconsNormal};
`;

const SocialBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  width: 40px;

  background-color: ${(props) => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;

  font-size: 20px;
  color: ${(props) => props.theme.colors.iconsSecondary};
`;

export default function AcctDash() {
  const { active, error, chainId, account } = useWeb3React();
  const { ETHbalance, NOMbalance, blockNumber } = useChain();

  return (
    <Panel>
      <SidebarLayout>
        <Header>
          <HeaderControls>
            <ControlsBtn>
              <FontAwesomeIcon icon={faCog} />
            </ControlsBtn>
            <Avatar src="https://picsum.photos/72" alt="" />
            <ControlsBtn>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </ControlsBtn>
          </HeaderControls>
          <AccountNumber>
            <p>My Account</p>
            <span>
              {account === null
                ? "-"
                : account
                ? `${account.substring(0, 6)}...${account.substring(
                    account.length - 4
                  )}`
                : ""}
            </span>
          </AccountNumber>
        </Header>
        <Balances>
          <div>
            <strong>ETH Balance</strong>
            <span>
              {ETHbalance === null
                ? "Error"
                : ETHbalance
                ? `${parseFloat(formatEther(ETHbalance)).toPrecision(8)}`
                : ""}
            </span>
          </div>
          <div>
            <strong>NOM Balance</strong>
            <span>
              {NOMbalance === null
                ? "Error"
                : NOMbalance
                ? `${parseFloat(formatEther(NOMbalance)).toPrecision(8)}`
                : ""}
            </span>
          </div>

          {/* <Balance /> */}
        </Balances>
        <Connection>
          <ConnectionRow>
            <strong>Connection</strong>
            <ConnectionStatus>
              {active ? "Connected" : error ? "Error" : "Loading"}
            </ConnectionStatus>
          </ConnectionRow>
          <ConnectionRow>
            <strong>Chain Id</strong>
            <span>{chainId ?? ""}</span>
          </ConnectionRow>
          <ConnectionRow>
            <strong>Block Number</strong>
            <span>{blockNumber === null ? "Error" : blockNumber ?? ""}</span>
          </ConnectionRow>
        </Connection>
        <Info>
          <Link href="/about">About Onomy</Link>

          <SocialBtn>
            <FontAwesomeIcon icon={faLinkedin} />
          </SocialBtn>

          <SocialBtn>
            <FontAwesomeIcon icon={faTwitter} />
          </SocialBtn>
        </Info>
      </SidebarLayout>
    </Panel>
  );
}
