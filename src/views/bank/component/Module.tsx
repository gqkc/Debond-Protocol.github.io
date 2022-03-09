import React from 'react';
import {
  Modal, Button, AutoComplete, Input, Alert,
} from 'antd';
import {BigNumber, Contract, utils} from 'ethers';
import styles from '../css/bank.module.css';
import {getDisplayBalance} from '../../../eigma-cash/format_util';
import config from '../../../config';
import TradingInterface from '../../../components/TradingInterface/TradingInterface';
import buySashBond from '../css/buySashBond.module.css';
import MyModal from '../../../components/Modal/Index';
import {Refresh, Close} from '../../../components/Icon/Icon';
import Deposit from '../../../components/Deposit/Deposit';
import {Header} from 'antd/lib/layout/layout';

type IMyComponentState = {
  value: string;
  isModalVisible: boolean;
  disabled: boolean;
  amount: number;
  isApprove: boolean;
  provider: any;
  currencyType: any,
  stepSize: number,
  spinning: boolean,
  depositStatus: boolean,
  rangStepSize: number,
  maxValue: number
}
type IMyComponentProps = {
  contracts: any,
  provider: any,
  buyStake: string
}
const renderTitle = (title: string) => (
  <span>
    {title}
  </span>
);
const renderItem = (title: string, count: number) => ({
  value: title,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/2502.png" alt="BNB" width={25} height={25}/>
      {title}
      <span>
        {count}
      </span>
    </div>
  ),
});

const options = [
  {
    label: renderTitle('token list'),
    options: [renderItem('BNB', 10000), renderItem('USDT', 10600), renderItem('MDX', 10600)],
  },
];

export class Module extends React.Component<IMyComponentProps, IMyComponentState> {
  public provider: any;

  public contracts: any;

  public walletWithProvider: any;

  public currentAddress: any;

  public amount: any;

  public externalTokens: any;

  private Child: any;

  public constructor(props?: any, context?: any) {
    super(props);
    this.Child = React.createRef();

    this.state = {
      value: '',
      amount: 0,
      isModalVisible: false,
      disabled: true,
      isApprove: true,
      provider: this.props.provider,
      currencyType: 'USDT',
      stepSize: 0,
      spinning: false,
      depositStatus: false,
      rangStepSize: 0,
      maxValue: 16524.12
    };
    this.contracts = {};
    const {externalTokens} = config;
    this.externalTokens = externalTokens;
  }

  componentDidMount() {
    this.init(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (!nextProps || this.provider != nextProps.provider || this.contracts != nextProps.contracts) {
      this.init(nextProps);
    }
  }

  public setSpinning = (status: boolean) => {
    this.setState({
      spinning: status,
    });
  };

  public async init(nextProps: any) {
    if (!nextProps || !nextProps.contracts || !nextProps.provider) {
      return;
    }
    this.contracts = nextProps.contracts;
    this.provider = nextProps.provider;
  }

  public makeAddress = async (value: any) => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    let isApprove = true;
    if (value == 'BNB') {
      this.currentAddress = this.externalTokens.BNB[0];
      isApprove = false;
    } else if (value == 'USDT') {
      this.currentAddress = this.externalTokens.USDT[0];
    } else if (value == 'MDX') {
      this.currentAddress = this.externalTokens.MDX[0];
    }
    if (isApprove) {
      const abi = require('../../../eigma-cash/deployments/ERC20.json');
      this.contracts.ERC20 = new Contract(this.currentAddress, abi, this.provider);
      const address = await this.provider.getAddress();
      let mount = await this.contracts.ERC20.allowance(address, this.externalTokens.bank[0]);

      mount = mount ? getDisplayBalance(mount, 1) : '0';
      if ((mount | 0) > 10000) {
        isApprove = false;
      }
    }
    this.setState({
      value,
      isApprove,
    });
  };

