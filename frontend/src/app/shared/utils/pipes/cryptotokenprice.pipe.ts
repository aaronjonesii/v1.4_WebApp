import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'cryptoTokenPrice',
  pure: true
})
export class CryptoTokenPricePipe implements PipeTransform {
  transform(token_price: any): any {
    for (var key in token_price) {
      if ((token_price.hasOwnProperty(key)) && (token_price[key].usd)) {
        return token_price[key].usd
      } else {
        return 'No Price Data'
      }
    }
  }
}
