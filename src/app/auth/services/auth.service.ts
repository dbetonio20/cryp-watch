/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    user,
    UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    firebaseAuth = inject(Auth);
    router = inject(Router);
    user$ = signal<User | null | undefined>(undefined);
    isLoggedIn = computed(() => this.user$() !== null);

    private isAuthenticated = signal<boolean>(false);

    constructor() {
        onAuthStateChanged(this.firebaseAuth, user => {
            this.user$.set(user);
            console.log(this.user$());
        });
    }

    register(
        _email: string,
        _username: string,
        _password: string
    ): Observable<UserCredential> {
        return from(
            createUserWithEmailAndPassword(this.firebaseAuth, _email, _password)
        ).pipe(
            switchMap(response =>
                from(
                    updateProfile(response.user, { displayName: _username })
                ).pipe(
                    map(() => response) // Ensure the final observable emits the user credential after profile update
                )
            ),
            catchError(error => throwError(() => error)) // Handle errors properly
        );
    }

    login(_email: string, _password: string): Observable<UserCredential> {
        return from(
            signInWithEmailAndPassword(this.firebaseAuth, _email, _password)
        ).pipe(
            catchError(error => throwError(() => error)) // Proper error handling
        );
    }

    logout(): Promise<void> {
        return signOut(this.firebaseAuth).then(() => {
            this.user$.set(null); // Explicitly set user to null on logout
            this.router.navigate(['/login']);
        });
    }
}
