import { Injectable } from '@angular/core';
import { UserDetailsService } from '../user_service/user-details.service';
import {  ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild{

  constructor(private router: Router, private userDetailService: UserDetailsService) {
  }
  canActivateChild(): boolean {
    if(this.userDetailService.getUserDetails().role === "ADMIN" || this.userDetailService.getUserDetails().role === "SUPERADMIN"){
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
    
  }
  
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

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   const userDetails = this.userDetailService.getUserDetails();
    
  //   if (userDetails && userDetails.role && route.data && route.data['expectedRoles']) {
  //     // Check if the user's role is in the expected roles array
  //     if (route.data['expectedRoles'].includes(userDetails.role)) {
  //       return true; // User has the required role, allow access to the route
  //     } else {
  //       // Redirect to unauthorized page or handle accordingly
  //       this.router.navigate(['/unauthorized']);
  //       return false; // Prevent access to the route
  //     }
  //   } else {
  //     // Redirect to login page or handle accordingly
  //     this.router.navigate(['/login']);
  //     return false; // Prevent access to the route
  //   }
  // }

}