  public approve = async () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    const abi = require('../../../eigma-cash/deployments/ERC20.json');
    if (this.provider && this.currentAddress) {
      this.contracts.ERC20 = new Contract(this.currentAddress, abi, this.provider);
      const unit = '100000000000000000000000000';
      const mountIn = BigNumber.from(unit);

      const approve = await this.contracts.ERC20.approve(this.externalTokens.bank[0], mountIn);
      this.setState({
        isApprove: false,
      });
    }
  };

  public swap = async () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    const {value} = this.state;
    if (value == 'BNB') {
      var mintingCost = await this.contracts.bank.buySASHBondWithETH(this.currentAddress, '1', [this.externalTokens.BNB[0], this.externalTokens.USDT[0]], {value: utils.parseEther(this.amount)});
    } else if (value == 'USDT') {
      var amount: any = parseFloat(this.amount);
      amount *= 10 ** 5;
      amount = BigNumber.from(amount).mul(BigNumber.from(10).pow(13));
      var mintingCost = await this.contracts.bank.buySASHBondWithUSD(this.currentAddress, this.currentAddress, amount);
    } else {
      var amount: any = parseFloat(this.amount);
      amount *= 10 ** 5;
      amount = BigNumber.from(amount).mul(BigNumber.from(10).pow(13));
      var mintingCost = await this.contracts.bank.buySASHBondWithToken(this.currentAddress, amount, BigNumber.from('1'), [this.currentAddress, this.externalTokens.BNB[0], this.externalTokens.USDT[0]]);
    }
  };

  public setAmount = (e: any) => {
    this.amount = e.currentTarget.value;
  };

  public handleDeposit = () => {
    this.setState({
      depositStatus: true,
    });
  };

  public handleCurrency = (event: any, i: number, type: string) => {
    this.setState({
      currencyType: type,
    });
  };

  public handleRefresh = () => {

  };

  public handleDepositClose = () => {
    this.setState({
      depositStatus: false,
    });
  };

  public handleRangeChange = (e: any) => {
    const value = Number(e.target.value);
    this.setState({
      rangStepSize: value,
      stepSize: value / 100,
    });
  };

  public refresh = async () => {
    this.setSpinning(true);
    await this.Child.current.getInputData();
    this.setSpinning(false);
  };

  conditionalTradingInterface = () => {
    let tradingInterface;
    if (this.provider) {
      tradingInterface = (
        <TradingInterface
          ref={this.Child}
          provider={this.provider}
          type="bank"
          depositChange={this.handleDeposit}
          currencyType={this.state.currencyType}
          changeCurrency={this.handleCurrency}
          rangeChange={this.handleRangeChange}
          stepSize={this.state.rangStepSize}
          maxValue={this.state.maxValue}
          inputChange={this.handleInputChange}
          refresh
          buyStake={this.props.buyStake}
        >
          {/*   <span className={`${buySashBond.money} ${buySashBond.block}`}>(2.1ETH    412.32SASH   IN USD $ 16524.12)</span>
                        <span className={`${buySashBond.proportion} ${buySashBond.block}`}>{this.state.stepSize}%</span>
                        <span className={`${buySashBond.currencyNum} ${buySashBond.block}`}>{0}<span className={buySashBond.currencyType}>{this.state.currencyType}</span></span>
                       */}

        </TradingInterface>
      );
    } else {
      tradingInterface = <div><Alert type={"error"} message={"There is no provider "}> </Alert></div>;
    }
    return tradingInterface;
  }

  handleInputChange = (val: Number) => {
    let value = Number(val);
    if (isNaN(value)) value = Number(0);
    if (Number(value) > 100) value = Number(100);
    if (Number(value) < 0) value = Number(0);
    this.setState({stepSize: value});
  }

  public render() {
    const {value, isApprove} = this.state;
    return (
      <div>
        <div className={styles.headerTitle}>{this.props.buyStake} Tokens for DBIT Bonds</div>
        {this.conditionalTradingInterface()}

        {/* <Modal title="Deposit for SASH" visible={this.props.disView} footer={null} onOk={this.props.openView} onCancel={this.props.closeView}>
                    <div className={styles.search}>
                        token:  <AutoComplete
                            dropdownMatchSelectWidth={252}
                            style={{ width: 300, marginBottom: "10px" }}
                            options={options}
                            onChange={this.makeAddress}
                        >
                        <Input.Search size="large" placeholder="select token" enterButton={null} />
                        </AutoComplete>
                    </div>
                    <div style={{ marginLeft: " 12%" }}>
                        amount:  <Input type="text" placeholder="(Number of inputs)" style={{ width: "300px", marginBottom: "10px", height: "35px" }} className={styles.amountNmuber} onBlur={this.setAmount} />
                    </div>
                    <div className={styles.disButton}>
                        {isApprove ? <button className={styles.buttona} onClick={this.approve}>Approve {value}</button> : null}
                        <button className={styles.buttona} onClick={this.swap}>SwapAny</button></div>

                </Modal> */}
      </div>
    );
  }
}
