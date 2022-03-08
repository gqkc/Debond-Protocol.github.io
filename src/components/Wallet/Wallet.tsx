import React, {Component} from 'react';
import PropsTypes from 'prop-types';
import {
    Button, Collapse, Divider, Space, Spin, Table, Typography,
} from 'antd';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import styles from '../header/css/header.module.css';
import {Refresh, Close} from '../Icon/Icon';
import UnderConstructionModal from '../UnderConstructionModal/UnderConstructionModal';
import BondBalance from './BondBalance';

const {Panel} = Collapse;


class Wallet extends Component<any, any> {
    public constructor(props?: any) {
        super(props);
        this.state = {
            dataSource: props.dataSource,
            currCurrencyIndex: 2,
            value: props.value,
            status: false,
        };
    }

    public static propTypes = {
        initWallet: PropsTypes.any.isRequired,
        manageBool: PropsTypes.bool.isRequired,
        value: PropsTypes.string.isRequired,
        dataSource: PropsTypes.array.isRequired,
        hide: PropsTypes.func.isRequired,
        searchBonds: PropsTypes.func.isRequired,
    };

    public handleCurrencyToggle = (e: any) => {
        const index = Number(e.target.dataset.index);
        this.setState({
            currCurrencyIndex: index,
        });
    };

    /* Create a currency class switch template  */
    public createCurrencyTemp() {
        const list = ['ETH', 'BSC', 'HECO'];
        return list.map((it, i) => (
            <Typography.Link
                key={i}
                className={this.state.currCurrencyIndex === i ? styles.active : ''}
                data-index={i}
                onClick={this.handleCurrencyToggle}
            >
                {it}
            </Typography.Link>
        ));
    }

    public handleRefresh = (e: any) => {
        this.props.refresh(e);
    };

    public handleStatus = () => {
        this.setState({
            status: !this.state.status,
        });
    };

    render() {
        const currency = this.createCurrencyTemp();
        return (
            <div className={styles.walletright}>
                {/* Connect wallet */}
                <div className={styles.wallet}>
                    <Button
                        className={styles.headerButton}
                        onClick={this.props.initWallet}
                    >
                        {/* onClick={this.handleStatus}> */}
                        {this.props.value}
                    </Button>
                </div>

                {/* Currency switch  */}
                <div className={styles.bsctext}>
                    <Space
                        split={(
                            <Divider
                                type="vertical"
                                style={{
                                    width: 2,
                                    height: 14,
                                    backgroundColor: '#fff',
                                }}
                            />
                        )}
                    >
                        {currency}
                    </Space>
                </div>
                {/* bondsBalance */}
                <BondBalance>
                    <div className={styles.bondsBalance}>
                        <Button
                            className={this.props.manageBool ? `${styles.headerButton} ${styles.bondBalancesButton}` : `${styles.headerButton} ${styles.bondBalancesButton}`}
                            onClick={this.props.searchBonds}
                            // onClick={this.handleStatus}
                            icon={this.props.manageBool && (
                                <>
                                    <Close
                                        style={{position: 'absolute', right: '-25px', width: '20px'}}
                                        close={this.props.hide}
                                    />
                                    <Refresh
                                        style={{}}
                                        refresh={(e: any) => {
                                            this.handleRefresh(e);
                                        }}
                                    />
                                </>
                            ) || (
                                <DownOutlined style={{
                                    marginLeft: 5,
                                    marginTop: 5,
                                    transition: '.5s',
                                }}
                                />
                            )}
                        >
                            Bonds Balances
                        </Button>
                        {this.props.manageBool ? (
                            <div style={{width: '100%', position: 'relative', zIndex: 2}}>
                                {this.props.panels}
                            </div>
                        ) : null}
                    </div>
                </BondBalance>

                <UnderConstructionModal visible={this.state.status} onCancel={this.handleStatus}/>

            </div>
        );
    }
}

export default Wallet;
