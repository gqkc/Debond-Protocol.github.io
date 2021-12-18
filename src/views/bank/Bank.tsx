import React from 'react';
import Web3 from 'web3';
import styles from './css/bank.module.css';
import { Content } from './component/Content';
import { Config } from '../../config';

type Props = {
    provider: any,
    web3: Web3 | null,
    config: Config | null,
}

export const Bank = function (props: Props) {
  return (
    <div className={styles.content}>
      <div><Content provider={props.provider} web3={props.web3} config={props.config} /></div>
    </div>
  );
};
