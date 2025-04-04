/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, inject } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, switchMap, map, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private firebaseAuth = inject(Auth);
    private router = inject(Router);

    private userSubject = new BehaviorSubject<User | null | undefined>(undefined);
    user$ = this.userSubject.asObservable();

    constructor() {
        onAuthStateChanged(this.firebaseAuth, user => {
            this.userSubject.next(user);
            console.log('Auth State Changed:', user);
        });
    }

    get isAuthenticated(): boolean {
        return !!this.userSubject.value;
    }

    register(_email: string, _username: string, _password: string): Observable<UserCredential> {
        return from(createUserWithEmailAndPassword(this.firebaseAuth, _email, _password)).pipe(
            switchMap(response =>
                from(updateProfile(response.user, { displayName: _username })).pipe(
                    map(() => response)
                )
            ),
            catchError(error => throwError(() => error))
        );
    }

    login(_email: string, _password: string): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.firebaseAuth, _email, _password)).pipe(
            catchError(error => throwError(() => error))
        );
    }

    logout(): Promise<void> {
        return signOut(this.firebaseAuth).then(() => {
            this.userSubject.next(null);
            this.router.navigate(['/login']);
        });
    }
}
