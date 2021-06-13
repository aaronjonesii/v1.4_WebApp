import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { CryptoToken, CryptoWallet, SwapTransaction } from "../models/crypto";
import { Tag } from "../models/crypto";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private cryptotokens = new BehaviorSubject<any>([]);

  shared_cryptotokens = this.cryptotokens.asObservable();

  constructor( private http: HttpClient ) { }

  update_cryptotokens(cryptotokens: CryptoToken[]) { this.cryptotokens.next(cryptotokens); }

  /**
   * Get list of requested crypto tokens
   * @param type_of_token
   * @returns list(Tokens)
   */
  get_crypto_tokens(type_of_token: string): Observable<CryptoToken[]> {
    let url = `${environment.apiURL}/crypto/`
    if (type_of_token === 'all') url = url + `all-tokens/`
    if (type_of_token === 'bsc') url = url + `bsc-tokens/`
    if (type_of_token === 'trashed') url = url + `trashed-tokens/`
    if (type_of_token === 'archived') url = url + `archived-tokens/`
    return this.http.get<CryptoToken[]>(`${url}`, {headers: this.httpHeaders});
  }
  /**
   * Get one Token
   * @returns dict(Token)
   */
  get_one_token(token_id: string): Observable<CryptoToken> {
    return this.http.get<CryptoToken>(`${environment.apiURL}/crypto/token/${token_id}/`, {headers: this.httpHeaders});
  }
  /**
   * Get list of all BSC Tokens
   * @returns list(Tokens)
   */
  get_bsc_tokens(): Observable<CryptoToken[]> {
    return this.http.get<CryptoToken[]>(
      `${environment.apiURL}/crypto/bsc-tokens/`,
      {headers: this.httpHeaders}
    );
  }

  /**
   * Create Single BSCToken
   * @returns CryptoToken
   */
  create_bsc_token(bsc_token: CryptoToken): Observable<CryptoToken> {
    return this.http.post<CryptoToken>(
      `${environment.apiURL}/crypto/tokens/`,
      bsc_token,
      {headers: this.httpHeaders}
    );
  }
  /**
   * Update Single BSCToken
   * @returns Updated_CryptoToken
   */
  update_token(token: CryptoToken): Observable<CryptoToken> {
    return this.http.put<CryptoToken>(
      `${environment.apiURL}/crypto/token/${token.id}/`,
      token,
      {headers: this.httpHeaders}
    );
  }

  /**
   * Delete single BSCToken
   * @returns Status Code 204
   */
  delete_one_token(token_id: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiURL}/crypto/token/${token_id}/`,
      {headers: this.httpHeaders}
    );
  }

  get_all_token_tags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiURL}/crypto/tags/`, {headers: this.httpHeaders});
  }
  /**
   * Get Token Price
   * @returns number
   */
  get_token_price(token: CryptoToken): Observable<any> {
    let token_blockchain = ''
    if (token.blockchain === 'BNB-BEP20') token_blockchain = 'binance-smart-chain'
    let token_vs_currency = 'usd'
    let url = `https://api.coingecko.com/api/v3/simple/token_price/${token_blockchain}?contract_addresses=${token.contract_address}&vs_currencies=${token_vs_currency}`
    return this.http.get<any>(`${url}`, {headers: this.httpHeaders});
  }

  /**
   * Get list of requested crypto wallets
   * @param type_of_wallet
   * @returns list(Wallets)
   */
  get_crypto_wallets(type_of_wallet: string): Observable<CryptoWallet[]> {
    let url = `${environment.apiURL}/crypto/`
    if (type_of_wallet === 'all') url = url + `all-wallets/`
    if (type_of_wallet === 'trashed') url = url + `trashed-wallets/`
    if (type_of_wallet === 'archived') url = url + `archived-wallets/`
    return this.http.get<CryptoWallet[]>(`${url}`, {headers: this.httpHeaders});
  }
  /**
   * Get one crypto wallet
   * @returns dict(Wallet)
   */
  get_one_crypto_wallet(crypto_wallet_address: string): Observable<CryptoWallet> {
    return this.http.get<CryptoWallet>(`${environment.apiURL}/crypto/wallet/${crypto_wallet_address}/`, {headers: this.httpHeaders});
  }
  // Create crypto wallet
  /**
   * Create single crypto wallet
   * @returns CryptoWallet
   */
  create_crypto_wallet(crypto_wallet: CryptoWallet): Observable<CryptoWallet> {
    return this.http.post<CryptoWallet>(
      `${environment.apiURL}/crypto/wallets/`,
      crypto_wallet,
      {headers: this.httpHeaders}
    );
  }
  // Update crypto wallet
  /**
   * Update single crypto wallet
   * @returns Updated_CryptoWallet
   */
  update_crypto_wallet(wallet_address: string, crypto_wallet: CryptoWallet): Observable<CryptoWallet> {
    return this.http.put<CryptoWallet>(
      `${environment.apiURL}/crypto/wallet/${wallet_address}/`,
      crypto_wallet,
      {headers: this.httpHeaders}
    );
  }
  // Delete crypto wallet
  /**
   * Delete single crypto wallet
   * @returns Status Code 204
   */
  delete_crypto_wallet(crypto_wallet_id: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiURL}/crypto/wallet/${crypto_wallet_id}/`,
      {headers: this.httpHeaders}
    );
  }

  /**
   * Get list of bsc tokens from crypto wallet address
   * @param wallet_address
   * @returns list(Tokens)
   */
  get_crypto_wallet_tokens(wallet_address: string): Observable<any> {
    return this.http.get<any>(`https://api.apeboard.finance/wallet/bsc/${wallet_address}`, {headers: this.httpHeaders});
  }

  /**
   * Get list of swap transactions
   * @returns list(SwapTransactions)
   */
  get_swap_transactions(): Observable<SwapTransaction[]> {
    return this.http.get<SwapTransaction[]>(
      `${environment.apiURL}/crypto/swaps/`,
      {headers: this.httpHeaders}
    );
  }

  /**
   * Create a single or multiple swap transactions
   * @param swap_transactions
   * @returns list(SwapTransactions)
   */
  create_swap_transactions(swap_transactions: SwapTransaction[]): Observable<SwapTransaction[]> {
    return this.http.post<SwapTransaction[]>(
      `${environment.apiURL}/crypto/swaps/`,
      swap_transactions,
      {headers: this.httpHeaders}
    );
  }

  /**
   * Delete a single swap transaction
   * @param swap_transaction_hash
   * @returns Status Code 204
   */
  delete_swap_transaction(swap_transaction_hash: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiURL}/crypto/swaps/${swap_transaction_hash}/`,
      {headers: this.httpHeaders}
    );
  }

}
