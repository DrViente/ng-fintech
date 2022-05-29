import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { EqualFieldsDirective } from 'src/app/shared/validators/equal-fields.validator';


@Component({
  selector: 'ng-register',
  template: `
    <form #f="ngForm" (ngSubmit)="SignIn(f)">
        <mat-form-field appearance="outline">
          <mat-label>E-Mail</mat-label>
          <input matInput placeholder="E-Mail" type="email"
            required pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"
            ngModel #emailRef="ngModel" name="email"
          >
          <mat-hint *ngIf="emailRef.errors?.['required'] && (emailRef.dirty || emailRef.touched)" class="invalidField">E-Mail Obbligatoria</mat-hint>
          <mat-hint *ngIf="emailRef.errors?.['pattern'] && (emailRef.dirty || emailRef.touched)" class="invalidField">Inserire un indirizzo e-mail valido</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput placeholder="Nome" type=""
            required minlength="2"
            ngModel #nomeRef="ngModel" name="nome"
          >
          <mat-hint *ngIf="nomeRef.errors?.['required'] && (nomeRef.dirty || nomeRef.touched)" class="invalidField">Nome Obbligatorio</mat-hint>
          <mat-hint *ngIf="nomeRef.errors?.['minlength'] && (nomeRef.dirty || nomeRef.touched)" class="invalidField">Il nome deve essere almeno di {{nomeRef.errors?.['minlength']}} caratteri</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Cognome</mat-label>
          <input matInput placeholder="Cognome" type=""
            required minlength="2"
            ngModel #cognomeRef="ngModel" name="cognome"
          >
          <mat-hint *ngIf="cognomeRef.errors?.['required'] && (cognomeRef.dirty || cognomeRef.touched)" class="invalidField">Cognome Obbligatorio</mat-hint>
          <mat-hint *ngIf="cognomeRef.errors?.['minlength'] && (cognomeRef.dirty || cognomeRef.touched)" class="invalidField">Il nome deve essere almeno di {{cognomeRef.errors?.['minlength'].requiredLength}} caratteri</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput placeholder="Password" [type]="!pswVisibile1? 'password' : ''"
            required
            ngModel #password1Ref="ngModel" name="password1"
            EqualFields [field1]="password1Ref.value" [field2]="password2Ref.value"
          >
          <mat-icon matSuffix *ngIf="pswVisibile1" (click)="MostraNascondiPsw(1)">visibility</mat-icon>
          <mat-icon matSuffix *ngIf="!pswVisibile1" (click)="MostraNascondiPsw(1)">visibility_off</mat-icon>
          <mat-hint *ngIf="password1Ref.errors?.['required'] && (password1Ref.dirty || password1Ref.touched)" class="invalidField">Inserire la password</mat-hint>
          {{password1Ref.errors|json}}
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput placeholder="Ripeti Password" [type]="!pswVisibile2? 'password' : ''"
            required
            ngModel #psw2Ref #password2Ref="ngModel" name="password2" (focus)="pswdiversa=false"
          >
          <mat-icon matSuffix *ngIf="pswVisibile2" (click)="MostraNascondiPsw(2)">visibility</mat-icon>
          <mat-icon matSuffix *ngIf="!pswVisibile2" (click)="MostraNascondiPsw(2)">visibility_off</mat-icon>
          <mat-hint *ngIf="password2Ref.errors?.['required'] && (password2Ref.dirty || password2Ref.touched)" class="invalidField">Inserire la password</mat-hint>
          <mat-hint *ngIf="pswdiversa" class="invalidField">le 2 password devono coincidere</mat-hint>
        </mat-form-field>

        <button mat-raised-button color="primary" type=submit [disabled]="f.invalid" class="fullWidth mb-2">Registrati</button>
        <!--<button mat-stroked-button color="primary" (click)="gotoLogIn.emit()">Hai già un account? Accedi</button>-->
    </form>
  `,
  styles: [`
    mat-form-field{
      display:block;
    }
  `
  ]
})
export class RegisterComponent implements OnInit {
  //@Output() gotoLogIn = new EventEmitter();
  @ViewChild('psw2Ref') Psw2!:ElementRef<HTMLInputElement>;
  pswVisibile1:boolean=false;
  pswVisibile2:boolean=false;
  pswdiversa:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

  SignIn(frm:NgForm){
    console.log('ok')
    if (frm.value.password1===frm.value.password2){
      console.log(frm.value);
    }else{
      this.pswdiversa=true;
      this.Psw2.nativeElement.value='';
    }

  }
  MostraNascondiPsw(ind:number){
    if (ind==2){
      this.pswVisibile2=!this.pswVisibile2;
    }else{
      this.pswVisibile1=!this.pswVisibile1;
    }

  }

}
