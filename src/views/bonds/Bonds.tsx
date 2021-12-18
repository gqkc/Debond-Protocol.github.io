import React from 'react';
import { Content } from './component/Content';
import styles from './css/bonds.module.css';

type Props = {
    provider: any
}

export const Bonds = function (props: Props) {
  // var id = this.props.match.params ? this.props.match.params.id : "0";
  return (
    <div>
      {/* <div className={styles.header}><HeaderNav provider={this.provider}/></div> */}
      <div className={styles.content}>
        {/* {id == "1" ? <ContentOne provider={this.walletWithProvider} /> : <Content provider={this.walletWithProvider} />} */}
        <Content provider={props.provider} />
      </div>
    </div>
  );
};
