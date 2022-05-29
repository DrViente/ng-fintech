import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, mergeMap, switchMap } from 'rxjs';
import { CardsService } from 'src/app/api/cards.service';
import { ContactsService } from 'src/app/api/contacts.service';
import { TransferService } from 'src/app/api/transfer.service';
import { Card } from 'src/app/models/card.model';
import { Contact } from 'src/app/models/contact.model';
import { ModalMsgboxComponent } from 'src/app/shared/modal-msgbox/modal-msgbox.component';

@Component({
  selector: 'ng-transfer',
  template: `
    <div class="p-5 mx-auto container">
      <form #f="ngForm" (ngSubmit)="openDialogTransfer(nameRef.value,surnameRef.value,importoRef.value,selectedCard?.number)">
        <button mat-raised-button color="basic" type="button" class="fullWidth mb-2" (click)="openDialogContacts()">Lista Contatti</button>
        <mat-form-field appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput placeholder="Nome" type=""
            required [ngModel]="selectedContact?.name" #nameRef="ngModel" name="name"
          >
          <mat-hint *ngIf="nameRef.errors?.['nomeRef'] && (nameRef.dirty || nameRef.touched)" class="invalidField">Nome Obbligatorio</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Cognome</mat-label>
          <input matInput placeholder="Cognome" type=""
            required [ngModel]="selectedContact?.surname" #surnameRef="ngModel" name="surname"
          >
          <mat-hint *ngIf="surnameRef.errors?.['required'] && (surnameRef.dirty || surnameRef.touched)" class="invalidField">Cognome Obbligatorio</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>IBAN</mat-label>
          <input matInput placeholder="IBAN" type=""
            required minlength="27" maxlength="27"
            [ngModel]="selectedContact?.iban" #ibanRef="ngModel" name="iban"
          >
          <mat-hint *ngIf="ibanRef.errors?.['required'] && (ibanRef.dirty || ibanRef.touched)" class="invalidField">IBAN Obbligatorio</mat-hint>
          <mat-hint *ngIf="(ibanRef.errors?.['minlength']||ibanRef.errors?.['maxlength']) && (ibanRef.dirty || ibanRef.touched)" class="invalidField">IBAN non valido</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Importo</mat-label>
          <input matInput placeholder="Importo" type=""
            required pattern="([0-9]+\.?[0-9]*|\.[0-9]+)$"
            ngModel #importoRef="ngModel" name="importo"
          >
          <mat-hint *ngIf="importoRef.errors?.['required'] && (importoRef.dirty || importoRef.touched)" class="invalidField">Importo Obbligatorio</mat-hint>
          <mat-hint *ngIf="importoRef.errors?.['pattern'] && (importoRef.dirty || importoRef.touched)" class="invalidField">Importo non valido</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Seleziona una Carta</mat-label>
          <mat-select required ngModel #cartaRef="ngModel" name="carta">
            <mat-option *ngFor="let card of creditCards" value="card._id" (click)="selectedCard=card">{{card.number}}</mat-option>
          </mat-select>
          <mat-hint *ngIf="cartaRef.errors?.['required'] && (cartaRef.dirty || cartaRef.touched)" class="invalidField">Carta Obbligatoria</mat-hint>
        </mat-form-field>

        <button mat-raised-button color="primary" type=submit [disabled]="f.invalid" class="fullWidth mb-2">Trasferisci Denaro</button>
      </form>
    </div>
  `,
  styles: [`
    mat-form-field{
      display:block;
    }
    .container{
      max-width: 800px;
    }
    `]
})
export class TransferComponent implements OnInit {
  @ViewChild ('f')frm!: NgForm
  selectedCard:Card|null=null
  selectedContact:Contact|null=null
  creditCards:Card[]=[]

  constructor(
    private myDialog: MatDialog,
    private mySnackBar: MatSnackBar,
    private mycardsService:CardsService,
    private myContactsService:ContactsService,
    private myTransferService:TransferService) {}

  ngOnInit(): void {
    this.mycardsService.getCards().subscribe(result => {
      this.creditCards = result;
    });
  }

  openDialogTransfer(nome:string, cognome:string, importo:number, numCarta:string|undefined) {
    const dialogRef = this.myDialog.open(ModalMsgboxComponent, {
      data: {
        Title:"Conferma Trasferimento Denaro",
        InnerHtml:"<p>Si conferma il trasferimento di €"+importo+"</p><p>a "+cognome+" "+ nome+" dalla carta "+numCarta+"</p>",
        Icon: "question_mark",
        YesNo:true
      },
    });

    //dialogRef.afterClosed().subscribe(result => {
    //  if (result===true){
    //    this.mySnackBar.open('Trasferimento di denaro confermato', 'chiudi', {
    //      duration: 3000,
    //      horizontalPosition: 'right',
    //      verticalPosition: 'bottom',
    //    });
    //  }
    //});

    dialogRef.afterClosed().pipe(
      switchMap(esito=>{
        if (esito){
          return this.myTransferService.moneyTransfer(this.frm.value)
        } else{
          return new BehaviorSubject<boolean>(false)
        }
      })
    ).subscribe(result => {
      if (result===true){
        this.mySnackBar.open('Trasferimento di denaro confermato', 'chiudi', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      }
    });
  }
  openDialogContacts(){
    const dialogContact = this.myDialog.open(DialogContactsDialog,{
      minWidth:600
    });
    //dialogContact.afterClosed().subscribe(result => {
    //  console.log(result)
    //});

    dialogContact.afterClosed().pipe(
      //idSel è il risultato dell'observable della dialog; uso switchmap per "rimappare" la subscription su un nuovo observable,
      //ovvero quello restituito da getContacts. Sfrutto la map e l'idsel per restituire direttamente il contatto che mi serve
      switchMap(idSel=>{
        return this.myContactsService.getContacts().pipe(
          map((c)=>{
            const i =c.findIndex(c=>c._id==idSel)
            return c[i]
          })
        )
      })
    ).subscribe(result => {
      this.selectedContact=result
    });
  }
}

@Component({
  selector: 'dialog-contacts',
  template: `
    <ng-contacts></ng-contacts>
  `,
  styles: [``]
})

export class DialogContactsDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogContactsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}
}

export interface DialogData {
  _IdSel:string
}
