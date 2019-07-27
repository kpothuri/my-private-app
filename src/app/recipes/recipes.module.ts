import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// Browser module can only be imported once in App module. If you want to import features related to *ngFor or *ngIf etc 
// need to import CommonModule
import { ReactiveFormsModule } from '@angular/forms';

import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,         
    ],
    imports: [
        RouterModule,
        SharedModule,
        ReactiveFormsModule,
        RecipesRoutingModule
    ]
    // Since the below components are already available as part of Recipes Routing Module,
    // don't need to export them here again.
    // ,exports: [
    //     //RecipesComponent,
    //     RecipeListComponent,
    //     RecipeDetailComponent,
    //     RecipeItemComponent,
    //     RecipeStartComponent,
    //     RecipeEditComponent,           
    // ]
})
export class RecipesModule {}