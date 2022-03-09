import React, { Component } from 'react';
import './table.css';
import {Col, Progress, Table} from 'antd';
import moment from 'moment';
import { Contract } from 'ethers';
import { bar_styles, make_bar } from '../../eigma-cash/format_util';
import Loading from '../loading/index';
import abiTest from '../../eigma-cash/testAbi/test.json';
import config from '../../config-production';

const address = config.testAddress.test[0];
const columns = [
  {
    title: (<>
      N
      <sup style={{ fontSize: 10 }}>o</sup>
            </>),
    dataIndex: 'N',
    width: 100,
  },
  {
    title: 'ETA',
    dataIndex: 'ETA',
    width: 100,
  },
  {
    title: 'PROGRESS',
    dataIndex: 'Progress',
    width: 300,
  },
  {
    title: 'IN SASH',
    dataIndex: 'sash',
    width: 100,
  },
  {
    title: 'IN USD',
    dataIndex: 'usd',
    width: 100,
  },
];
type Props = {
  refresh?:boolean
  provider?:any
}
class Index extends Component<Props> {
  state = {
    dataSource: [],
    mobile: false,
    loading: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this)); // 监听窗口大小改变
    const clientW = document.documentElement.clientWidth;
    this.handleClientW(clientW, 750);
    if (this.props.refresh) {
      this.getData();
    }
  }

  handleResize = (e: any) => {
    const e_width = e.target.innerWidth;
    this.handleClientW(e_width, 750);
  };

  handleClientW = (width: any, num: any) => {
    if (width > num) {
      this.setState({
        mobile: false,
      });
    } else {
      this.setState({
        mobile: true,
      });
    }
  };

  public generateDataSource = () => {
    // const dataSource = [];
  /*  for (let i = 0; i < 15; i++) {
      dataSource.push({
        nonce:Math.floor(Math.random() * 100),
        eta:moment(Date.now() - Math.floor(Math.random()*1000000000)).format('DD-MM-YYYY'),
        progress:Math.floor(Math.random() * 100),
        sash:(Math.random()*1000).toFixed(5),
        usd:(Math.random()*1000).toFixed(5),
      })
    } */
    const dataSource = [
      {
        nonce: 1,
        eta: '20-12-2021',
        progress: 20,
        sash: 424412.121321,
        usd: 45134.4454,
      },
      {
        nonce: 2,
        eta: '20-2-2022',
        progress: 20,
        sash: 424412.121321,
        usd: 45134.4454,
      },
      {
        nonce: 4,
        eta: '20-2-2022',
        progress: 20,
        sash: 42912.121321,
        usd: 45134.4454,
      },
      {
        nonce: 6,
        eta: '20-5-2022',
        progress: 20,
        sash: 784412.121321,
        usd: 45134.4454,
      },
      {
        nonce: 7,
        eta: '20-8-2022',
        progress: 20,
        sash: 478975412.12167,
        usd: 67134.445564,
      },
    ];
  };

  public getData = async () => {
    this.setState({ loading: true });
    console.log('address', address);
    const Bank = new Contract(address, abiTest, this.props.provider);
    console.log('Bank>>>', Bank);
    const dataSource = await Bank.getOutputData();
    this.setState({
      dataSource: JSON.parse(dataSource),
      loading: false,
    });
    // this.setState({
    //   dataSource,
    // })
  };

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <Loading loading={this.state.loading} />
        <Table
          className="BondsTables tables"
          bordered={false}
          size="small"
          tableLayout="fixed"
          showHeader
        // columns={columns}
          dataSource={this.state.dataSource}
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
            width="30%"
            title={<>PROGRESS</>}
            dataIndex="progress"
            key="progress"
            render={(tags) => (
              <Progress percent={tags} strokeColor="white"/>
            )}
          />
          <Table.Column title={<>DBIT</>} dataIndex="sash" key="sash" />
          <Table.Column title={<>USD</>} dataIndex="usd" key="usd" />
        </Table>
      </div>
    );
  }
}

export default Index;
