import React from 'react';

import { BigNumber, Contract } from 'ethers';
import Web3 from 'web3';
import UnderConstructionModal from '../../../components/UnderConstructionModal/UnderConstructionModal';
import { Module } from './Module';
import ClaimAirdrop from '../../../components/ClaimAirdrop/ClaimAirdrop';
import Proposals from './Proposals';
import { getDisplayBalance, handleBalance } from '../../../eigma-cash/format_util';
import styles from '../css/gov.module.css';
import cir from '../../../assets/cir.png';
import cir1 from '../../../assets/circ1.png';
import trian from '../../../assets/trian.png';
import particle from '../../../assets/particle.gif';
import BuySGMBond from './BuySGMBond';
import config, { Config } from '../../../config';

type IMyComponentState = {
  currentPrice: string;
  totalSupply: string;
  mintingCost: string;
  disIsModal: boolean;
  provider: any,
  status: boolean,
  balance: any,
  stakeStatus: boolean,
  bondTitle: any,
  claimAirdropStatus: boolean
  voteStatus:boolean
  proposalsStatus:boolean,
  currentAddress:string,
  type:string
}
type IMyComponentProps = {
  provider: any,
  web3: Web3 | null,
  config: Config | null,
}

export class Content extends React.Component<IMyComponentProps, IMyComponentState> {
  public provider: any;

  public tree: any;

  public contracts: any;

  public currentAddress: any;

  public externalTokens: any;

  private proposals:any = { current: null };

  public constructor(props?: any) {
    super(props);
    this.state = {
      currentPrice: '',
      totalSupply: '',
      mintingCost: '',
      disIsModal: false,
      provider: this.props.provider,
      status: false,
      stakeStatus: false,
      balance: 0,
      bondTitle: 'STAKE Token for BOND',
      claimAirdropStatus: false,
      voteStatus: false,
      proposalsStatus: false,
      currentAddress: '',
      type: 'buy',

    };
    const { externalTokens } = config;
    this.externalTokens = externalTokens;
    this.contracts = {};
  }

