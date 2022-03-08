import ReactDOM from 'react-dom';
import React from 'react';

const BondBalance = ({ children }: { children?: any }) => {
  const [domReady, setDomReady] = React.useState(false);
  React.useEffect(() => {
    setDomReady(true);
  });

  return domReady
    ? ReactDOM.createPortal(children, document.getElementById('rightSider')!) : null;
};
export default BondBalance;
