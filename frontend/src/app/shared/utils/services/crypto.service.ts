import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { BSCToken, SwapTransaction } from "../models/crypto";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor( private http: HttpClient ) { }

  /**
   * Get list of BSCTokens
   * @returns list(BSCTokens)
   */
  get_bsc_tokens(): Observable<BSCToken[]> {
    return this.http.get<BSCToken[]>(
      `${environment.apiURL}/crypto/bsctokens/`,
      {headers: this.httpHeaders}
    );
  }

  /**
   * Create Single BSCToken
   * @returns BSCToken
   */
  create_bsc_token(bsc_token: BSCToken): Observable<BSCToken> {
    return this.http.post<BSCToken>(
      `${environment.apiURL}/crypto/bsctokens/`,
      bsc_token,
      {headers: this.httpHeaders}
    );
  }

  /**
   * Delete single BSCToken
   * @returns Status Code 204
   */
  delete_bsc_token(bsc_token_contract_address: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiURL}/crypto/bsctokens/${bsc_token_contract_address}/`,
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
