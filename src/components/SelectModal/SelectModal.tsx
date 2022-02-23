import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Button, Col, Collapse, Input, Modal, ModalProps, notification, Row, Slider, Table, Tabs,
} from 'antd';
import { PlusOutlined, WarningOutlined } from '@ant-design/icons';
import { BigNumber, Contract } from 'ethers';
import { inspect } from 'util';
import { NavLink } from 'react-router-dom';
import { setState } from 'jest-circus/build/state';
import moment from 'moment';
import config from '../../config-test';
import ProductonConfig from '../../config-production';
import abiTest from '../../eigma-cash/deployments/bankTest.json';
import './css/selectModal.css';
import styles from './css/selectmodal.module.css';
import { Close, Refresh } from '../Icon/Icon';
import { bar_styles, make_bar } from '../../eigma-cash/format_util';
import IconFont from '../IconFont/IconFont';
import dexTest from '../../eigma-cash/deployments/dexTest.json';
import commonStyles from '../../common/css/util.module.css';
import Loading from '../loading';

const address = config.externalTokens.BANKTEST[0];

const TAKE_OVER_BUTTON = (value: string) => {
  switch (value.toLowerCase()) {
    case 'dex':
      value = 'Take Order';
      break;
    case 'wallet':
      value = 'Redeem';
      break;
    case 'order':
      value = 'Create';
      break;
  }
  return value;
};

const column = [
  {
    title: 'Nonce',
    dataIndex: 'nonce',
    width: 100,
  },
  {
    title: 'ETA',
    dataIndex: 'eta',
    width: 100,
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    width: 200,
  },
  {
    title: 'IN DBIT',
    dataIndex: 'inSASH',
    width: 100,
  },
  {
    title: 'IN USD',
    dataIndex: 'inUSD',
    width: 100,
  },
];
const LOANABI = require('../../eigma-cash/testAbi/LOAN.json');

interface Props extends ModalProps {
  provider:any
  type:string
  titleSub:string
  onNewOrder?: any,
}

class SelectModal extends Component<Props> {
  private address: string = ProductonConfig.externalTokens.dexTest[0];

  content = {
    current: null,
  };

  state = {
    inputValue: 0,
    currKey: '1',
    tableTit: [],
    content: [],
    erc20LoanTit: [],
    erc20LoanData: [],
    nftData: [],
    loading: true,
    nftTit: [],
    spinning: false,
    searchString: undefined,
    isApprove: false,
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
    this.getTableTitle();
    this.getData();
    // this.props.type === "dex" && this.state.currKey == '2' && this.getERC20LoanAuction();
    if (this.props.type === 'dex') {
    }
    this.state.currKey == '2' && this.getERC20Loan();
    this.props.type === 'dex' && this.getERC20LoanAuction();
    this.props.type === 'wallet' && this.getWalletERC20LoanAuction();
  }

  public getData = async () => {
    this.setState({
      loading: true,
    });
    const Bank = new Contract(address, abiTest, this.props.provider);
    // const result = await Bank.getBondsDexColumns();
    // const content = await Bank.getBondsDexData();
    const erc20LoanContent = await Bank.getBondsDexErc20LoanData();
    const erc20LoanTit = await Bank.getBondsDexErc20LoanColumns();
    const nftTit = await Bank.getBondsDexNFTColumns();
    const nftData = await Bank.getBondsDexNFTData();
    console.log(JSON.parse(erc20LoanContent));
    this.setState({
      loading: false,
      // content: JSON.parse(content),
      // erc20LoanData: JSON.parse(erc20LoanContent),
      // erc20LoanTit:erc20LoanTit,
      nftData: JSON.parse(nftData),
      // nftTit
    });
  };

  public getTableTitle = async () => {
    const Bank = new Contract(address, abiTest, this.props.provider);
    const erc20LoanTit = await Bank.getBondsDexErc20LoanColumns();
    const nftTit = await Bank.getBondsDexNFTColumns();

    this.setState({
      erc20LoanTit,
      nftTit,
    });
  };

  public getERC20Loan = async () => {
    this.setState({
      loading: true,
    });
    this.props.type === 'wallet' && await this.walletGetERC20Loan();
    this.setState({
      loading: false,
    });
  };

