import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

const authRoutes: Routes = [
    { path: '', component: AuthComponent}    
]

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(authRoutes)
    ]
    //,exports: [RouterModule]
})
export class AuthModule{}