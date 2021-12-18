const configurations: { [env: string]: any } = {
  development: {
    externalTokens: {
      DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
      HUSD: ['0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6', 8],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'GOS_HUSD-LP': ['0x85C0594364353B888E4213E33dbD8Ecd653506a4', 18],
      'GOC_HUSD-LP': ['0xC33F68fBBCB529faB10aB5FcFD77BaD7cE9fbfFA', 18],
      'HT_HUSD-GLP': ['0xBe963435F750bB60e45fFa98318E74ea6E3aC0d7', 18],
      'GOT_HUSD-GLP': ['0xC31b9f33fB2C54B789C263781CCEE9b23b747677', 18],
    },
    baseLaunchDate: new Date('2020-11-26T00:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  production: {
    externalTokens: {
      SASHTOKEN: ['0x427F29A0490571e01e22c626f69DCE6CAd642517', 18],
      SGMTOKEN: ['0x9dF543387Dfd631F77f09C8EeB874406E5ffE99e', 18],
      uniswapRouter: ['0xED7d5F38C79115ca12fe6C0041abb22F0A06C300', 8],
      bank: ['0xc3f50fCE4159D202C33004bB013b354Ff8dD8f54', 18],
      bonds: ['0x5ee27377c193428BAB9F106549bb6282Dac5FE69', 18],
      dex: ['0x0CE819823B9BAb4bbb98833bc6E7A8D42d180273', 18],
      claim: ['0x55fa767b59110982D75442213B3d9626aB99dD08', 18],
      USDT: ['0xa71edc38d189767582c38a3145b5873052c3e47a', 6],
      BNB: ['0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', 18],
      MDX: ['0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c', 18],
    },
  },
};

export type Config = {
  claim: any[],
  BANKTEST: any[],
  SASHtoken: any[],
  DBGTtoken: any[],
};

// New config
export function getConfigForNet(netId: 'main' | 'ropsten'): Config {
  const config = {
    main: {
      claim: [],
      BANKTEST: ['0x6B402F0A733A18028C67f870E3Dd11AFBc48dd7A', 18],
      SASHtoken: [],
      DBGTtoken: [],
    },
    ropsten: {
      claim: ['0x64fD8B830933b758a2595158E9dFA6c21Ef6b813', 18],
      BANKTEST: ['0x6B402F0A733A18028C67f870E3Dd11AFBc48dd7A', 18],
      SASHtoken: ['0x3620C0AE6B42787d3EbaC6cd31F10f8770037b66', 18],
      DBGTtoken: ['0xaf61172D83230800492EA98c461770791652b753', 18],
    },
  };

  return config[netId] || {};
}

// export default configurations[process.env.NODE_ENV || "development"];
export default configurations.production;
