import React, { Component } from 'react';
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import MyModal from '../../components/Modal/Index';
import IconFont from '../../components/IconFont/IconFont';
import styles from './css/info.module.css';
import info01 from '../../assets/info01.png';
import info02 from '../../assets/info02.png';
import info04 from '../../assets/info04.png';
import info05 from '../../assets/info05.png';
import info06 from '../../assets/info06.png';
import info07 from '../../assets/info07.png';
import info08 from '../../assets/info08.png';
import info09 from '../../assets/info09.png';
import info10 from '../../assets/info10.png';
import info11 from '../../assets/info11.png';
import './css/info.css';
import { Close, Refresh } from '../../components/Icon/Icon';
import UnderConstructionModal from '../../components/UnderConstructionModal/UnderConstructionModal';

class Info extends Component {
  public infoNav: any;

  /**
   * Ref the alias
   * */
  ref = {
    seeMore: { current: null as any},
    erc3475: { current: null as any},
    future: { current: null as any},
    debond: { current: null as any},
    wallet: { current: null as any},
    dex: { current: null as any},
    nav: { current: null as any},
  };

  state = {
    width: document.documentElement.clientWidth,
    visible: false,
    navStatus: false,
    navHeight: 1255,
  };

  componentDidMount() {
    this.infoNav = this.ref.nav.current;
    window.addEventListener('resize', this.handleResize.bind(this)); // 监听窗口大小改变
    const clientW = document.documentElement.clientWidth;
    this.handleClientW(clientW, 750);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize = (e:any) => {
    const e_width = e.target.innerWidth;
    this.handleClientW(e_width, 750);
    // console.log('浏览器窗口大小改变事件', e.target.innerWidth);
  };

  handleClientW = (width:any, num:any) => {
    if (width > num) {
      this.setState({
        navStatus: false,
      });
    }
  };

  /**
   * Popup window switch state
   * */
  public handleStatus = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  /**
   * The construction of shot window
   * */
  public modal = () => (
    <UnderConstructionModal onCancel={this.handleStatus} visible={this.state.visible} />
  );

  /**
   * The info inside module scrolling smooth jump jump
   * @param {event} event
   * @param {string} refName
   * @param {event} that
   * @param type
   * */
  public handleToModule = (event: any, refName: string, that:any, type:any) => {
    // 关闭导航栏
    if (type === 'nav') {
      this.handleNav();
    }
    if (!that.ref.hasOwnProperty(refName)) {
      if (refName.includes('##')) {
        this.handleStatus();
      }
      if (refName.includes('http')) {
        window.open(refName, '_blank');
      }
      return;
    }

    const module = that.ref[refName].current;
    const { scrollTop } = document.documentElement;
    console.log(module.offsetTop, document.documentElement.scrollTop);
    // document.documentElement.scrollTop = module.offsetTop
    console.log(scrollTop - module.offsetTop);
    document.documentElement.scrollTop = module.offsetTop;
    /* let timer = setInterval(()=>{
       if (document.documentElement.scrollTop>=module.offsetTop) {
         if (document.documentElement.scrollTop+50>=module.offsetTop && document.documentElement.scrollTop-50<=module.offsetTop){
           clearInterval(timer)
         }
         document.documentElement.scrollTop -= 50
         console.log(document.documentElement.scrollTop)
       }else if(document.documentElement.scrollTop<=module.offsetTop){
         if (document.documentElement.scrollTop+50>=module.offsetTop && document.documentElement.scrollTop-50<=module.offsetTop){
           clearInterval(timer)
         }
         document.documentElement.scrollTop += 50

       }

     },1) */
  };

  /**
   * Generate ERC - 3475 list items
   * */
  public generateItem = () => {
    const list = [
      { index: '01', name: 'FRB', text: 'Fixed-rate Bonds' },
      { index: '02', name: 'LBP', text: 'LP Bonds' },
      { index: '03', name: 'NFTB', text: 'NFT Bonds' },
      { index: '04', name: 'MB', text: 'Mixed Bonds' },
    ];
    return list.map((it, index) => (
      <div key={index} className={`${styles.content_item} content_item`}>
        <h4 className={styles.item_title}>{it.index}</h4>
        {' '}
        <p className="name">{it.name}</p>
        {' '}
        <p
          className="text"
        >
          {it.text}
        </p>
      </div>
    ));
  };

  /**
   * To generate the navigation bar
   * */
  public generateNav = () => {
    const navList = [
      {
        name: 'DEBOND',
        name_sub: 'debond',
      },
      {
        name: 'ERC3475',
        name_sub: 'ERC3475',
      },
      {
        name: 'Bond Wallet',
        name_sub: 'wallet',
      },
      {
        name: 'Bond Dex',
        name_sub: 'dex',
      },
      { name: 'About', name_sub: 'https://sigma-protocol.medium.com/introducing-sigma-protocol-a-bond-based-decentralized-monetary-model-626801006af0' },
      { name: 'Github', name_sub: 'https://github.com/Sigmoid-Protocol/' },
      { name: 'Telegram', name_sub: 'https://t.me/debond_protocol' },
      { name: 'Discord', name_sub: 'https://discord.gg/GYdhhMhV' },
      { name: 'Roadmap', name_sub: '##' },
      { name: 'Whitepaper', name_sub: '##' },
      { name: 'Medium', name_sub: 'https://debond-protocol.medium.com/' },
      { name: 'Twitter', name_sub: 'https://twitter.com/DebondProtocol' },
      { name: 'Charts', name_sub: '##' },
      { name: 'Contract', name_sub: 'https://medium.com/coinmonks/draft-of-erc-bep-659-multiple-callable-bonds-standard-proposal-e6d7b7547e94' },
      { name: 'Governance Forum', name_sub: '##' },
      { name: 'Voting Portal', name_sub: '##' },
      { name: 'Documentation', name_sub: '##' },
      { name: 'Community', name_sub: '##' },
      { name: 'Reddit', name_sub: '##' },
      { name: 'Blog', name_sub: '##' },
      { name: 'FAQ', name_sub: '##' },
      { name: 'Help & Tutorials', name_sub: '##' },
      { name: 'Logo & Brand', name_sub: '##' },

    ];
    return navList.map((it, i) => (<li key={i} onClick={(e) => { this.handleToModule(e, it.name_sub, this, 'nav'); }}>{it.name}</li>));
  };

  /**
   * State of the navigation bar
   * */
  public handleNav = () => {
    this.setState({
      navStatus: !this.state.navStatus,
    });

    // this.ref.nav.style.height='auto'
  };

  /**
   * Rendering function
   * */
  render() {
    return (
      <div className="info">
        <section className={styles.header_wrap}>
          <header className={styles.header}>
            <h1 className={styles.logo}>
              <svg
                style={{ width: '100%', height: '100%' }}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 65 71"
              >
                <defs>
                  <pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 338 370">
                    <image
                      width="338"
                      height="370"
                      xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVIAAAFyCAMAAACQp6LrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAzUExURQAAAP///////////////////////////////////////////////////////////////7eV4oIAAAAQdFJOUwAQIDBAUGBwf4+fr7/P3+8FUYRsAAAACXBIWXMAABcRAAAXEQHKJvM/AAAMMklEQVR4Xu2c7ZqyOgxFQUFBQbz/qx0q9RsE2t1sJk/WL8+cd6QumyZpYTJZ8n15PNanpm0vneN6o8l3+6KsTs3wn/G4t760zfl8qg5F4a+tjd5l1bRe4SeN/0dZtiur1v8QyeXcq/WX0EBeHE9TMgeeSm+UJ/9zMJdTpcBrXlS/bd74UNqTyur1eq7/s9ZFOh3fSnuOKVaAgfO/nK15US9XMqq0/0qSTdU+gf2zydr7XDY9PRNK+2yVUOr1eir9ZTZPUV/8mJcyqTS11Gu999fZMPkhYAn8oTTL9mmltkd/nY2yMuDv/FSaZYe1s34l9c5faHsUoTl6RmmWpZ2o/QAO/kKbIi/Di55Zpdk+8US9tpuTGrSEPphXmn6iXi+bkpqXcZNoidLs6P9xOrrtSA1eQ+8sUpo++DcT/tFClyrNctjm3zQtv6nKaz+WGBYqzTLExeY4cUuqPKwO/WSx0qzyv5GU2l+MASDmbyxXKuO0ZTX/kJi/sUJpVvjfSQtnoha4BLxGqZBTQkGFm6I9q5RmB/9biZGeqMAp2rNOqUDRf6OTrKdAif7BSqXpm1NP5a+XnvzsL4lirdIMPYApWqEaFRv0jtVKM1D1NotM8B+xQe9YrzRP3+970m/65ynWsfVKs73/1fQEDG4V8GX0RsiohUqpnrQLaqL9taCJIJWi+gU14TFqgV9GbwQplVtOr9dkPX+CxDQQtlzJdKYDiZJUuqYlMANI7J7eSVL1J9xWC1QqGfopnKZsAgOVioZ+8CCnSFKOPggerVzW7wE7TbtRETzY3L+BDFCnibd+wscqcm7yAOg0dWoNH6pohgI6TT4VIkYq15feAG31p99Ej/nyZacpppYSOJaIUVr695ACcMxXpupCX4haooSnaXy/vxcwGqdUeDW9XiP3pWQyapRS8WnaRe2fptlx/iJOqfg0bf2FgxDa64lTmkusTW+c/ZUD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"
                    />
                  </pattern>
                </defs>
                <rect id="img2" width="65" height="71" fill="url(#pattern)" />
              </svg>
            </h1>
            <Link className="xs-hidden" to="/bank">
              <Button className={`xs-hidden ${styles.startBtn}`} size="large" ghost>LAUNCH APP ⍈</Button>
            </Link>
            <Button onClick={() => { this.handleNav(); }} className={styles.menu} size="large" ghost><IconFont type="icon-hanbaobaoicon" /></Button>
          </header>

          <nav id="info_nav" ref={this.ref.nav} style={{ height: this.state.navStatus && document.documentElement.clientWidth <= 750 && this.state.navHeight || 0 }} className="info_nav ">
            <ul>
              {this.generateNav()}
            </ul>
          </nav>
        </section>

        <section ref={this.ref.future} className={`${styles.future} future ${styles.center}`}>
          <div className={styles.title_wrap}>
            <h1 className={styles.title}>
              <span style={{ display: 'block' }} className={styles.title_sub}>Sigmoid</span>
              <span style={{ display: 'block' }}>Future</span>
              <span style={{ textDecoration: 'underline' }}>In the makin</span>
              g.
            </h1>
            <Link className={`${styles.startBtn} xs-block`} to="/bank">
              <Button className={`${styles.startBtn} xs-block`} size="large" ghost>LAUNCH APP ⍈</Button>
            </Link>
            <Button
              onClick={(e) => {
                this.handleToModule(e, 'debond', this, 'to');
              }}
              className={`${styles.seeMore} seeMore`}
              type="link"
              ghost
            >
              SEE MORE
              {' '}
              <ArrowDownOutlined
                ref={this.ref.seeMore}
              />
              {' '}

            </Button>
          </div>
          <div className={styles.poster}>
            <img src={info01} style={{ width: '100%' }} alt="" />
          </div>
        </section>

        <section ref={this.ref.debond} className={`${styles.debond} ${styles.center}`}>

          <img className={styles.poster} src={info02} alt="" />

          <article className={styles.article}>
            <h3 dir="rtl" className={styles.title}>
              <span style={{ display: 'block', marginBottom: '-0.2rem' }}> DEBOND </span>
              <small className={styles.sub_title}> Decentralised Bond —</small>
              {' '}
              <br />
              &lt;&gt;
            </h3>
            <div style={{ color: '#fff' }} className={`${styles.debond_text} debond_text`}>
              <p className="xs-hidden-flex">
                █████████
                <span style={{ marginLeft: '0.1rem' }} className={styles.text}>Collateralized debt obligations. </span>
                █████████████████
              </p>
              <p className="xs-flex">
                ███
                <span style={{ marginLeft: '0.1rem' }} className={styles.text}>Collateralized debt obligations. </span>
                ███████
              </p>
              <p>█████████████████████████████████████████████████████████</p>
              <p>
                <span className={styles.text}>Each bond corresponds to a specific loan agreement. </span>
                ████████
                <span className="xs-block">████</span>
              </p>
              <p>
                ███████████████
                <span
                  className={styles.text}
                  style={{ textAlign: 'right' }}
                >
                  Turn any digital asset into a bond, in one click.
                </span>
              </p>
              <p className="xs-hidden-flex">
                █████████████████
                <span>█████████</span>
                ███████████████
              </p>
              <p className="xs-flex">
                █████████
                <span>███████  </span>
                ███████████████
              </p>
              <p>
                █████
                <span className={styles.text} style={{ textAlign: 'right' }}>Split and bundle bonds for trading in the secondary market.</span>
              </p>
              <p style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
              >
                ████████████
                <span>███████████████████████████████████</span>
              </p>
            </div>
          </article>
        </section>

        <section className={`${styles.ecosystem} ${styles.center}`}>

          <div className={styles.list}>
            <h3 className={styles.title}>Debond Ecosystem</h3>
            <img className={`${styles.poster_m} xs-block`} src={info04} alt="" />

            <div className={styles.content}>
              <p className={`${styles.item} ecosystem_item`}>
                <span className="index index1">1</span>
                <span className={styles.name}>ERC-20</span>
                <span className={styles.nextName}>ERC-721</span>
                <span
                  className={styles.lastName}
                  onClick={(e) => {
                    this.handleToModule(e, 'erc3475', this, 'to');
                  }}
                >
                  ERC-3475
                </span>
              </p>
              <p className={`${styles.item} ecosystem_item`}>
                <span className="index index2">2</span>
                <span className={styles.name}>AMM</span>
                <span className={styles.nextName}>NFT</span>
                <span
                  className={styles.lastName}
                  onClick={(e) => {
                    this.handleToModule(e, 'debond', this, 'to');
                  }}
                >
                  Debond
                </span>
              </p>
              <p className={`${styles.item} ecosystem_item`}>
                <span className="index index3">3</span>
                <span className={styles.name}>Metamask</span>
                <span className={styles.nextName}>NFT wallet</span>
                <span
                  className={styles.lastName}
                  onClick={(e) => {
                    this.handleToModule(e, 'wallet', this, 'to');
                  }}
                >
                  Debond wallet
                </span>
              </p>
              <p className={`${styles.item} ecosystem_item`}>
                <span className="index index4">4</span>
                <span className={styles.name}>UNISWAP MakerDao</span>
                <span className={styles.nextName}>OpenSea ...</span>
                <span
                  className={styles.lastName}
                  onClick={(e) => {
                    this.handleToModule(e, 'dex', this, 'to');
                  }}
                >
                  Bond Dex
                  {' '}
                  <br />
                  {' '}
                  ABS loan
                </span>
              </p>
            </div>

          </div>
          <div className={`${styles.poster} xs-hidden`}>
            <img style={{ width: '100%' }} src={info04} alt="" />
          </div>
        </section>

        <section ref={this.ref.erc3475} className={`${styles.erc3475} ${styles.center}`}>
          <div className={styles.content}>
            <div className="erc3475_item xs-hidden">
              {this.generateItem()}
            </div>
            <article className={styles.article}>
              <h3 dir="rtl" className={styles.title}>
                ERC-3475
                {' '}
                <br />
                Multiple
                {' '}
                <br className="xs-block" />
                {' '}
                Callable
                {' '}
                <br className="xs-block" />
                {' '}
                Bonds
                <br />
                &lt;&gt;
              </h3>
              <div className="erc3475_item erc3475_item_m xs-block">
                {this.generateItem()}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className={styles.detail}>
                  Has a more complex data structure. Each bond is assigned to a unique algorithm and does not require an
                  additional smart contract. It is possible to create both traditional bonds and financial derivatives
                  like
                  futures and options under the ERC-3475 standard.
                </p>
                <Button className={styles.docBtn} type="default" ghost>
                  <span
                    className="xs-hidden"
                    onClick={() => { this.handleStatus(); }}
                    style={{ marginRight: 10 }}
                  >
                    Developer
                  </span>
                  {' '}
                  Documentation ⍈
                </Button>
                <p
                  className={styles.eth}
                  style={{
                    fontSize: '.24rem', display: 'flex', alignItems: 'center', flexDirection: 'row-reverse',
                  }}
                >
                  <a className={styles.eth} href="https://eips.ethereum.org/EIPS/eip-3475" target="_blank" style={{ textDecoration: 'underline', color: '#fff' }} rel="noreferrer">ETH Official Website</a>
                  <IconFont
                    type="icon-eth"
                    className={styles.eth_icon}
                  />
                </p>
              </div>

            </article>
          </div>
        </section>

        <section className={`${styles.standard} standard ${styles.center}`}>
          <div className={styles.top}>
            <div className={styles.content}>
              <h3 className={styles.title}>
                Debond
                <br />
                Standard Maker
              </h3>
              <p className={styles.text}>
                Bonds are an important tool that stabilizes the economy. However, there has not been any real DeBond
                product in the Defi market yet. That is why we have created ERC-3475 to fill in the gap.

              </p>
            </div>
            <div className={styles.poster}>
              <img src={info05} className={styles.img} alt="" />
            </div>
          </div>
          <div className={styles.top}>
            <div className={styles.poster}>
              <img src={info06} className={styles.img} alt="" />
            </div>
            <div dir="rtl" className={styles.content}>
              <h3 className={styles.title}>
                Low Access
                <br />
                Threshold
              </h3>
              <p dir="ltr" style={{ textAlign: 'right' }} className={styles.text}>
                Traditional bonds have extremely high entry requirements and are mostly available to governments and
                large-scale fund managers only. DeBonds, in contrast, can be automatically generated by any type of
                digital asset, thus allowing everyone to create their own bond.
              </p>
            </div>
          </div>
          <div className={styles.top}>
            <div className={styles.content}>
              <h3 className={styles.title}>
                No-Hassle
                <br />
                Endrsement
              </h3>
              <p className={styles.text}>
                We have a firm control over the collateralized assets through smart contract and decentralized capital
                (DeCapital). Unlike traditional bonds that rely on the credit endorsement of a single agency, we use the
                underlying assets controlled by the smart contract and the community to ensure the fulfillment of
                repayment.
              </p>
            </div>
            <div className={styles.poster}>
              <img src={info07} className={styles.img} alt="" />
            </div>
          </div>
          <div className={styles.top}>
            <div className={styles.poster}>
              <img src={info08} className={styles.img} alt="" />
            </div>
            <div dir="rtl" className={styles.content}>
              <h3 className={styles.title}>
                Debond
                <br />
                Ecology
              </h3>
              <p dir="ltr" style={{ textAlign: 'right' }} className={styles.text}>
                We provide DeBond DEX, wallet and other visualized bond creation tools that meet the ERC-3475
                requirements. Institutions and individuals can design their own bonds and use them to raise fund with
                our visualized programming port.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.wallet} wallet ${styles.center}`}>
          <div ref={this.ref.wallet} className={styles.top}>
            <div className={`${styles.content} content`}>
              <h3 className={styles.title}>
                Debond Wallet
                {' '}
                <br />
                &lt;&gt;
              </h3>
              <div className="xs-block" style={{ marginBottom: '1rem' }}>
                <img src={info09} style={{ width: '100%' }} alt="" />
              </div>
              <ul className={styles.introduce}>
                <li className={styles.item}>
                  DeBond wallet is an extension to the regular ERC-20 wallet, allowing for the centralized display of
                  all ERC-3475 assets of an user.
                </li>
                <li className={styles.item}>
                  There is no need for the users to download additional software or regenerate private keys. They can
                  access their ERC-3475 bonds by linking their existing wallet via metamask.
                </li>
              </ul>
              <Link className={`${styles.link}`} style={{ border: 0 }} to="/bonds">
                <Button
                  size="large"
                  type="default"
                  className={styles.useApp}
                  ghost
                >
                  USE APP
                  ⍈
                </Button>
              </Link>
            </div>
            <div style={{ width: '50%' }} className="xs-hidden">
              <img src={info09} style={{ width: '100%' }} alt="" />
            </div>
          </div>
          <div ref={this.ref.dex} className={`${styles.top} ${styles.top_dex}`}>
            <div style={{ width: '50%' }} className="xs-hidden">
              <img src={info10} style={{ width: '100%' }} alt="" />
            </div>
            <div className={`${styles.content} content`}>
              <h3 className={styles.title}>
                Bond Dex
                <small> — Decentralised Bond Exchange</small>
                &lt;&gt;
              </h3>
              <div className="xs-block" style={{ marginBottom: '1rem' }}>
                <img src={info10} style={{ width: '100%' }} alt="" />
              </div>
              <ul className={styles.introduce}>
                <li className={styles.item}>
                  Due to the non-homogeneity of the DeBonds, transactions are done using Dutch auction.
                </li>
                <li className={styles.item}>
                  After a bond is put onto the market, its original price is reduced until somebody offers to buy it.
                </li>
                <li className={styles.item}>
                  The DeBond Exchange supports all auctions that comply with the ERC-3475 standards.
                </li>
              </ul>
              <Link className={`${styles.link}`} style={{ border: 0 }} to="/bonds">
                <Button
                  size="large"
                  type="default"
                  className={styles.useApp}
                  ghost
                >
                  USE APP
                  ⍈
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className={`${styles.gov} ${styles.center}`}>
          <div>
            <h3 className={styles.title}>
              GOVERNANCE
              <span className={styles.title_small}>Decapital&lt;&gt;</span>
            </h3>
            <p className={styles.text}>
              A truly decentralised
              <br className="xs-block" />
              {' '}
              governance platform
            </p>
            <div className={styles.top}>
              <div className={styles.content}>
                <Link className={`${styles.link}`} style={{ border: 0 }} to="/gov">
                  <Button style={{ margin: 0 }} size="large" type="default" className={styles.useApp} ghost>
                    USE APP
                    ⍈
                  </Button>
                </Link>
              </div>
              <div className={styles.introduce}>
                <h4 className={styles.title_sub}>
                  INVESTMENT
                </h4>
                <p className={styles.text_sub}>
                  In order to increase the utilization efficiency of the collaterals in the bond ecology, we allow the
                  DBGT holders to discuss and determine the way the assets are used through decentralized governance

                </p>
              </div>
            </div>
          </div>
        </section>
        {this.modal()}
      </div>
    );
  }
}

export default Info;
