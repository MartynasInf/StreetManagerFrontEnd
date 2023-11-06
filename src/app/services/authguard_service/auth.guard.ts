import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    // Check if the user is authenticated
    const storedAuthenticationStatus = localStorage.getItem('isAuthenticated');
    let isAuthenticated: boolean = false;
    if (storedAuthenticationStatus) {
        try {
          isAuthenticated = JSON.parse(storedAuthenticationStatus);
        } catch (error) {
          console.error('Error parsing isAuthenticated value from localStorage:', error);
        }
      }
    if (isAuthenticated) {
        return true; // Allow access to the route
    } else {
        this.router.navigate(['/login']); // Redirect to the login page
        return false; // Prevent access to the route
    }
  }
}