import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovementsRoutingModule } from './movements-routing.module';
import { MovementsComponent } from './movements.component';
import { MovementComponent } from './components/movement.component';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { MaterialModule } from 'src/app/shared/materials/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MovementsComponent,
    MovementComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    MovementsRoutingModule,
    MaterialModule,
    FormsModule,
  ]
})
export class MovementsModule { }
