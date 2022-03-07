import React, { Component } from 'react';
import {
  Button, Col, Input, notification, Progress, Row, Slider, Space, Tabs,
} from 'antd';
import { createFromIconfontCN, WarningOutlined } from '@ant-design/icons';
import Scrollbars from 'react-custom-scrollbars';
import { BigNumber, Contract, ethers } from 'ethers';
import moment from 'moment';
import TradingStyles from '../../views/bank/css/buySashBond.module.css';
import OTable from '../OTable/Index';
import { bar_styles, make_bar } from '../../eigma-cash/format_util';
import configTest from '../../config-test';
import config from '../../config-production';
import Loading from '../loading/index';
import './css/trading.css';

import BondsTest from '../../eigma-cash/deployments/bondsTest.json';

const address = config.externalTokens.dexTest[0];
const address2 = config.externalTokens.TEST[0];

const { TabPane } = Tabs;

const bankTest = require('../../eigma-cash/deployments/bankTest.json');

const LoanABI = require('../../eigma-cash/testAbi/LOAN.json');

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2764360_4tqupfjze2l.js',
  ],
  extraCommonProps: {},
});

type Props = {
  refresh: any,
  rangeInfos?: any,
  depositChange?: any,
  currencyType: any,
  changeCurrency: any,
  rangeChange: any,
  onPriceChange?: any,
  onBorrow?: any,
  stepSize: any,
  provider?: any,
  type?: string,
  depositType?: string
}

class TradingInterface extends Component<Props> {
  state = {
    stepSize: 0,
    currencyType: 'USDT',
    currentActive: 0,
    outputStatus: false, // 为了和
    depositStatus: true, // 为了和
    depositApproved: false,
    max: 0,
    min: 0,
    loading: false,
    dueDate: 0,
    inTrestReateVal: 0,
    inputData: [],
    currentDate: Date.now(),
    currentDateFormat: null,
    stepDueDate: 0,
    mostRepayment: 0,
    leastRepayment: 0,
  };

  private readonly externalTokens: any;

  private readonly provider: any;

  private bank: any;

  private bondAddress: any = config.externalTokens.bondsTest[0];

  private currentTimestamp: any;

  private viewTimer: any;

