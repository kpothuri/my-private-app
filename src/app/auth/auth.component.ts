import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent implements OnDestroy{

    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {

    }

    isLoginMode = true;
    isLoading = false;
    //error: string = null;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    private closeSub: Subscription;

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;
        //console.log(this.isLoading);

        if (this.isLoginMode) {
            console.log('inside Login Mode');
            authObs = this.authService.logIn(email, password);
        } else {
            console.log('inside Signup nMode');
            authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(authLoginResponseData => {
            console.log(authLoginResponseData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        },
        errorMessage => {
            //console.log(errorMessage);
            //this.error = errorMessage;
            this.isLoading = false;
            this.showErrorAlert(errorMessage);
        });

        form.reset();
    }

    // onHandleError() {
    //     this.error = null;
    // }

    ngOnDestroy() {
        if(this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }

    private showErrorAlert(message: string) {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}