  public walletGetERC20Loan = async () => {
    if (!this.props.provider) return;
    this.setState({
      loading: true,
    });
    const currentAddress = this.props.provider.getAddress();
    const bank = new Contract(this.address, dexTest, this.props.provider);
    const isActive = await bank.contract_is_active();
    !isActive && await bank.isActive(true);
    const result = await bank.getERC20LoanSuccess(currentAddress);
    this.setState({
      erc20LoanData: result,
      loading: false,
    });
  };

  getDurationString = (duration: number): string => {
    const seconds = duration;
    let minuteTime;
    let secondTime;
    let hourTime;
    let results = '';
    if (seconds > 0) {
      // minutes
      minuteTime = Math.trunc(seconds / 60);
      secondTime = Math.trunc(seconds % 60);
      if (secondTime > 0) {
        results = `${secondTime}S`;
      }
      if (minuteTime > 0) {
        // Minutes greater than zero
        hourTime = Math.trunc(minuteTime / 60);
        // Real Minutes
        minuteTime = Math.trunc(minuteTime % 60);

        if (minuteTime > 0) {
          results = `${minuteTime}M${secondTime}S`;
        }
        if (hourTime > 0) {
          results = `${hourTime}H${minuteTime}M`;
        }
      }
    }
    return results;
  };

  getERC20LoanAuction = async (curKey?: number) => {
    if (!this.props.provider) return;
    this.setState({
      loading: true,
    });
    const loan = new Contract(ProductonConfig.testAddress.Loan[0], LOANABI, this.props.provider);
    console.log('currency key = ', this.state.currKey);
    const cKey = curKey || this.state.currKey;
    const key = Number(cKey) === 1 ? 0 : 1;
    console.log('请求的key = ', key);
    const result = await loan.getDEXInfo(key);
    const Bank = new Contract(address, abiTest, this.props.provider);
    const tableTit = await Bank.getBondsDexColumns();
    const content = await Bank.getBondsDexData();
    const nftData = await Bank.getBondsDexNFTData();
    console.log('RESULT = ', result);
    await this.getTableTitle();
    const res = [];
    if (key === 0) {
      for (const element of result) {
        if (element.auctionStatus) {
          res.push({
            id: element.auctionTimestamp.toNumber(),
            symbol: element.assetsName,
            progress: 40,
            faceValue: '20%',
            endedIn: this.getDurationString(element.auctionDuration.toNumber()),
            price: element.startingPrice.toNumber(),
            list: JSON.parse(content).list,
          });
        }
      }
    } else if (key === 1) {
      for (const element of result) {
        const dueDate = element.auctionTimestamp.add(element.loanDuration).toNumber();

        if (!element.assetsName || element.assetsAmount.toNumber() <= 0) continue;
        res.push({
          id: element.auctionTimestamp.toNumber(),
          symbol: element.assetsName,
          balance: `${element.assetsAmount.toNumber()} ${element.assetsName.toUpperCase()}`,
          Loan: element.startingPrice.toNumber(),
          IR: element.interestRate.toNumber(),
          DueDate: moment(dueDate).format('YYYY-MM-DD'),
          EndedIn: this.getDurationString(element.auctionDuration.toNumber()),
          price: element.startingPrice.toNumber(),
          list: JSON.parse(nftData)[0]?.list,
        });
      }
    }
    console.log('生成的data数 = ', res);
    this.state.currKey == '1' ? this.setState({ content: res }) : this.setState({ erc20LoanData: res });
    this.setState({
      tableTit,
      loading: false,
    });
  };

