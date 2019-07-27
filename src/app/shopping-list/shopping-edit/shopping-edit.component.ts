import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shoppping-list.service';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
@ViewChild('f', {static: false}) slForm: NgForm;

  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService:ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          quantity: this.editedItem.quantity
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    //console.log(form);
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.quantity);
    if(this.editMode) {
    this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
    this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
