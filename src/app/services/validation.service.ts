import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  /**
   * verifies if a string is an email or not.
   * @param text the text to be verified.
   * @returns a boolean indicating if the text is an email.
   */
  Email(email: string) {
    var val = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //if problematic use: ^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$
    return val.test(email);
  }


  /**
   * verifies if a string is a unicode name or not.
   * @param text the text to be verified.
   * @returns a boolean indicating if the text is an unicode name.
   */
  Name(name: string){
    var val: RegExp = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    return val.test(name);
  }

  /**
   * verifies if a pattern exists in a string. 
   * @param text the text to be verified.
   * @param val the RegExp that will verify the string.
   * @returns a boolean indicating if the text matches the pattern.
   */
  Custom(text: string, val: RegExp) {
    return val.test(text);
  }

  /** Potential RegExp for usage:
   * (\(\d{2}\))(\d{4,5}\-\d{4})  -  telefone com ddd
   * (\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})  -  telefone com ou sem ddd
   * ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$  -  senha com pelomenos 8 digitos e letra e numeros
   * ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$ - senha com pelomenos 8, letra maiuscula, minuscula, numero e character especial
   * 
   * More testing is required to check the result of all those RegExp's
  */
}
