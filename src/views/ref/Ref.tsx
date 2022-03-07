import React, { Component } from 'react';
import axios from 'axios';
import {
  Card, Row, Col, Button, List,
} from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { Contract } from 'ethers';
import UnderConstructionModal from '../../components/UnderConstructionModal/UnderConstructionModal';
import './css/ref.css';
import styles from '../bank/css/sash.module.css';
import { bar_styles, make_bar } from '../../eigma-cash/format_util';
import abiTest from '../../eigma-cash/deployments/bankTest.json';
import config from '../../config-test';

const address = config.externalTokens.BANKTEST[0];
type Props = {
  provider:any
}
export default class Ref extends Component<Props> {
  state = {
    provider: this.props.provider,
    maxsize: 20,
    dataSource: [] as any[],
    refData: [] as any[],
  };

  public handleToggle = () => {

  };

  componentDidMount() {
    this.getAirdropList();
    window.addEventListener('resize', this.handleResize.bind(this)); // 监听窗口大小改变
    const clientW = document.documentElement.clientWidth;
    this.handleClientW(clientW, 750);
  }

  public getData = async () => {
    const Bank = new Contract(address, abiTest, this.props.provider);
    const refData = await Bank.getRefData();
    this.setState({
      refData,
    });
  };

  public handleResize = (e:any) => {
    const e_width = e.target.innerWidth;
    this.handleClientW(e_width, 750);
  };

  public handleClientW = (width:any, num:any) => {
    if (width <= 750) {
      this.setState({
        maxsize: 20,
      });
    } else if (width >= 750 && width <= 960) {
      this.setState({
        maxsize: 30,
      });
    } else if (width >= 960 && width <= 1024) {
      this.setState({
        maxsize: 40,
      });
    } else {
      this.setState({
        maxsize: 20,
      });
    }
  };

  public generateTemp1 = () => {
    const arr = [
      {
        name: 'SASH BAlANCE',
        num: '115.79',
        unit: 'SASH Ⓘ',
      },
      {
        name: 'L1 SGM REQUIREMENT',
        num: '115.79/12',
        unit: 'SGM Ⓘ',
      },
      {
        name: 'SGM BALANCE',
        num: '23.79',
        unit: 'SGM Ⓘ',
      },
      {
        name: 'LOCKED SASH',
        num: '23.79',
        unit: 'SASH Ⓘ',
      },
      {
        name: 'L2 SGM REQUIREMENT',
        num: '23.79/24.34',
        unit: 'SGM Ⓘ',
      },
      {
        name: 'LOCKED SGM',
        num: '12.43',
        unit: 'SGM Ⓘ',
      },
    ];
    return arr.map((it, i) => (
      <Col span={8}>
        <h4>{it.name}</h4>
        <p>
          {it.num}
          {' '}
          {it.unit}
        </p>
      </Col>
    ));
  };

  public generateTemp2 = () =>
    /* const arr = [
      {
        name:"DIRECT EFERRALS",
        num:"321",
        unit:"",
      },
      {
        name:"INDIRECT REFERRALS",
        num:"321",
        unit:"",
      },
      {
        name:"TOTAL REWARD",
        num:"421.12",
        unit:"SASH Ⓘ ",
      }
    ]; */
    this.state.refData.map(({ name, num, unit }, i) => (
      <Col span={8}>
        <dl>
          <dt>
            {name}
            {' '}
            :
          </dt>
          <dd>
            {num}
            {' '}
            {unit}
          </dd>
        </dl>
      </Col>
    ));

  public getAirdropList = async () => {
    const html = await axios.get(`http://${window.location.host}/airdrop_list.csv`);
    const text = html.data;
    const textList = text.split(/[\n]/g);
    const count = textList ? textList.length : 0;
    const dataSource = [];
    for (let i = 0; i < count - 1; i++) {
      const unit = textList[i];
      const childList = unit.split(/,/g);
      const objectNew = {} as any;
      objectNew.index = childList[0];
      objectNew.address = childList[4];
      objectNew.amount = String(childList[5]).replace(/\r/g, '');
      dataSource.push(objectNew);
    }
    this.setState({
      dataSource,
    });
  };

  public WalletInfo = (data:any, type:any = false) => (
    <Row className={styles.climAirdrop}>
      <Col span={type && 5 || 5}>
        {Object.keys(data)[0]}
        {' '}
        {data.index}
      </Col>
      <Col span={type && 10 || 14}>
        {Object.keys(data)[1]}
        {' '}
        <span className={styles.address}>{data.address}</span>
      </Col>
      <Col span={type && 9 || 5} style={{ textAlign: 'right' }}>
        {Object.keys(data)[2]}
        {' '}
        <span className={styles.amount2}>{data.amount}</span>
      </Col>
    </Row>
  );

  public onRef = async () => {
    const abi = require('../../eigma-cash/deployments/bankTest.json');
    const bank = new Contract(config.externalTokens.TEST[0], abi, this.props.provider);
    await bank.handleRef('ref test');
  };

  render() {
    return (
      <div className="ref_wrap">
        {/* <UnderConstructionModal visible onCancel={this.handleToggle} /> */}
        <Card
          className="ref_card"
          title={(
            <>
              PROPOSALS
              <RedoOutlined style={{ cursor: 'pointer' }} />
            </>
)}
        >
          {/**

           */}
          {/* <Card className='ref_card' title={<>under construction... </>}>
          <Row style={{padding:"0 20px"}}>
            <Col style={{textAlign:'center'}} span={24}>
              <p> </p>
              <p style={{fontSize:20}}>At present, our system is under construction and 36% has been completed </p>
              <p style={{marginBottom:100,color:"#fff"}}>{make_bar(36,bar_styles[8],7,this.state.maxsize).str} 36%</p>
            </Col>
          </Row> */}
          <h3 className="title">POS</h3>
          <Row className="bond_info">
            {this.generateTemp1()}
          </Row>
          <Row className="ref-info">
            {this.generateTemp2()}
          </Row>
          <h3 className="title">LINK</h3>
          <p>HTTP://SGM.FINANCE/#REF=0124115HJSDFSHU32FAWB32AV Ⓘ</p>
          <Button size="large" onClick={() => { this.onRef(); }}>GENERATE & COPY</Button>
          <h3 className="title">REWARD</h3>
          <Row>
            <List
              className="airDrop"
              size="small"
              header={null}
              footer={null}
              dataSource={this.state.dataSource}
              pagination={{
                defaultPageSize: 10,
                total: this.state.dataSource.length,
                showSizeChanger: false,
              }}
              renderItem={(item:any) => <List.Item className="item">{this.WalletInfo(item)}</List.Item>}
            />
          </Row>
        </Card>
      </div>
    );
  }
}
