import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private usrSub: Subscription;
  collapsed:boolean = false;
  isAuthenticated: boolean = false;

  constructor(private dataStorageService: DataStorageService,
              private authsService: AuthService) {}

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authsService.logOut();
  }

  ngOnInit() {
    this.usrSub =  this.authsService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true; // !!user;
    });
  }

  ngOnDestroy() {
    this.usrSub.unsubscribe();
  }
}
