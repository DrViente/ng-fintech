import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ng-sign-in',
  template: `
    <form #f="ngForm" (ngSubmit)="LogIn(f)" style="display:block">
        <mat-form-field appearance="outline">
          <mat-icon matPrefix color="primary">person</mat-icon>
          <mat-label>E-Mail</mat-label>
          <input matInput placeholder="E-Mail" type="email"
            required pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"
            ngModel #emailRef="ngModel" name="email"
          >
          <mat-hint *ngIf="emailRef.errors?.['required'] && (emailRef.dirty || emailRef.touched)" class="invalidField">Inserire indirizzo e-mail</mat-hint>
          <mat-hint *ngIf="emailRef.errors?.['pattern'] && (emailRef.dirty || emailRef.touched)" class="invalidField">Inserire un indirizzo e-mail valido</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-icon matPrefix color="primary">lock</mat-icon>
          <mat-label>Password</mat-label>
          <input matInput placeholder="Password" [type]="!pswVisibile? 'password' : ''"
            required
            ngModel #passwordRef="ngModel" name="password"
          >
          <mat-icon matSuffix *ngIf="pswVisibile" (click)="MostraNascondiPsw()">visibility</mat-icon>
          <mat-icon matSuffix *ngIf="!pswVisibile" (click)="MostraNascondiPsw()">visibility_off</mat-icon>
          <mat-hint *ngIf="passwordRef.errors?.['required'] && (passwordRef.dirty || passwordRef.touched)" class="invalidField">Inserire la password</mat-hint>
        </mat-form-field>
        <button mat-raised-button color="primary" tipe=submit [disabled]="f.invalid" class="button100 mb-2">Accedi</button>
        <!--<button mat-stroked-button color="primary" (click)="newAccount.emit()">Crea un nuovo account</button>-->
    </form>
  `,
  styles: [`
    mat-form-field{
      display:block;
    }
  `
  ]
})
export class SignInComponent implements OnInit {
  //@Output() newAccount = new EventEmitter();
  pswVisibile:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

  LogIn(frm:NgForm){
    console.log(frm.value)
  }
  MostraNascondiPsw(){
    this.pswVisibile=!this.pswVisibile
  }
}