  getWalletERC20LoanAuction = async (curKey?: number) => {
    if (!this.props.provider) return;
    this.setState({
      loading: true,
    });
    const loan = new Contract(ProductonConfig.testAddress.Loan[0], LOANABI, this.props.provider);
    console.log('WALLET currency key = ', this.state.currKey);
    const cKey = curKey || this.state.currKey;
    const key = Number(cKey) === 1 ? 0 : 1;
    console.log(' WALLET 请求的key = ', key);
    const result = await loan.getWalletInfo(key);
    const Bank = new Contract(address, abiTest, this.props.provider);
    const tableTit = await Bank.getBondsDexColumns();
    const content = await Bank.getBondsDexData();
    const nftData = await Bank.getBondsDexNFTData();
    console.log('WALLET RESULT = ', result);
    await this.getTableTitle();
    const res = [];
    if (key === 0) {
      for (const element of result) {
        if (!element.auctionStatus && element.seller == this.props.provider.getAddress()) {
          res.push({
            id: element.auctionTimestamp.toNumber(),
            symbol: element.assetsName,
            progress: 40,
            faceValue: '20%',
            endedIn: this.getDurationString(element.auctionDuration.toNumber()),
            price: element.startingPrice.toNumber(),
            list: JSON.parse(content).list,
          });
        }
      }
    } else if (key === 1) {
      for (const element of result) {
        const dueDate = element.auctionTimestamp.add(element.loanDuration).toNumber();

        if (!element.assetsName || element.assetsAmount.toNumber() <= 0) continue;
        res.push({
          id: element.auctionTimestamp.toNumber(),
          symbol: element.assetsName,
          balance: `${element.assetsAmount.toNumber()} ${element.assetsName.toUpperCase()}`,
          Loan: element.startingPrice.toNumber(),
          IR: element.interestRate.toNumber(),
          DueDate: moment(dueDate).format('YYYY-MM-DD'),
          EndedIn: this.getDurationString(element.auctionDuration.toNumber()),
          price: element.startingPrice.toNumber(),
          list: JSON.parse(nftData)[0]?.list,
        });
      }
    }
    console.log('WALLET 生成的data数 = ', res);
    this.state.currKey == '1' ? this.setState({ content: res }) : this.setState({ erc20LoanData: res });
    this.setState({
      tableTit,
      loading: false,
    });
  };

  public approve = async () => {
    const currentAddress = await this.props.provider.getAddress();
    if (!currentAddress) {
      notification.open({
        message: 'No wallet connected',
        description: 'Please click the Connect Wallet button first',
        icon: <WarningOutlined style={{ color: '#faad14' }} />,
      });
      return;
    }
    const abi = require('../../eigma-cash/deployments/SASHtoken.json');
    if (this.props.provider && currentAddress) {
      const SASHTOKEN = new Contract(currentAddress, abi, this.props.provider);
      const unit = `1${'0'.repeat(50)}`;
      const mountIn = BigNumber.from(unit);
      const approve = await SASHTOKEN.approve(this.address, mountIn);
      this.setState({
        isApprove: true,
      });
    }
  };

  public takeOrder = async (timestamp: number, currentAddress: any) => {
    if (!this.props.provider) return;
    const loan = new Contract(ProductonConfig.testAddress.Loan[0], LOANABI, this.props.provider);
    await loan.takeOrder(timestamp, currentAddress);
    await this.getERC20LoanAuction(); // 刷新

    // if (!this.state.isApprove){
    //   this.approve();
    // }
    // const bank = new Contract(this.address, dexTest, this.props.provider)
    // const isActive = await bank.contract_is_active();
    // !isActive && await bank.isActive(true)
    // const takeOrderResult = await bank.takeOrder(data.seller,data.startingPrice,data.endingPrice,data.auctionDuration,data.interestRate,data.loanDuration,data.amount,data.token)
  };

  public OtherSymbols = (data: any) => data.map((it:string, i: number) => (<Col key={i} span={it == 'PROGRESS' && 8 || 4}><h3 style={{ color: '#fff' }}>{it}</h3></Col>));

  public OrderSymbols = (data: any) => {
    const newData = [
      'SYMBOL',
      'ETA',
      'PROGRESS',
      'AMOUNT',
      'IN USD',
      'PERCENTAGE',
      'BALANCES',
      'PACKED',
    ];

    return newData.map((it:string, i: number) => (
      <Col key={i} span={it === 'PROGRESS' && 3 || 3}>
        <h3 style={{ color: '#fff' }}>{it}</h3>
      </Col>
    ));
  };

  public handleSymbol = (data: any) => {
    if (this.props.type === 'order') {
      return this.OrderSymbols(data);
    }
    return this.OtherSymbols(data);
  };

