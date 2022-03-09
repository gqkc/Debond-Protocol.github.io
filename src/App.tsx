import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import {
  BrowserRouter as Router, Link, Route, Switch,
} from 'react-router-dom';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Bank as Banks } from './views/bank/Bank';
import { Gov } from './views/gov/Gov';
import { Bonds } from './views/bonds/Bonds';
import Ref from './views/ref/Ref';
import 'antd/dist/antd.css';
import { HeaderNav } from './components/header/HeaderNav';
import { Footers } from './components/footer/Footer';
import styles from './views/bank/css/bank.module.css';
import './App.css';

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
    console.log('Unsupported Ethereum network! Please, make sure you are on Main or Ropsten net.');
    return null;
  };

  render() {
    return (
      <Router>
        <Layout className="container">
          <Layout.Header style={{
            position: 'relative',width: '100%', height:150
          }}
          >
            <Menu  mode="horizontal" style={{ backgroundColor: 'transparent' }}>
              <div className={styles.header}>
                <HeaderNav
                  signer={this.state.provider}/>
              </div>
            </Menu>
          </Layout.Header>
          <Layout className="container_main">
            <Layout.Sider
              className="sider leftSider"
              style={{ fontFamily: 'Inter', backgroundColor: 'transparent'}}>
              <Menu
                theme="dark"
                defaultSelectedKeys={['1']}
                mode="inline"
                style={{ color: '#7A7A7A', backgroundColor: 'transparent' }}
              >
                <Menu.Item key="1">
                  <Link to="/bank">
                    <span>Bank</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/gov">
                    <span>Gov</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/bonds">
                    <span>Bonds</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/loan">
                    <span>Loan</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link to="/ref">
                    <span>Ref</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Layout.Sider>
            <Content style={{ padding: '0 0px',  marginLeft: 30, marginRight: 50 }}>
              <Switch>
                <Route path="/bank">
                  <Banks provider={this.state.provider} web3={this.state.web3} config={this.state.config}/>
                </Route>
                <Route path="/gov">
                  <Gov provider={this.state.provider} web3={this.state.web3} config={this.state.config}/>
                </Route>
                <Route path="/bonds">
                  <Bonds provider={this.state.provider}/>
                </Route>
                <Route path="/loan">
                  <Loan provider={this.state.provider}/>
                </Route>
                <Route path="/ref">
                  <Ref provider={this.state.provider}/>
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
