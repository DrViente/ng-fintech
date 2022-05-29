import { Directive, Injectable, Input } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

export function equalFieldsValidator(psw:string, psw2:string): ValidationErrors | null {
  if (!psw && !psw2){return null}
  if(psw.toLowerCase()===psw2.toLowerCase()){
    return null
  }
  return {errorDescr:'le password devono essere uguali'}
}


 // Direttiva (Template-Driven Forms), a sua volta usa la funzione precedente
 @Directive({
  selector: '[EqualFields]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EqualFieldsDirective,
      multi: true
    }
  ]
})
 export class EqualFieldsDirective implements Validator {
  fld1:string=''
  fld2:string=''
  @Input() set field1(val:string){
    this.fld1=val;
  }
  @Input() set field2(val:string){
    this.fld2=val;
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return equalFieldsValidator(this.fld1, this.fld2);
  }
}

 // Validatore asincrono con dipendenze (Reactive Forms)
 // In quest'ultimo caso, la versione per i Template-Driven sarà una
 // Direttiva che utilizzerà questo servizio.
 @Injectable({ providedIn: 'root' })
 export class EqualFieldsValidator {

   //constructor(private appleService: AppleService) {}

   //validate(): AsyncValidatorFn {
   //  return (...) => {
   //    return this.appleService.getApples.pipe(...);
   //  }
   //}
 }
