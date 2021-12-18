import React from 'react';
import Web3 from 'web3';
import { Content } from './component/Content';
import styles from './css/gov.module.css';
import { Config } from '../../config';

type Props = {
  provider: any,
  web3: Web3 | null,
  config: Config | null,
}

export const Gov = function (props: Props) {
  return (
    <div>
      <div className={styles.content}>
        <Content provider={props.provider} web3={props.web3} config={props.config} />
      </div>
    </div>
  );
};