  private outputData: any = { current: null };

  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.provider = ethers.getDefaultProvider('ropsten');
    const { externalTokens } = configTest;
    this.externalTokens = externalTokens;
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this)); // 监听窗口大小改变
    const clientW = document.documentElement.clientWidth;
    this.handleClientW(clientW, 750);
    this.getInputData();

    if (this.props.type && this.props.type == 'loan') {
      this.setState({
        outputStatus: true,
      });
    }

    this.setState({
      currentDateFormat: moment(this.state.currentDate).format('YYYY-MM-DD'),
    });
  }

  componentWillUpdate() {
  }

  componentWillUnmount() {
    this.viewTimer && clearInterval(this.viewTimer);
    this.currentTimestamp = undefined;
  }

  handleResize = (e: any) => {
    const e_width = e.target.innerWidth;
    this.handleClientW(e_width, 750);
  };

  handleClientW = (width: any, num: any) => {
    if (width > num) {
      this.setState({
        navStatus: false,
      });
    }
  };

  public getInputData = async () => {
    const newData = [];
    /*
    if (this.props.type === 'bank') {
      newData.push({
        name: 'TKN',
        balance: "",
        token: "",
      })
      this.setState({
        inputData: newData,
      });
      return;
    } */
    this.setState({
      loading: true,
    });
    const bank = new Contract(this.externalTokens.BANKTEST[0], bankTest, this.props.provider);

    const data = await bank.getStakeInputData();
    const name = data[0];
    const eta = data[1];
    const progress = data[2];

    for (let i = 0; i < 3; i++) {
      newData.push({
        name: name.split(',')[i],
        eta: eta.split(',')[i],
        progress: progress.split(',')[i],
      });
    }

    this.setState({
      inputData: newData,
      loading: false,
    });
  };

  public refresh = () => {
    this.props.refresh && this.setState({
      stepSize: 0,
      currencyType: 'USDT',
    });
  };

  public handleInputClick = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, name: string, i: number) => {
    event.nativeEvent.stopImmediatePropagation();
    if (this.state.currencyType == name) {
      return;
    }
    if (this.props.type && this.props.type == 'loan') {
      this.setState({
        // depositStatus:true,
        // outputStatus:false,
        currencyType: name,
      });
      this.props.changeCurrency(event, i, name);
    } else {
      this.setState({
        depositStatus: true,
        outputStatus: false,
        currencyType: name,
      });
    }

    this.handleToggle(event, i, name);
  };

  public renderCurr = () => this.state.inputData.map(({ eta, name, progress }, i) => {
    if (this.props.type !== 'bonds') {
      return (

        <p
          key={i}
          data-key={i}
          datatype={name}
          style={{ cursor: 'pointer', background: this.state.currentActive === i && '#403af4' || '#000' }}
          onClick={(event) => {
            this.handleInputClick(event, name, i);
          }}
          className={TradingStyles.item}
        >
          <span className={TradingStyles.name}>
            <IconFont type="icon-lianjie-copy" />
            {' '}
            {name}
          </span>
          <span className={TradingStyles.name}>
            ETA:
            {eta}
          </span>
          <div className={TradingStyles.progress}>

              <Progress percent={progress} strokeColor="white" />
          </div>
        </p>
      );
    }
    return (
      <p
        key={i}
        data-key={i}
        datatype={name}
        style={{ cursor: 'pointer', background: this.state.currentActive === i && '#403af4' || '#000' }}
        onClick={(event) => {
          this.handleInputClick(event, name, i);
        }}
        className={TradingStyles.item}
      >
        <span className={TradingStyles.name}>
          <IconFont type="icon-lianjie-copy" />
          {' '}
          {name}
        </span>
      </p>
    );
  });

  public handleToggle = (e: any, i: number, type: string) => {
    this.setState({
      currentActive: i,
    });

    this.props.changeCurrency(e, i, type);
  };

  public handleView = async () => {
    if (!this.state.depositStatus || this.state.outputStatus) return;

    this.setState({
      outputStatus: true,
      depositStatus: false,
    });
    if (this.viewTimer) clearInterval(this.viewTimer);
    this.currentTimestamp = Date.now();
    this.viewTimer = setInterval(() => {
      const d = (Date.now() - this.currentTimestamp) / 1000;
      if (d > 30 * 60) {
        this.setState({
          depositStatus: true,
          outputStatus: false,
        });
      }
    }, 300);

    const testContract = require('../../eigma-cash/deployments/test.json');
    const test = new Contract(this.externalTokens.TEST[0], testContract, this.props.provider);

    // const bondInfo = await test.getEvens();
    // console.log("bondInfo",bondInfo)
    console.log('output', this.outputData.current);
    // await this.outputData.current.getData();
  };

  public handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.props.onPriceChange(name, value);
    this.setState({
      [name]: value,
    });
    this.updateRepayments();
  };

  /**
   * Process INTREST TEATE slider data response function
   * */
  public handleInTrestReateVal = (val: number) => {
    this.setState({
      inTrestReateVal: val,
    });
    this.updateRepayments();
  };

  public updateRepayments = () => {
    this.setState({
      leastRepayment: BigNumber.from(this.state.min).mul(this.state.inTrestReateVal).div(100).add(this.state.min)
        .toNumber(),
      mostRepayment: BigNumber.from(this.state.max).mul(this.state.inTrestReateVal).div(100).add(this.state.max)
        .toNumber(),
    });
  };

  public handleChangeTabs = () => {
    this.setState({
      max: 0,
      min: 0,
    });
  };

  public borrowChange = () => {
    const obj: any = {};
    obj.max = this.state.max;
    obj.min = this.state.min;
    obj.dueDate = this.state.dueDate;
    obj.interestRate = this.state.inTrestReateVal;
    obj.auctionType = 1;
    this.props.onBorrow(obj);
  };

  /**
   * Generate LOAN page output dom
   * */
  public handleLoanCommonDom = (type: string) => (
    <>
      <Row key={191} className={TradingStyles.max_wrap}>
        <Col span={1} push={7} className={TradingStyles.max}>
          <span>MAX</span>
        </Col>
        <Col className={TradingStyles.amount} span={8} push={7}>
          <Input
            type="number"
            placeholder="LOAN AMOUNT"
            onChange={(e) => {
              this.handleValue(e);
            }}
            name="max"
            autoComplete="off"
            className={TradingStyles.inputAmount}
            value={this.state.max}
          />
        </Col>
        <Col className={TradingStyles.lastName} span={4} push={7}>
          <span>( IN USD $ 3621.45 )</span>
        </Col>
      </Row>
      <Row key={192} className={TradingStyles.min_wrap}>
        <Col className={TradingStyles.min} span={1} push={7}>
          <span>MIN</span>
        </Col>
        <Col className={TradingStyles.amount} span={8} push={7}>
          <Input
            type="number"
            autoComplete="off"
            placeholder="LOAN AMOUNT"
            className={TradingStyles.inputAmount}
            onChange={(e) => {
              this.handleValue(e);
            }}
            name="min"
            value={this.state.min}
          />
        </Col>
        <Col className={TradingStyles.lastName} span={4} push={7}>
          <span>( IN USD $ 35.21 )</span>
        </Col>
      </Row>
      {
        type == 'FIXED RATE' && this.handleFixedRateContent() || this.handleVariableRateContent()
      }
      <Button
        type="default"
        size="large"
        onClick={this.borrowChange}
        className={TradingStyles.borrow}
      >
        BORROW
        {' '}
        <span className={TradingStyles.borrow_flag}>Ⓘ</span>
      </Button>
    </>
  );

  /**
   * Process DUE DATE slider data response function
   * */
  public handleDueDate = (dueDate: number) => {
    this.setState({
      stepDueDate: dueDate,
      dueDate: Math.floor(dueDate * (3.65)),
    }, () => {

    });
  };

  /**
   *
   * 1 24 * 60 * 60 = 86400  秒
   * dueDate*86400
   */
  public handleDueDateChange = (e: any) => {
    this.setState({
      dueDate: e.target.value,
      stepDueDate: Number(e.target.value) / 3.65,
    });
    this.updateRepayments();
  };

  /**
   * Generate LOAN page output dom
   * */
  public handleFixedRateContent = () => (
    <>
      <Row key={1000000} className={TradingStyles.slider_wrap}>
        <Col span={24}>
          <h3 className={TradingStyles.title}>DUE DATE Ⓘ</h3>
          <Slider
            value={typeof this.state.stepDueDate === 'number' ? this.state.stepDueDate : 0}
            style={{ width: '50%', margin: '20px auto' }}
            onChange={this.handleDueDate}
          />
          <div className={TradingStyles.infos}>
            <span
              className={`${TradingStyles.money} ${TradingStyles.block}`}
            >
              (365 DAYS
              {' '}
              {this.state.currentDateFormat}
              )
            </span>
            <Input
              name="dueDate"
              key="deuDate"
              size="small"
              suffix="DAYS"
              defaultValue={this.state.dueDate}
              value={this.state.dueDate}
              onChange={(e) => {
                this.handleDueDateChange(e);
              }}
            />
          </div>
        </Col>
      </Row>
      <Row key={23000000} className={TradingStyles.slider_wrap}>
        <Col span={24}>
          <h3 className={TradingStyles.title}>INTEREST RATE Ⓘ</h3>
          <Slider
            value={this.state.inTrestReateVal}
            min={0}
            max={200}
            style={{ width: '50%', margin: '20px auto' }}
            tipFormatter={null}
            onChange={this.handleInTrestReateVal}
          />
          <div className={TradingStyles.infos}>
            <span>
              (min:
              {this.state.leastRepayment}
              {' '}
              max:
              {this.state.mostRepayment}
              {' '}
              )
            </span>
            <span
              className={`${TradingStyles.proportion} ${TradingStyles.block}`}
            >
              {this.state.inTrestReateVal / 2}
              %
            </span>

          </div>
        </Col>
      </Row>
    </>
  );

  /**
   * Generate LOAN page output dom
   * */
  public handleVariableRateContent = () => (
    <>
      <Row className={TradingStyles.slider_wrap}>
        <Col span={24}>
          <h3 className={TradingStyles.title}>ESTIMATED DUE DATE Ⓘ</h3>
          <div className={TradingStyles.infos}>
            <span>(365 DAYS)</span>
            <span>2022-05-22</span>
          </div>
        </Col>

      </Row>
      <Row className={TradingStyles.slider_wrap}>
        <Col span={24}>
          <h3 className={TradingStyles.title}>ESTIMATED INTREST REATE Ⓘ</h3>
          <div className={TradingStyles.infos}>
            <span>( 135% )</span>
          </div>
        </Col>
      </Row>
      <Row className={TradingStyles.slider_wrap}>
        <Col span={24}>
          <OTable refresh={this.state.outputStatus} />
        </Col>
      </Row>
      <Row className={TradingStyles.inTotal}>
        <Col className={TradingStyles.inTotal_con} span={3}>
          <span>IN TOTAL :</span>
        </Col>
        <Col className={TradingStyles.inTotal_con} span={3}>
          <span>{moment(Date.now() - Math.floor(Math.random() * 1000000000)).format('DD-MM-YYYY')}</span>
        </Col>
        <Col className={TradingStyles.inTotal_con} span={12}>
          <span>{make_bar(20, bar_styles[12], 15, 15).str}</span>
        </Col>
        <Col className={TradingStyles.inTotal_con} span={3}>
          <span>3234.324</span>
        </Col>
        <Col className={TradingStyles.inTotal_con} span={3}>
          <span>34543.12</span>
        </Col>
      </Row>
    </>
  );

  /**
   *  Generate output dom of LOAN page
   * */
  public handleLoanOutputTemp = () => (
    <Tabs defaultActiveKey="1" centered onChange={this.handleChangeTabs}>
      <TabPane tab="FIXED RATE Ⓘ " key="1">
        {this.handleLoanCommonDom('FIXED RATE')}
      </TabPane>
      <TabPane tab="VARIABLE RATE Ⓘ" key="2">
        {this.handleLoanCommonDom('VARIABLE RATE')}
      </TabPane>
    </Tabs>
  );

  public onApporveDeposit = async () => {
    if (this.state.depositApproved || this.state.depositStatus) return;
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
      try {
        const approve = await SASHTOKEN.approve(address, mountIn);
        this.setState({
          depositApproved: true,
        });
        await this.deposit(this.props.depositType as string, address2);
      } catch (e) {
      }
    }
  };

  public deposit = async (type: string, address: string) => {
    const BANK = new Contract(address, bankTest, this.props.provider);
    if (type == 'buy') {
      await BANK.handleBuy(type, this.state.currencyType, 20, this.state.stepSize);
    } else {
      await BANK.handleStaking(type, this.state.currencyType, 20, this.state.stepSize);
    }
  };

  public onTrustee = async () => {
    const Loan = new Contract(config.testAddress.Loan[0], LoanABI, this.props.provider);
    await Loan.delegate(
      this.state.currencyType,
      this.props.provider.getAddress(),
      this.state.stepSize,
    );
  };

  public getBankButton = () => {
    if (this.props.type === 'bank' || this.props.type === 'gov') {
      // disabled={this.state.depositStatus}
      return (
        <Button
          className={`${TradingStyles.btn} ${TradingStyles.deposit} ${this.state.depositStatus && TradingStyles.disabled || ''}`}
          onClick={async () => {
            await this.onApporveDeposit();
            await this.deposit(this.props.depositType as string, address2);
          }}
        >
          <span className={TradingStyles.text}>DEPOSIT</span>
          <IconFont type="icon-xiangxiajiantou" />
        </Button>
      );
    }
    return (
      <Button
        disabled={this.state.depositStatus}
        className={`${TradingStyles.btn} ${TradingStyles.deposit} ${this.state.depositStatus && TradingStyles.disabled || ''}`}
        onClick={this.onTrustee}
      >
        <span className={TradingStyles.text}>TRUSTEE</span>
        <IconFont type="icon-xiangxiajiantou" />
      </Button>
    );
  };

  render() {
    const { type } = this.props;
    return (

      <div className={`${TradingStyles.content} buyDbitBond_wrap`}>
        {/* INPUT DOM  */}
        <Loading loading={this.state.loading} />
        <div className={TradingStyles.input}>
          <h1 className={TradingStyles.title}>INPUT Ⓘ</h1>
          <Scrollbars className={TradingStyles.currType}>
            {this.renderCurr()}
          </Scrollbars>
          <Slider
            value={typeof this.props.stepSize === 'number' ? this.props.stepSize : 0}
            min={0}
            max={10000}
            style={{ width: '50%', margin: '20px auto' }}
            tipFormatter={null}
            onChange={this.props.rangeChange}
          />
          <div className={TradingStyles.infos}>
            {this.props.children}
          </div>

          <Space size={[0, 0]} className={TradingStyles.btnGroup}>
            {
              this.props.type && this.props.type == 'loan' ? null
                : (
                  <Button className={`${TradingStyles.view} ${TradingStyles.btn}`} onClick={this.handleView}>
                    <span className={TradingStyles.text}>VIEW</span>
                    <IconFont type="icon-xiangxiajiantou" />
                  </Button>
                )
            }
            {
              this.props.type && this.props.type == 'loan' ? (
                <Button className={`${TradingStyles.btn} ${TradingStyles.deposit}}`} onClick={this.onTrustee}>
                  <span className={TradingStyles.text}>TRUSTEE</span>
                  <IconFont type="icon-xiangxiajiantou" />
                </Button>
              ) : this.getBankButton()
            }
          </Space>
        </div>

        {/* OUTPUT DOM */}
        {
          this.state.outputStatus
          && (
            <div className={TradingStyles.output}>
              <h3 className={TradingStyles.title}>OUTPUT Ⓘ</h3>
              {type == 'loan' && this.handleLoanOutputTemp() || (
                <>
                  <OTable ref={this.outputData} refresh={this.state.outputStatus} provider={this.provider} />
                  <div className={TradingStyles.currentItem}>
                    <Row className={TradingStyles.con}>
                      <Col span={3}>
                        <span>IN TOTAL:</span>
                      </Col>
                      <Col span={3}>
                        <span>12-11-2021</span>
                      </Col>
                      <Col span={12}>
                        <span>{make_bar(30, bar_styles[8], 25, 25).str}</span>
                      </Col>
                      <Col span={3}>
                        <span>9324.24</span>
                      </Col>
                      <Col span={3}>
                        <span>$ 9515</span>
                      </Col>
                    </Row>
                  </div>
                </>
              )}
            </div>
          )
          || null
        }

      </div>
    );
  }
}

export default TradingInterface;
