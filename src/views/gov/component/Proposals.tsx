import React, { Component } from 'react';
import {
  List, Button, Row, Col, Tabs, Layout, Empty, Card, Progress, Select,
} from 'antd';
import { CheckOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MyModal from '../../../components/Modal/Index';
import { Close, Refresh } from '../../../components/Icon/Icon';
import styles from '../css/proposal.module.css';
import config from '../../../config-production';

import '../css/proposal.css';
import { Contract } from 'ethers';
import abiTest from '../../../eigma-cash/testAbi/test.json';
import Loading from '../../../components/loading';

type Props = {
  status: boolean,
  title: string,
  close: any,
  onStackingDBGT?:any,
  provider?:any
}
const { Sider, Content } = Layout;
const { Option } = Select;
const data = [
  {
    title: 'Governance Upgrade',
    startDate: '8/20/2021',
    endDate: '8/30/2021',
    quorum: '30%',
    status: false,
    class: 1,
    nonce: 1,
    vote: 'false',
    proposalAddress: '0xASDSWEWQECSsdasaSDSDDFDFDF',
    detail: 'test ',
  },
  {
    title: 'Governance Upgrade',
    startDate: '8/20/2021',
    endDate: '8/30/2021',
    quorum: '30%',
    status: true,
    class: 1,
    nonce: 1,
    vote: 'false',
    proposalAddress: '0xASDSWEWQECSsdasaSDSDDFDFDFSFDSFDSFDSFWQEWQE',
  },
  {
    title: 'Governance Upgrade',
    startDate: '8/20/2021',
    endDate: '8/30/2021',
    quorum: '30%',
    status: false,
    class: 1,
    nonce: 1,
    vote: 'false',
    proposalAddress: '0xASDSWEWQECSsdasaSDSDDFDFDF',
    detail: '1111',
  },
  {
    title: 'Governance Upgrade',
    startDate: '8/20/2021',
    endDate: '8/30/2021',
    quorum: '30%',
    status: true,
    class: 1,
    nonce: 1,
    vote: 'false',
    proposalAddress: '0xASDSWEWQECSsdasaSDSDDFDFDFSFDSFDSFDSFWQEWQE',
    detail: '23534dfgdf',
  },
];

const address = config.testAddress.test[0];
class Proposals extends Component<Props> {
  state = {
    currentStatus: false,
    loading: false,
    currentData: {
      title: '',
      startDate: '',
      endDate: '',
      quorum: '',
      class: 1,
      nonce: 1,
      vote: '',
      proposalAddress: '',
      detail: '',
    },
    currentIndex: 0,
    dataSource: [] as any[],
  };

  public getData = async () => {
    this.setState({
      loading: true,
    });
    const Bank = new Contract(address, abiTest, this.props.provider);
    const dataSource = await Bank.getPropsoalsData();
    this.setState({
      dataSource: JSON.parse(dataSource),
      loading: false,
    });
  };

  public generateTemp = (item: any, index: number) => (
    <>
      <h3 className={styles.title}>
        Proposal #
        {index + 1}
        ：
        {item.title}
      </h3>
      <Row className={styles.content}>
        <Col span={5}>
          <span className={`${styles.block} ${styles.index}`}>{index}</span>
          <Button
            className={item.status && styles.executed || styles.defeated}
          >
            {item.status && 'Executed' || 'Defeated'}
          </Button>
        </Col>
        <Col span={14} className={styles.detail}>
          <p className={styles.detail_item}>
            <span className={styles.detail_key}>
              Start Date:
              <span
                className={styles.detail_data}
              >
                {item.startDate}
              </span>
            </span>
            <span className={styles.detail_key}>
              End Date:
              <span
                className={styles.detail_data}
              >
                {item.endDate}
              </span>
            </span>
            <span className={styles.detail_key}>
              Quorum:
              <span
                className={styles.detail_data}
              >
                {item.quorum}
              </span>
            </span>
          </p>
          <p className={`${styles.detail_item} ${styles.detail_item_more}`}>
            <span className={styles.detail_key}>
              CLASS:
              <span className={styles.detail_data}>{item.class}</span>
            </span>
            <span className={styles.detail_key}>
              NONCE:
              <span className={styles.detail_data}>{item.nonce}</span>
            </span>
            <span className={styles.detail_key}>
              VOTE:
              <span className={styles.detail_data}>{item.vote}</span>
            </span>
            <span className={styles.detail_key}>
              PROPOSAL ADDRESS:
              <span
                className={`${styles.detail_data} ${styles.detail_address}`}
              >
                {item.proposalAddress}
              </span>
            </span>
          </p>
        </Col>
        <Col span={5}>
          <p className={styles.detail_item_right} style={{ color: '#90F7DE' }}>
            <span>
              <CheckOutlined />
              {' '}
              For
            </span>
            <span
              style={{ color: '#fff' }}
            >
              1.22K TORN
            </span>
          </p>
          <p className={styles.detail_item_right} style={{ color: '#d01414' }}>
            <span>
              <CloseOutlined />
              {' '}
              Against
            </span>
            <span style={{ color: '#fff' }}> 1.22K TORN</span>
          </p>
        </Col>
      </Row>
    </>
  );

  public handleTabChange = (key: string) => {
  };

  public handleToggleStatus = () => {
    this.setState({
      currentStatus: !this.state.currentStatus,
    });
  };

  public handleProposalsDetail = (record:any, index:number) => {
    this.setState({
      currentData: record,
      currentIndex: index,
    });
  };

  public generateContent = (text:string) => (
    <p>{text}</p>
  );

  public handleChange = (value:string) => {

  };

  public onVote = async () => {
    const abi = require('../../../eigma-cash/deployments/bankTest.json');
    const bank = new Contract(config.externalTokens.TEST[0], abi, this.props.provider);
    const res = await bank.handleVote('0x3aFf7B140E43243356EF4Aa880242083a927EA91');
  };

  render() {
    return (
      <MyModal
        onCancel={this.props.close}
        visible={this.props.status}
        title={this.props.title}
      >
        <div className={`proposal_wrapper ${styles.proposal_wrap}`} style={{ display: this.state.currentStatus && 'none' || 'block' }}>
          <Row className={styles.proposals}>
            <Col xs={{ span: 8, push: 0 }} lg={{ span: 5, push: 4 }}>
              <h4 className={styles.balanceTitle}>DBGT BALANCE</h4>
              <p className={styles.balanceNum}>0.00 SGM Ⓘ</p>
            </Col>
            <Col xs={{ span: 8, push: 0 }} lg={{ span: 4, push: 5 }}>
              <Select className={`proposal_wrap ${styles.select}`} defaultValue="SIGMOID" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="SIGMOID">SIGMOID</Option>
              </Select>
              <p className="bi_type" style={{ textAlign: 'center', cursor: 'pointer' }}>
                <span>ETH</span>
                |
                <span className="active">HECO</span>
                |
                <span>BSC</span>
              </p>
            </Col>
            <Col xs={{ span: 8, push: 0 }} lg={{ span: 5, push: 6 }}>
              <h4 className={styles.balanceTitle}>VOTE BOND </h4>
              <p className={styles.balanceNum}>0.00 VOTE Ⓘ</p>
            </Col>
          </Row>
          <Row className={styles.btnGroup}>
            <Col xs={8} lg={5}>
              <Button className={styles.btn1} onClick={this.props.onStackingDBGT}>STACKING DBGT </Button>
            </Col>
            <Col
              push={14}
              span={5}
              xs={{
                span: 8,
                push: 8,
              }}
              lg={{
                span: 5,
                push: 14,
              }}
            >
              <Button className={styles.btn1}>NEW PROPOSAL</Button>
            </Col>
          </Row>
          <Tabs defaultActiveKey="1" centered onTabClick={this.handleTabChange}>
            <Tabs.TabPane tab="All" key="1" style={{ position: 'relative' }}>
              <Loading loading={this.state.loading} />
              <List
                className={styles.list_wrap}
                itemLayout="horizontal"
                dataSource={this.state.dataSource}
                renderItem={(item, index) => (
                  <List.Item className={styles.item_wrap} onClick={() => { this.handleToggleStatus(); this.handleProposalsDetail(item, index + 1); }}>
                    {this.generateTemp(item, index)}
                  </List.Item>
                )}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Active" key="2" style={{ position: 'relative' }}>
              <Loading loading={this.state.loading} />
              <List
                className={styles.list_wrap}
                itemLayout="horizontal"
                dataSource={this.state.dataSource}
                renderItem={(item, index) => (
                  <List.Item className={styles.item_wrap} onClick={() => { this.handleToggleStatus(); this.handleProposalsDetail(item, index + 1); }}>
                    {this.generateTemp(item, index)}
                  </List.Item>
                )}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div style={{ display: this.state.currentStatus && 'block' || 'none', padding: 40 }}>
          <p>
            <span style={{ cursor: 'pointer' }} onClick={() => { this.handleToggleStatus(); }}>
              <ArrowLeftOutlined />
              {' '}
              back
            </span>
          </p>
          <Row style={{ background: '#000' }}>
            <Col span={16} className={styles.detail_text}>
              <h1 className={styles.title}>
                Proposals
                {this.state.currentData.title}
                {' '}
                #
                {this.state.currentIndex}
              </h1>
              <div className={styles.detail_text_content}>
                {this.state.currentData.detail && this.generateContent(this.state.currentData.detail) || <Empty description="暂无数据" />}
              </div>
            </Col>
            <Col span={8}>
              <Card className="currentResult">
                <h3 className="title">Current results</h3>
                <p className={styles.voteInfo}>
                  <span>For</span>
                  {' '}
                  <span>25.109K TORN / 100%</span>
                </p>
                <Progress percent={100} showInfo={false} />
                <p className={styles.voteInfo}>
                  <span>Against</span>
                  {' '}
                  <span>300 TORN / 1%</span>
                </p>
                <Progress percent={1} status="exception" showInfo={false} />
                <p className={styles.voteInfo}>
                  <span>Quorum</span>
                  {' '}
                  <span>25K TORN / 100%</span>
                </p>
                <Progress percent={70} strokeColor="rgba(64,51,154,0.75)" showInfo={false} />
              </Card>
              <Card className="info">
                <h3 className="title">Info</h3>
                <p className={styles.voteInfo}>
                  <span>CLASS : </span>
                  <span>1</span>
                  <span>NONCE : </span>
                  <span>1</span>
                  <span>VOTE : </span>
                  <span>FALSE</span>
                </p>
                <p className={styles.voteInfo}>
                  <span>PROPOSALS ADDRESS : </span>
                  <span className={styles.address}>{this.state.currentData.proposalAddress}</span>
                </p>
              </Card>
              <Button size="large" className="voteBtn" onClick={() => { this.onVote(); }}>VOTE</Button>
            </Col>
          </Row>
        </div>
      </MyModal>
    );
  }
}

export default Proposals;
