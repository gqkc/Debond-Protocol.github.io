import React, { Component } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Bank as Banks } from './views/bank/Bank';
import { Gov } from './views/gov/Gov';
import { Bonds } from './views/bonds/Bonds';
import Ref from './views/ref/Ref';
import './App.css';
import 'antd/dist/antd.css';
import { HeaderNav } from './components/header/HeaderNav';
import { Footers } from './components/footer/Footer';
import styles from './views/bank/css/bank.module.css';
import Info from './views/info/Info';
import Loan from './views/Loan/Loan';
import { Config, getConfigForNet } from './config';

type State = {
  provider: any,
  web3: Web3 | null,
  config: Config | null,
};

type Props = any;
const { Content } = Layout;

export class App extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      provider: null,
      web3: null,
      config: null,
    };
  }

  componentDidMount() {
    this.initWeb3Provider().then((provider: any) => {
      const web3 = new Web3(provider);
      const web3Provider = new ethers.providers.Web3Provider(provider);
      this.getConfig(web3).then((config: Config | null) => {
        this.setState({
          web3,
          provider: web3Provider.getSigner(),
          config,
        });
      });
    });
  }

  initWeb3Provider = async (): Promise<any> => {
    let web3Provider;
    const windowNew = window as any;
    if (windowNew.ethereum) {
      web3Provider = windowNew.ethereum;
      try {
        // Requesting user Authorization
        await windowNew.ethereum.enable();
      } catch (error) {
        // The user is not authorized
        console.error('User denied account access');
        return null;
      }
    } else if (windowNew.web3) {
      // original MetaMask Legacy dapp browsers...
      web3Provider = windowNew.web3.currentProvider;
    } else {
      alert('It is detected that there is no metamask plug-in in the current browser!');
      web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    return web3Provider;
  };

  getConfig = async (web3: Web3 | null): Promise<Config | null> => {
    const netId: string | undefined = await web3?.eth.net.getNetworkType();
    console.log('NETWORK_ID: ', netId);
    if (netId === 'main' || netId === 'ropsten') {
      return getConfigForNet(netId);
    }
    console.error('Unsupported Ethereum network! Please, make sure you are on Main or Ropsten net.');
    return null;
  };

  render() {
    if (this.state.web3 && this.state.provider && this.state.config) {
      return (
        <Layout className="container_main">
          <Content>
            <Router basename="/">
              <Switch>
                <Route path="/" exact>
                  <Info />
                </Route>
                <Route path="/bank">
                  <div className={styles.header}><HeaderNav signer={this.state.provider} /></div>
                  <Banks provider={this.state.provider} web3={this.state.web3} config={this.state.config} />
                </Route>
                <Route path="/gov">
                  <div className={styles.header}><HeaderNav signer={this.state.provider} /></div>
                  <Gov provider={this.state.provider} web3={this.state.web3} config={this.state.config} />
                </Route>
                <Route path="/bonds">
                  <div className={styles.header}><HeaderNav signer={this.state.provider} /></div>
                  <Bonds provider={this.state.provider} />
                </Route>
                <Route path="/loan">
                  <div className={styles.header}><HeaderNav signer={this.state.provider} /></div>
                  <Loan provider={this.state.provider} />
                </Route>
                <Route path="/ref">
                  <div className={styles.header}><HeaderNav signer={this.state.provider} /></div>
                  <Ref provider={this.state.provider} />
                </Route>
              </Switch>
              <Footers />
            </Router>
          </Content>
        </Layout>
      );
    }
    // TODO: add UI
    return null;
  }
}

export default App;
