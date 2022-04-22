import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Card, Button } from "antd";
import { networks } from './utils/networks';
// import contractAbi from "./utils/contractAbi.json"


const { Meta } = Card;
const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [network, setNetwork] = useState('');
  

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const handleWalletConnect = () => {
    setIsLoading(true);
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("get metamask, https://metamask.io/")
    } else {
      console.log("ethereum obj", ethereum)
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("account",account)
      setCurrentAccount(account)

    } else {
      console.log("No authorised accounts found !")
    }

    const chainId = await ethereum.request({method:"eth_chainId"})
    console.log("chainId",networks[chainId])
    setNetwork(networks[chainId])

    ethereum.on("chainChanged", handlChainChanged);

    function handlChainChanged(_chainId){
      window.location.reload()
    }

  }

  const connectWallet = async () => {
    console.log("connectWallet")
    setIsLoading(!isLoading)
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("get metamask, https://metamask.io/")
        return;
      } else {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length !== 0) {
          const account = accounts[1];
          console.log("Connected with -->", accounts[0]);
          setCurrentAccount(account)
        }
      }
    } catch (error) {
      console.log("error while connecting wallet", error)
      setIsLoading(false)
    }
  }

  const renderNotConnectedContainer = () => {
    return (
      <div className="center-cont">
        <div className="center-child">
          <Button className="connect-btn" type="primary" shape="round" size="large" loading={isLoading} onClick={ connectWallet}>Connect Wallet</Button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <header>
        <div className="header-logo-wallet">
          <div className="logo">
            web3 game
          </div>
          <div className="wallet">
            <a href="https://www.google.com" target="_blank">
              <Card
                hoverable
                cover={
                  <div style={{ overflow: "hidden", height: "100px" }}>
                    <img
                      alt="example"
                      style={{ height: "100%" }}
                      src={network.includes("Polygon") ?  "https://cryptologos.cc/logos/polygon-matic-logo.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/628px-Ethereum_logo_2014.svg.png"}
                    />
                  </div>
                }
              >
                <Meta title={currentAccount ? (`wallet :  ${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}`) : ("Wallet Not Connected")} description="" />
              </Card>
            </a>
          </div>
        </div>
      </header>
      {!currentAccount && renderNotConnectedContainer()}

    </div>
  )
}
export default LandingPage;