  public handleRepay = async (timestamp: any) => {
    if (!this.props.provider) return;
    const loan = new Contract(ProductonConfig.testAddress.Loan[0], LOANABI, this.props.provider);
    await loan.hanldeRepay(BigNumber.from(timestamp));
    await this.getWalletERC20LoanAuction(); // 刷新
  };

  public handleRedeem = async (timestamp: any) => {
    if (!this.props.provider) return;
    const loan = new Contract(ProductonConfig.testAddress.Loan[0], LOANABI, this.props.provider);
    await loan.handleRedeem(BigNumber.from(timestamp));
    await this.getWalletERC20LoanAuction(); // 刷新
  };

  /**
   * Handle take order function
   * @param {any} event
   * @param {any} record
   * @param type
   * */
  public handleTakeOrder = async (event:any, record:any, type?:string) => {
    event.stopPropagation();
    if (this.state.isApprove) return;
    this.approve();
    /*    if (this.props.type === 'wallet') {
      this.approve();

    }
    if (this.props.type === "dex" && this.state.currKey == '2') {

      this.takeOrder(record).then(() => {})
    } */
    const testAddress = config.externalTokens.TEST[0];
    const abi = require('../../eigma-cash/deployments/bankTest.json');
    const bonds = new Contract(testAddress, abi, this.props.provider);
    const currentAddress = this.props.provider.getAddress();
    if (type == 'Take Order') {
      // await bonds.takeOrderFun(currentAddress,record.loan);
      await this.takeOrder(record.id, currentAddress);
    }
    if (type == 'Redeem') {
      // await bonds.redeem(currentAddress,record.loan);
      await this.handleRedeem(record.id);
    }
    if (type == 'Repay') {
      await this.handleRepay(record.id);
    }
  };

