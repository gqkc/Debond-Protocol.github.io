import React from 'react';
import styles from './css/loan.module.css';
import Content from './components/Content';

type LoanProps = {
  provider: any
}

const Loan = function (props: LoanProps) {
  return (
    <div>
      <div className={styles.content}>
        <Content provider={props.provider} />
      </div>
    </div>
  );
};

export default Loan;
