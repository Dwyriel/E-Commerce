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
  // Recommended new tests
  Tel(tel: string){
    var val: RegExp = /[0-9]/;
    return val.test(tel);
  }

  /* (all ddd from Brazil) check ddd in two-digit groups
  * ?: agroup
  * after form groups of two digits, generate check options:
  * 2[12478] for Rio de Janeiro and Espírito Santo,
  * 3[1234578] for Minas Gerais,
  * 5[1345] para Rio Grande do Sul,
  * 7[134579] for Bahia and Sergipe,
  * [14689][1-9] for rest of Brazil.
  * ^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$ - (with parentheses, spaces and hyphens required)
  * ^\(?(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$ - (not required)
  */
  Ddd(ddd: string){
    var val: RegExp = /(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])/;
    return val.test(ddd);
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