  /**
   *  The transmission information comes in to analyze and generate the model
   *  @returns {node}
   *  @param {number} key
   *  @param data
   * */
  public generateTemp = (key:number, data:any) => {
    const { currKey } = this.state;
    if (data) {
      if (currKey == '1') {
        return (
          <Collapse.Panel
            header={(
              <>
                <Row>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{ data.symbol }</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{ data.endedIn }</h3></Col>
                  <Col span={8}><h3 style={{ color: '#fff', fontSize: 12 }}>{make_bar(Number(data.progress), bar_styles[8], 25, 25).str}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.price}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.faceValue}</h3></Col>
                </Row>
                <Button
                  onClick={(e) => { this.handleTakeOrder(e, data, TAKE_OVER_BUTTON(this.props.type)); }}
                  type="default"
                  className="take_order"
                  ghost
                >
                  { TAKE_OVER_BUTTON(this.props.type) }
                </Button>
              </>
          )}
            key={key}
            data-key="1"
          >
            <Table
              className="tables"
              dataSource={data.list}
            >
              <Table.Column
                title={(
                  <>
                    N
                    <sup>o</sup>
                  </>
)}
                dataIndex="nonce"
                key="nonce"
              />
              <Table.Column title={<>ETA</>} dataIndex="eta" key="eta" />
              <Table.Column
                width="50%"
                title={<>PROGRESS</>}
                dataIndex="progress"
                key="progress"
                render={(tags) => (
                  make_bar(Number(tags), bar_styles[8], 30, 30).str
                )}
              />
              <Table.Column title={<>IN DBIT</>} dataIndex="inSASH" key="inSASH" />
              <Table.Column title={<>IN USD</>} dataIndex="inUSD" key="inUSD" />
            </Table>
          </Collapse.Panel>
        );
      }
      if (currKey == '2') {
        const list = data.list.map((it:any, i:number) => (
          <Col className="item" key={i} span={12}>
            <h4 className="">{it.name}</h4>
            <p>{it.num}</p>
          </Col>
        ));
        return (
          <Collapse.Panel
            header={(
              <>
                <Row>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.symbol}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.balance}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.Loan}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.IR}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.DueDate}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.EndedIn}</h3></Col>
                </Row>
                <Button
                  onClick={(e) => { this.handleTakeOrder(e, data, this.props.type === 'dex' && 'Take Order' || 'Repay'); }}
                  type="default"
                  className="take_order"
                  ghost
                >
                  {this.props.type === 'dex' && 'Take Order' || 'Repay'}
                </Button>
              </>
          )}
            key={key}
            data-key="1"
          >
            <Row key={key} className="erc20Loan">
              {list}
            </Row>
          </Collapse.Panel>
        );
      }
      if (currKey == '3') {
        const list = data.list.map((it:any, i:number) => (
          <Col className="item" key={Math.random()} span={it.span}>
            <h4 className="">{it.name}</h4>
            <p>{it.num}</p>
          </Col>
        ));
        return (
          <Collapse.Panel
            header={(
              <>
                <Row>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.symbol}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.Author}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.Loan}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.IR}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.DueDate}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.EndedIn}</h3></Col>
                </Row>
                {
                this.props.type == 'dex'
                && <Button onClick={(e) => { this.handleTakeOrder(e, data, 'Take Order'); }} type="default" className="take_order" ghost>Take Order</Button>
                || null
              }
              </>
          )}
            key={key}
            data-key="1"
          >
            <Row key={Math.random()} className="nft">
              <Col span={12} className="author">
                <div className="content">
                  <p className="title">
                    {' '}
                    CryptoPunk 42E32b
                    <IconFont style={{ position: 'absolute', right: 0 }} type="icon-lianjie" />
                  </p>
                </div>
              </Col>
              <Row className="rightData">
                {list}
                <Col key={Math.random()} className="item last" span={12}>
                  <h4>SHAREⒾ</h4>
                  <div>
                    <p className="num">
                      <span>{this.state.inputValue}</span>
                      /
                      <span>100</span>
                    </p>
                    <Slider
                      key={Math.random()}
                      tooltipVisible={false}
                      onChange={this.handleSlider}
                      value={this.state.inputValue}
                    />
                  </div>
                </Col>
              </Row>
            </Row>
          </Collapse.Panel>
        );
      }
    }
  };

  /**
   * Monitor tab bar switching
   * */
  public handleTabsChange = async (key: any) => {
    this.setState({
      spinning: false,
      loading: false,
    });
    this.setState({
      currKey: key,
    });
    if (this.props.type === 'wallet') {
      if (Number(key) == 3) {
        await this.getData();
        return;
      }
      Number(key) === 2 && await this.getERC20Loan();
      await this.getWalletERC20LoanAuction(key);
      return;
    }

    if (this.props.type === 'dex') {
      if (Number(key) == 3) {
        await this.getData();
        return;
      }
      Number(key) === 2 && await this.getERC20Loan();
      await this.getERC20LoanAuction(key);
    }
  };

  /**
   * Handle the change of the slider
   * */
  public handleSlider = (val: any) => {
    this.setState({
      inputValue: val,
    });
  };

  public showAll = () => {
    this.setState({
      searchString: undefined,
    });
  };

  public onSearchChange = (e: any) => {
    const { value } = e.target;
    this.setState({
      searchString: value,
    });
  };

  public refresh = async (tabIndex: number) => {
    this.setState({
      spinning: true,
      loading: true,
    });
    if (this.props.type === 'dex') {
      switch (tabIndex) {
        case 1:
          await this.getERC20LoanAuction();
          break;
        case 2:
          await this.getERC20Loan();
          break;
        case 3:
          await this.getData();
          break;
      }
    } else if (this.props.type === 'wallet') {
      switch (tabIndex) {
        case 1:
          await this.getWalletERC20LoanAuction();
          break;
        case 2:
          await this.getERC20Loan();
          break;
        case 3:
          await this.getData();
          break;
      }
    }
    this.setState({
      spinning: false,
      loading: false,
    });
  };

  public onCreateClick = () => {
    (this.props.type === 'dex' && this.state.currKey == '1') && this.props.onNewOrder();
  };

  render() {
    const {
      content, erc20LoanData, tableTit, erc20LoanTit, nftData, nftTit,
    } = this.state;
    return (
      <Modal
        className={`my-modal selectModal ${styles.selectModal_wrap}`}
        visible={this.props.visible}
        title={null}
        footer={null}
        width="50%"
      >

        <h1 style={{ textAlign: 'center', color: '#fff' }}>
          {this.props.title}
          {' '}
          <Close
            close={this.props.onCancel}
            className={`close_icon ${styles.close_icon}`}
          />
          {' '}

        </h1>
        <Tabs defaultActiveKey={this.state.currKey} centered onChange={this.handleTabsChange}>
          <Tabs.TabPane key={1} tab="ERC-20">
            <h2
              className="title "
              style={{
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {this.props.titleSub}
              <Refresh
                spinning={this.state.spinning}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
                refresh={() => this.refresh(1)}
              />
            </h2>
            <Row className="list_head" style={{ textAlign: 'center' }}>
              {this.handleSymbol(tableTit)}
            </Row>
            <div className="content_wrap">
              <Loading loading={this.state.loading} />
              <div className="content" ref={this.content}>
                <Scrollbars>
                  <Collapse key="asdasd" className="collapse_wrap" expandIconPosition="right" ghost defaultActiveKey={['1']} accordion>
                    {this.state.content.map((item: any, index: number) => (
                      this.generateTemp(index, item)
                    ))}
                  </Collapse>
                </Scrollbars>
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane key={2} tab="ERC-20Loan">
            <h2 className={`title ${commonStyles.vCenter}`} style={{ color: '#fff' }}>
              {this.props.titleSub}
              <Refresh
                spinning={this.state.spinning}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
                refresh={() => this.refresh(2)}
              />
            </h2>
            <Row className="list_head" style={{ textAlign: 'center' }}>
              {this.handleSymbol(erc20LoanTit)}
            </Row>
            <div className="content_wrap">
              <Loading loading={this.state.loading} />
              <div className="content" ref={this.content}>
                <Scrollbars>
                  <Collapse key={1000} className="collapse_wrap" expandIconPosition="right" ghost defaultActiveKey={['1']} accordion>
                    {this.state.erc20LoanData.map((item: any, index: number) => (
                      this.generateTemp(index, item)
                    ))}
                  </Collapse>
                </Scrollbars>
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane key={3} tab="NFT">
            <h2
              className={`title ${commonStyles.vCenter}`}
              style={{ color: '#fff' }}
            >
              {this.props.titleSub}
              <Refresh
                spinning={this.state.spinning}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
                refresh={() => this.refresh(3)}
              />
            </h2>
            <Row className="list_head" style={{ textAlign: 'center' }}>
              {this.handleSymbol(nftTit)}
            </Row>
            <div className="content_wrap">
              <Loading loading={this.state.loading} />
              <div className="content" ref={this.content}>
                <Scrollbars>
                  <Collapse key={Math.random()} className="collapse_wrap" expandIconPosition="right" ghost defaultActiveKey={['1']} accordion>
                    {this.generateTemp(1, nftData[0])}
                    {this.generateTemp(2, nftData[1])}
                    {this.generateTemp(3, nftData[2])}
                    {this.generateTemp(4, nftData[3])}
                    {this.generateTemp(5, nftData[4])}
                  </Collapse>
                </Scrollbars>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>

        <Row className="control">
          <Col span={5}>
            <Input
              className={styles.format_height}
              style={{ width: 180, color: '#fff' }}
              size="large"
              value={this.state.searchString}
              onChange={this.onSearchChange}
              placeholder="Search..."
            />
          </Col>
          <Col span={5}>
            <Button className={styles.format_height} style={{ width: 180 }} size="large" type="default" ghost onClick={this.showAll}>Show All...</Button>
          </Col>
          <Col span={5}>
            <Button className={styles.format_height} style={{ width: 180 }} size="large" type="default" ghost>Only main</Button>
          </Col>
          <Col span={9}>
            <NavLink to="/bank?airdrop=1">
              <Button
                className={styles.format_height}
                size="large"
                type="primary"
              >
                Balance 234,234,234,234 dbit
              </Button>
            </NavLink>
          </Col>
        </Row>
        {
            this.props.type !== 'order' && (
            <Row className="createOrder">
              <Col span={24}>
                <Button size="large" ghost icon={<PlusOutlined />} onClick={this.onCreateClick}>Create New Order</Button>
                <span style={{ fontSize: 30 }}>Ⓘ</span>
              </Col>
            </Row>
            )
        }
      </Modal>
    );
  }
}

export default SelectModal;
