export interface CryptoToken {
  id?: string,
  blockchain: 'BTC'|'BCH'|'ETH'|'BNB-BEP2'|'BNB-BEP20'|'ADA'|'UNKNOWN',
  status: 'PUBLIC'|'PRIVATE'|'TRASH'|'ARCHIVE',
  name: string,
  symbol: string,
  contract_address: string,
  launch_date?: string | Date,
  website?: string,
  description?: string,
  whitepaper?: string,
  socials?: TokenSocials,
  swaps_from_token?: [],
  swaps_to_token?: [],
  swaps?: SwapTransaction[],
  balance?: number,
  is_flagged?: boolean,
  tags?: Tag[],
}

export interface Tag {
  name: string;
}

export interface TokenSocials {
  email?: string,
  blog?: string,
  reddit?: string,
  facebook?: string,
  twitter?: string,
  github?: string,
  telegram?: string,
  linkedin?: string,
  discord?: string,
  instagram?: string,
  youtube?: string,
}

export interface SwapTransaction {
  hash: string,
  timestamp?: string,
  from_token?: string,
  from_amount?: number,
  from_price?: number,
  to_token?: string,
  to_amount?: number,
  to_price?: number,
  fee?: number,
}
