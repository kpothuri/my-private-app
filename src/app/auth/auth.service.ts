import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { User } from './user.model';


export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered? : boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    
    constructor(private http: HttpClient,
                private router: Router) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key='+environment.firebaseAPIKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData => {
            //console.log('Signup: '+resData);
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    logIn(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.firebaseAPIKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData => {
            console.log(JSON.stringify(resData));
            //console.log('Login: '+resData.email+'|'+resData.localId+'|'+resData.idToken+'|'+resData.expiresin+'|'+resData.kind+'|'+resData.refreshToken);
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }

    }

    logOut() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    autoLogout(expirationDuration: number){
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logOut();
        }, expirationDuration)
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured';
        if(!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS': errorMessage = 'Email exists';
            break;
            case 'OPERATION_NOT_ALLOWED': errorMessage = 'Operation not allowed';
            break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER': errorMessage = 'Too many attempts try alter';
            break;
            case 'EMAIL_NOT_FOUND': errorMessage = 'Email not found';
            break;
            case 'INVALID_PASSWORD': errorMessage = 'Invalid password';
            break;
            case 'USER_DISABLED': errorMessage = 'User disabled';
            break;
        }
        return throwError(errorMessage);
    }

    private handleAuthentication(email: string, localId: string, token: string, expiresIn: number) {
        //console.log(expiresIn);
        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
        const user = new User(email, localId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        //console.log(user);
        localStorage.setItem('userData',JSON.stringify(user));
    }
}