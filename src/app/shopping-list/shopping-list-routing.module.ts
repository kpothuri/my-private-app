import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ShoppingListComponent } from './shopping-list.component';

const shoppiinglistRoutes: Routes = [
    { path: '', component: ShoppingListComponent }    
]

@NgModule({
    imports: [RouterModule.forChild(shoppiinglistRoutes)],
    exports: [RouterModule]
})
export class ShoppinglistRoutingModule {}