  componentDidMount() {
    this.init(this.props.provider);
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.state.provider !== nextProps.provider) {
      this.init(nextProps.provider);
    }
  }

  public async init(provider: any) {
    if (!provider) {
      return;
    }
    this.provider = provider;
    const abi = require('../../../eigma-cash/deployments/SASHtoken.json');
    const abiRouter = require('../../../eigma-cash/deployments/uniswapRouter.json');
    const abiBank = require('../../../eigma-cash/deployments/bank.json');
    if (this.provider) {
      this.setState({
        currentAddress: this.provider.getAddress(),
      });
      this.contracts.SGMTOKEN = new Contract(this.externalTokens.SGMTOKEN[0], abi, this.provider);
      var totalSupply = await this.contracts.SGMTOKEN.totalSupply();
      this.contracts.uniswapRouter = new Contract(this.externalTokens.uniswapRouter[0], abiRouter, this.provider);
      const unit = '1000000000000000000';
      const mountIn = BigNumber.from(unit);
      var currentPrice = await this.contracts.uniswapRouter.getAmountsOut(mountIn, [this.externalTokens.SGMTOKEN[0], this.externalTokens.USDT[0]]);
      this.contracts.bank = new Contract(this.externalTokens.bank[0], abiBank, this.provider);
      var mintingCost = await this.contracts.bank.getBondExchangeRateSASHtoSGM(mountIn);
    }
    totalSupply = totalSupply ? getDisplayBalance(totalSupply, 1, 18) : '0';
    currentPrice = currentPrice ? getDisplayBalance(currentPrice[1], 2) : '0';
    mintingCost = mintingCost ? getDisplayBalance(mintingCost, 3) : '0';
    this.setState({
      totalSupply,
      currentPrice,
      mintingCost,
      provider,
    });
  }

  /**
   * @onClaimClick
   */
  onClaimClick = () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    this.setState({
      disIsModal: true,
    });
  };

  // Pop-up box OK
  public handleDisOk = () => {
    this.setState({
      disIsModal: false,
    });
  };

  // Cancel in the pop-up box
  public handleDisCancel = () => {
    this.setState({
      disIsModal: false,
    });
  };

  /* Process the closing and opening functions of the purchased SGM BOND box */
  public handleBuySgmBondStatus = (type?: string) => {
    if (type !== 'buy') {
      this.setState({
        status: !this.state.status,
        bondTitle: 'STAKE Token for BOND',
        type: 'buy',
      });
    } else {
      /*
      title:STAKE Token for BOND,
      * */
      this.setState({
        status: !this.state.status,
        bondTitle: 'BUY DBGT BOND',
        type: 'staking',
      });
    }
  };

  public handleAirdropStatus = () => {
    this.setState({
      claimAirdropStatus: !this.state.claimAirdropStatus,
    });
  };

  public handleProposalsStatus = () => {
    this.setState({
      proposalsStatus: !this.state.proposalsStatus,
    });
    this.proposals.current.getData();
  };

  /**
   * proposals  Page Stacking DBGT Button jump
   * */
  public handleStackingDBGT = () => {
    this.handleProposalsStatus();
    this.handleBuySgmBondStatus();
  };

  public render() {
    const {
      totalSupply, currentPrice, mintingCost, disIsModal,
    } = this.state;
    return (
      <div>
        <div className={styles.title}>DBGT</div>
        <div className={styles.img_container}>
          <div className={styles.img_base}>
            <img alt="" src={particle} width="320px" height="320px" />
            <div className={styles.img_1}>
              <img alt="" src={cir1} width="140px" />
            </div>
            <div className={styles.trian}>
              <img alt="" src={trian} width="5px" height="5px" />
            </div>
            <div className={styles.img_2}>
              <img alt="" src={cir} width="10px" height="10px" />
            </div>
          </div>
        </div>
        <div className={styles.buts}>
          {/*
          <div className={styles.but1} onClick={() => {
            this.handleBuySgmBondStatus('buy')
          }}> */}
          <div
            className={styles.but1}
            onClick={() => {
              this.handleBuySgmBondStatus('buy');
            }}
          >
            <span>Buy DBGT BOND</span>
          </div>
          <div
            className={styles.but1}
            onClick={() => {
              this.handleBuySgmBondStatus('staking');
            }}
            style={{ marginTop: 20 }}
          >
            {/* <div className={styles.but1} onClick={() => {
            this.handleBuySgmBondStatus('buy')
          }} style={{marginTop: 20}}> */}
            <span>STAKE Token for BOND</span>
          </div>
          <div className={styles.but1} onClick={this.handleProposalsStatus} style={{ marginTop: 20 }}>
            {/* <div className={styles.but1} onClick={() => {
            this.handleBuySgmBondStatus('buy')
          }} style={{marginTop: 20}}> */}
            <span>STAKE Token & VOTE</span>
          </div>
          <div className={styles.but1} style={{ margin: '20px 0' }} onClick={this.handleAirdropStatus}>
            {/* <div className={styles.but1} style={{margin: '20px 0'}} onClick={() => {
            this.handleBuySgmBondStatus('buy')
          }}> */}
            <span>Claim Airdrop </span>
          </div>
          <div className={styles.but2}>
            <span>Debond Governance</span>
          </div>
          <div className={styles.but3}>
            <span>DBGT current price</span>
            <span className={styles.price} style={{ color: '#AC930B' }}>{currentPrice}</span>
          </div>
          <div className={styles.but3}>
            <span>DBGT Supply </span>
            <span className={styles.price} style={{ color: '#5998E0' }}>{totalSupply}</span>
          </div>
          <div className={styles.but3}>
            <span>DBGT minting cost</span>
            <span className={styles.price} style={{ color: '#CC93D3' }}>{mintingCost}</span>
          </div>
          <div className={styles.but3}>
            <span>Pending Proposal</span>
            <span className={styles.price} style={{ color: 'green' }}>9/12</span>
          </div>
        </div>

        <div>
          {/* <UnderConstructionModal visible={this.state.status} onCancel={this.handleBuySgmBondStatus} /> */}

          <BuySGMBond
            provider={this.provider}
            title={this.state.bondTitle}
            status={this.state.status}
            close={this.handleBuySgmBondStatus}
            balances={this.state.balance}
          />
          <ClaimAirdrop provider={this.provider} web3={this.props.web3} config={this.props.config} title="DBGT" close={this.handleAirdropStatus} status={this.state.claimAirdropStatus} currAddress={this.state.currentAddress} />
          <Proposals ref={this.proposals} provider={this.provider} onStackingDBGT={this.handleStackingDBGT} title="PROPOSALS" close={this.handleProposalsStatus} status={this.state.proposalsStatus} />
          <Module
            disView={disIsModal}
            provider={this.provider}
            closeView={this.handleDisCancel}
            openView={this.handleDisOk}
            contracts={this.contracts}
          />
        </div>
      </div>
    );
  }
}
