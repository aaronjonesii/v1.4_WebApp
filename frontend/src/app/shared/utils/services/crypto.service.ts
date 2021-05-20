import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { CryptoToken, SwapTransaction } from "../models/crypto";

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
   * Get list of all Tokens
   * @returns list(Tokens)
   */
  get_crypto_tokens(type_of_token: string): Observable<CryptoToken[]> {
    let url = `${environment.apiURL}/crypto/`
    if (type_of_token === 'all') url = url + `tokens/`
    if (type_of_token === 'bsc') url = url + `bsctokens/`
    return this.http.get<CryptoToken[]>(`${url}`, {headers: this.httpHeaders});
  }
  /**
   * Get one Token
   * @returns dict(Token)
   */
  get_one_token(token_id: string): Observable<CryptoToken> {
    return this.http.get<CryptoToken>(`${environment.apiURL}/crypto/token/${token_id}`, {headers: this.httpHeaders});
  }
  /**
   * Get list of all BSC Tokens
   * @returns list(Tokens)
   */
  get_bsc_tokens(): Observable<CryptoToken[]> {
    return this.http.get<CryptoToken[]>(
      `${environment.apiURL}/crypto/bsctokens/`,
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
   * Delete single BSCToken
   * @returns Status Code 204
   */
  delete_bsc_token(crypto_token_contract_address: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiURL}/crypto/tokens/${crypto_token_contract_address}/`,
      {headers: this.httpHeaders}
    );
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
