import React from "react";
import {NavLink} from "react-router-dom";
import styles from "./css/header.module.css";
import {Button, Collapse, Table, Spin,notification} from "antd";
import {UpOutlined, WarningOutlined,RightOutlined} from '@ant-design/icons';
import Web3 from "web3";
import {Contract, ethers} from "ethers";
import Store from '../../redux/index'
import styleCommon from "@common/css/util.module.css";
import Links from "../Links/index"
import {getDisplayBalance, roundFun} from "../../eigma-cash/format_util";
import Wallet from "../Wallet/Wallet";
import "../header/css/header.css"
import Loading from "../loading";
const columns = [
  {
    title: "N",
    dataIndex: "N",
    width: 15
  },
  {
    title: "ERD",
    dataIndex: "ERD",
    width: 50
  },
  {
    title: "Balances",
    dataIndex: "Balances",
    width: 35
  },
];
type IMyComponentState = {
  value: string;
  isModalVisible: boolean;
  disabled: boolean;
  amount: number;
  dataSource: any;
  currCurrencyIndex: number;
};
type IMyComponentProps = {
  provider: any
};
const {Panel} = Collapse;
const genExtra = () => (
  <RightOutlined style={{position:'absolute',right:15,bottom:-20}}/>
);
export class HeaderNav extends React.Component<IMyComponentProps, any> {
  public tree: any;
  public list: Array<any>;
  public contracts: any;
  public walletWithProvider: any;
  public currentAddress: any;
  public dataSourceStatus: boolean;
  public constructor(props?: any, context?: any) {
    super(props);
    this.state = {
      value: "Connect Wallet",
      amount: 0,
      isModalVisible: false,
      disabled: true,
      loading: true,
      dataSource: [],
      manageBool: false,
    };
    this.list = [];
    this.dataSourceStatus = true;
    this.contracts = {};
  }
  componentDidMount() {
    this.initData();
  }
  public async initData() {
    //The introduction of web 3
    // Check if it's a new MetaMask or DApp browser
    let web3Provider;
    const windowNew = window as any;
    if (windowNew.ethereum) {
      web3Provider = windowNew.ethereum;
      try {
        // Requesting user Authorization
        await windowNew.ethereum.enable();
      } catch (error) {
        // The user is not authorized
        console.error("User denied account access");
        return;
      }
    } else if (windowNew.web3) {
      // original MetaMask Legacy dapp browsers...
      web3Provider = windowNew.web3.currentProvider;
    } else {
      alert("It is detected that there is no metamask plug-in in the current browser!");
      web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }
    var web3 = new Web3(web3Provider);
    //Extract the user from the Meta Mask
    let provider = new ethers.providers.Web3Provider(web3Provider);
    let walletWithProvider = provider.getSigner();
    this.walletWithProvider = walletWithProvider;
    this.props.provider(walletWithProvider);
  }
  public initWallet = async () => {
    if (this.state.value!=='Connect Wallet') return;

    var web3Provider;
    var windowNew = window as any;
    if (windowNew.ethereum) {
      web3Provider = windowNew.ethereum;
      try {
        await windowNew.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
        return;
      }
    } else if (windowNew.web3) {
      // original MetaMask Legacy dapp browsers...123456
      web3Provider = windowNew.web3.currentProvider;
    } else {
      alert("It is detected that there is no metamask plug-in in the current browser！");
      web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }
    var web3 = new Web3(web3Provider);
    let provider = new ethers.providers.Web3Provider(web3Provider);
    let walletWithProvider = provider.getSigner();
    this.walletWithProvider = walletWithProvider;
    this.props.provider(walletWithProvider);

    var privateAddress = await walletWithProvider.getAddress();
    this.currentAddress = privateAddress;
    if (privateAddress) {
      Store.dispatch({
        type:true,
        accountAddress:privateAddress
      })
      privateAddress = this.getSubStr(privateAddress);
      this.setState({
        value: privateAddress,
      });
    }
    const list = await this.detailData();
    if (list) {
      this.dataSourceStatus = false;
      this.setState({
        dataSource: list
      })
    }

  };
  public detailData = async () => {
    const abi = require("../../eigma-cash/deployments/bonds.json");
    this.contracts["bonds"] = new Contract("0x5ee27377c193428BAB9F106549bb6282Dac5FE69", abi, this.walletWithProvider);
    const classList = await this.contracts["bonds"].getClassCreated();
    const count = classList.length;
    let list = [];

    for (let i = 0; i < count; i++) {
      var sym = await this.contracts["bonds"].getBondSymbol(classList[i]);
      var nonce = await this.contracts["bonds"].getNonceCreated(classList[i]);
      var listTwo = [];
      var amount = 0;
      for (var j = 0; j < nonce.length; j++) {
        var unit = {} as any;
        var mount = await this.contracts["bonds"].balanceOf(this.currentAddress, classList[i], nonce[j]);
        var info = await this.contracts["bonds"].getBondInfo(classList[i], nonce[j]);
        var time = info[1].toNumber();
        var timestamp = new Date(time * 1000);
        var longtime = timestamp.toLocaleDateString().replace(/\//g, "-");
        mount = getDisplayBalance(mount, 5, 18);
        unit["N"] = nonce[j].toNumber();
        unit["ERD"] = longtime;
        unit["Balances"] = parseFloat(mount);
        listTwo.push(unit);
        amount += parseFloat(mount);
      }
      var obj = {} as any;
      obj["key"] = sym;
      obj["name"] = sym;
      obj["amount"] = roundFun(amount, 5);
      obj["description"] = listTwo;
      list.push(obj);
    }
    this.list = list;
    return list;
  }

  public searchBonds = (e: any) => {
    if (!this.currentAddress) {
      notification.open({
        message: 'No wallet connected',
        description:'Please click the Connect Wallet button first',
        icon: <WarningOutlined style={{color:"#faad14"}}/>,
      });
      // alert("No wallet connected");
      return;
    }
    if (this.state.manageBool) return;
    this.setState({
      manageBool: true,
      // dataSource: this.list
    })
  };
  public makeTable(dataSource: any) {
    return (
      <Table
        className={`tables ${styles.tables}`}
        bordered={false}
        size="small"
        tableLayout={"fixed"}
        showHeader
        columns={columns}
        pagination={false}
        dataSource={dataSource.description}
      />
    );
  }
  public makePanels() {
    const dataSource = this.state.dataSource;
    const length = dataSource.length;
    if (length) {
      let panels: any[];
      panels = dataSource.map((item?: object, i?: any) => (
        <Panel header={<div style={{display: "inline"}}>
          <div style={{display: "inline"}}>{dataSource[i].name}</div>
          <div style={{float: "right"}}>{dataSource[i].amount}</div>
        </div>} extra={genExtra()} key={i} className={`collapse ${styles.collapse_panel}`} >  {this.makeTable(dataSource[i])}
        </Panel>
      ))
      const item = (
        <div style={{position: "absolute", marginTop: "15px", width: "100%"}}>
          <div style={{marginBottom: "10px", display: "flex", justifyContent: "space-between"}}>
            <Button style={{background: "black", color: "white"}}>Search...</Button>
            <Button style={{background: "black", color: "white"}} onClick={this.hide}>Hide All... <UpOutlined /></Button>
          </div>
          <div>
            <NavLink exact={true} activeClassName={styles.active} to="/bonds/1">
              <Button style={{background: "black", color: "white", width: "100%"}}>Detailed Infos...</Button>
            </NavLink>
          </div>
        </div>
      )
      panels.push(item);
      return (<Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        accordion={true}
        className={styles.collapse}
        expandIconPosition={"right"}
      >
        {panels}
      </Collapse>);
    } else {
      return (
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          accordion={true}
          className={styles.collapse}
          expandIconPosition={"right"}
        >
          <Panel header={'SASH'} className={styles.collapse_panel} style={{position: 'relative', height: 200}} key={1}>
            <Loading loading={this.state.loading} />
          </Panel>
        </Collapse>
      )
    }
  }
  public handleRefresh = async (e: any)=>{
    this.setState({
      dataSource:[]
    })
    await this.detailData().then(res=>{
      this.setState({
        dataSource:res
      })
    })
  }
  public hide = () => {
    console.log("manage bool ", this.state.manageBool);
    this.setState({
      manageBool: false
    })
    // this.forceUpdate();
  }
  public getSubStr(str: any) {
    var subStr1 = str.substr(0, 5);
    var subStr2 = str.substr(str.length - 5, 5);
    var subStr = subStr1 + "..." + subStr2;
    return subStr;
  }
  public render() {
    const panels = this.makePanels();
    return (
      <div className={`header ${styles.header} ${styleCommon.flex} ${styleCommon.fl_wrap}`}>
        <div className={styles.logoimg}>
          {/*<img src={logo} alt="" className={styles.pcLogo}/> <img src={logo} alt="" className={styles.mobileLogo}/>*/}
          <svg className="logo" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 65 71" style={{ height: "100%"}}><defs><pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 338 370"><image width="338" height="370" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVIAAAFyCAMAAACQp6LrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAzUExURQAAAP///////////////////////////////////////////////////////////////7eV4oIAAAAQdFJOUwAQIDBAUGBwf4+fr7/P3+8FUYRsAAAACXBIWXMAABcRAAAXEQHKJvM/AAAMMklEQVR4Xu2c7ZqyOgxFQUFBQbz/qx0q9RsE2t1sJk/WL8+cd6QumyZpYTJZ8n15PNanpm0vneN6o8l3+6KsTs3wn/G4t760zfl8qg5F4a+tjd5l1bRe4SeN/0dZtiur1v8QyeXcq/WX0EBeHE9TMgeeSm+UJ/9zMJdTpcBrXlS/bd74UNqTyur1eq7/s9ZFOh3fSnuOKVaAgfO/nK15US9XMqq0/0qSTdU+gf2zydr7XDY9PRNK+2yVUOr1eir9ZTZPUV/8mJcyqTS11Gu999fZMPkhYAn8oTTL9mmltkd/nY2yMuDv/FSaZYe1s34l9c5faHsUoTl6RmmWpZ2o/QAO/kKbIi/Di55Zpdk+8US9tpuTGrSEPphXmn6iXi+bkpqXcZNoidLs6P9xOrrtSA1eQ+8sUpo++DcT/tFClyrNctjm3zQtv6nKaz+WGBYqzTLExeY4cUuqPKwO/WSx0qzyv5GU2l+MASDmbyxXKuO0ZTX/kJi/sUJpVvjfSQtnoha4BLxGqZBTQkGFm6I9q5RmB/9biZGeqMAp2rNOqUDRf6OTrKdAif7BSqXpm1NP5a+XnvzsL4lirdIMPYApWqEaFRv0jtVKM1D1NotM8B+xQe9YrzRP3+970m/65ynWsfVKs73/1fQEDG4V8GX0RsiohUqpnrQLaqL9taCJIJWi+gU14TFqgV9GbwQplVtOr9dkPX+CxDQQtlzJdKYDiZJUuqYlMANI7J7eSVL1J9xWC1QqGfopnKZsAgOVioZ+8CCnSFKOPggerVzW7wE7TbtRETzY3L+BDFCnibd+wscqcm7yAOg0dWoNH6pohgI6TT4VIkYq15feAG31p99Ej/nyZacpppYSOJaIUVr695ACcMxXpupCX4haooSnaXy/vxcwGqdUeDW9XiP3pWQyapRS8WnaRe2fptlx/iJOqfg0bf2FgxDa64lTmkusTW+c/ZUD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"></image></pattern></defs><rect id="img12" width="65" height="71" fill="url(#pattern)"></rect></svg>
        </div>
        <div className={styles.links}>
          <Links/>
          <Wallet
            initWallet={this.initWallet}
            value={this.state.value}
            dataSource={this.state.dataSource}
            hide={this.hide}
            searchBonds={(e: any)=>{
              this.searchBonds(e)
            }}
            refresh={(e: any)=>{
              this.handleRefresh(e)
            }}
            manageBool={this.state.manageBool}
            panels={panels}
          />
        </div>
      </div>
    );
  }
}
