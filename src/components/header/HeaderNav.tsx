import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button, Collapse, Table, notification,
} from 'antd';
import { UpOutlined, WarningOutlined, RightOutlined } from '@ant-design/icons';
import { Contract, Signer } from 'ethers';
import styleCommon from '../../common/css/util.module.css';
import Store from '../../redux/index';
import styles from './css/header.module.css';
import Links from '../Links/index';
import { getDisplayBalance, roundFun } from '../../eigma-cash/format_util';
import Wallet from '../Wallet/Wallet';
import './css/header.css';
import Loading from '../loading';
import logo from '../../assets/logo-black.png';

const columns = [
  {
    title: 'N',
    dataIndex: 'N',
    width: 15,
  },
  {
    title: 'ERD',
    dataIndex: 'ERD',
    width: 50,
  },
  {
    title: 'Balances',
    dataIndex: 'Balances',
    width: 35,
  },
];

type Item = {
  key: string,
  name: string,
  amount: number,
  description: Array<{ N: number, ERD: string, Balances: number }>,
};

type State = {
  value: string;
  loading: boolean;
  dataSource: Array<Item>;
  manageBool: boolean;
};

type Props = {
  signer: Signer,
};

const { Panel } = Collapse;

const abiBonds = require('../../eigma-cash/deployments/bonds.json');

const genExtra = () => (
  <RightOutlined style={{ position: 'absolute', right: 15, bottom: -20 }}/>
);

export class HeaderNav extends Component<Props, State> {
  contracts: any;

  currentAddress: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      value: 'Connect Wallet',
      loading: true,
      dataSource: [],
      manageBool: false,
    };
    this.contracts = {};
  }

  handleRefresh = async (e: any) => {
    this.setState({
      dataSource: [],
    });
    await this.detailData().then((res) => {
      this.setState({
        dataSource: res,
      });
    });
  };

  getSubStr(str: any) {
    const subStr1 = str.substr(0, 5);
    const subStr2 = str.substr(str.length - 5, 5);
    const subStr = `${subStr1}...${subStr2}`;
    return subStr;
  }

  hide = () => {
    console.log('manage bool ', this.state.manageBool);
    this.setState({
      manageBool: false,
    });
    // this.forceUpdate();
  };

  searchBonds = (e: any) => {
    if (!this.currentAddress) {
      notification.open({
        message: 'No wallet connected',
        description: 'Please click the Connect Wallet button first',
        icon: <WarningOutlined style={{ color: '#faad14' }}/>,
      });
      return;
    }
    if (this.state.manageBool) return;
    this.setState({
      manageBool: true,
    });
  };

  initWallet = async () => {
    if (this.state.value !== 'Connect Wallet') return;

    let privateAddress = await this.props.signer.getAddress();
    this.currentAddress = privateAddress;
    if (privateAddress) {
      Store.dispatch({
        type: true,
        accountAddress: privateAddress,
      });
      privateAddress = this.getSubStr(privateAddress);
      this.setState({
        value: privateAddress,
      });
    }
    const list = await this.detailData();
    if (list) {
      this.setState({
        dataSource: list,
      });
    }
  };

  detailData = async (): Promise<Array<Item>> => {
    this.contracts.bonds = new Contract('0x5bfa4bc5Db78DC97ffBe2207CB1f4dBB502f8f5b', abiBonds, this.props.signer); // 0x5ee27377c193428BAB9F106549bb6282Dac5FE69
    const classList = await this.contracts.bonds.getClassCreated();
    const list: Array<Item> = await Promise.all(classList.map(async (item: any) => {
      const sym = await this.contracts.bonds.getBondSymbol(item);
      const nonce = await this.contracts.bonds.getNonceCreated(item);
      let amount = 0;
      const listTwo: Array<{ N: number, ERD: string, Balances: number }> = await Promise.all(nonce.map(async (nonceEl: any) => {
        let mount = await this.contracts.bonds.balanceOf(this.currentAddress, item, nonceEl);
        const info = await this.contracts.bonds.getBondInfo(item, nonceEl);
        const time = info[1].toNumber();
        const timestamp = new Date(time * 1000);
        const longtime = timestamp.toLocaleDateString().replace(/\//g, '-');
        mount = getDisplayBalance(mount, 5, 18);
        amount += parseFloat(mount);
        return {
          N: nonceEl.toNumber(),
          ERD: longtime,
          Balances: parseFloat(mount),
        };
      }));
      return {
        key: sym,
        name: sym,
        amount: roundFun(amount, 5),
        description: listTwo,
      };
    }));
    return list;
  };

  renderTable(dataSource: any) {
    return (
      <Table
        className={`tables ${styles.tables}`}
        bordered={false}
        size="small"
        tableLayout="fixed"
        showHeader
        columns={columns}
        pagination={false}
        dataSource={dataSource.description}
      />
    );
  }

  renderPanels() {
    const { dataSource } = this.state;
    const { length } = dataSource;
    if (length) {
      const panels: any[] = dataSource.map((item: Item, i: number) => (
        <Panel
          header={(
            <div style={{ display: 'inline' }}>
              <div style={{ display: 'inline' }}>{dataSource[i].name}</div>
              <div style={{ float: 'right' }}>{dataSource[i].amount}</div>
            </div>
          )}
          extra={genExtra()}
          key={item.key}
          className={`collapse ${styles.collapse_panel}`}
        >
          {' '}
          {this.renderTable(dataSource[i])}
        </Panel>
      ));
      const item = (
        <div key="buttons_container" style={{ position: 'absolute', marginTop: '15px', width: '100%' }}>
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <Button style={{ background: 'black', color: 'white' }}>Search...</Button>
            <Button style={{ background: 'black', color: 'white' }} onClick={this.hide}>
              Hide All...
              <UpOutlined/>
            </Button>
          </div>
          <div>
            <NavLink exact activeClassName={styles.active} to="/bonds/1">
              <Button style={{ background: 'black', color: 'white', width: '100%' }}>Detailed Infos...</Button>
            </NavLink>
          </div>
        </div>
      );
      panels.push(item);
      return (
        <Collapse
          bordered={false}
          accordion
          className={styles.collapse}
          expandIconPosition="right"
        >
          {panels}
        </Collapse>
      );
    }
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        accordion
        className={styles.collapse}
        expandIconPosition="right"
      >
        <Panel header="SASH" className={styles.collapse_panel} style={{ position: 'relative', height: 200 }} key={1}>
          <Loading loading={this.state.loading}/>
        </Panel>
      </Collapse>
    );
  }

  render() {
    const panels = this.renderPanels();
    return (
      <div className={`header ${styles.header} ${styleCommon.flex} ${styleCommon.fl_wrap}`}>
        <div className={styles.logoimg}>
          {/* <img src={logo} alt="" className={styles.pcLogo}/> <img src={logo} alt="" className={styles.mobileLogo}/> */}
          <img alt="logo" src={logo} width="200px" style={{ position: 'absolute', left: 0 }} />
        </div>
        <div className={styles.links}>
          {/* <Links /> */}

          <Wallet
            initWallet={this.initWallet}
            value={this.state.value}
            dataSource={this.state.dataSource}
            hide={this.hide}
            searchBonds={this.searchBonds}
            refresh={this.handleRefresh}
            manageBool={this.state.manageBool}
            panels={panels}
          />
        </div>
      </div>
    );
  }
}
