import { Subject } from "rxjs";

import { ToastMessage } from 'primereact/toast';

import { ObservableClass } from "./observable";
import { getUserRoles, isAdmin as checkIsAdmin, isTokenExpired } from "./jwtutils";


const STORAGE_KEY = "HabitTribe.frontend.AppState"

/**
 * Application state data.
 *
 * JWT authentication token is stored in session storage, that lives as long as related browser tab.
 * This allows user to log in and the properly trigger routes. 
 *
 * If we would store JWT in a simple variable the value would get lost when user would enter new url 
 * into browser.
 */
class AppState extends ObservableClass {
	/* User title, if known. */
	set userTitle(value: string) {
        if (value) {
            window.sessionStorage.setItem(`${STORAGE_KEY}#userTitle`, value);
        } else {
            window.sessionStorage.removeItem(`${STORAGE_KEY}#userTitle`);
        }
    }

    get userTitle(): string {
        return window.sessionStorage.getItem(`${STORAGE_KEY}#userTitle`) || "";
    }
	
	/** Indicates if user is considered to be logged in. */
	isLoggedIn = this.observableProperty<boolean>(false);

	/** Is used to pass messages to app global toast control. */
	msgs = new Subject<ToastMessage>();

	/** Authentication token. Setter. */
	set authJwt(value : string | null) {
		if( value == null || value === "" )
			window.sessionStorage.removeItem(`${STORAGE_KEY}#jwt`);
		else
			window.sessionStorage.setItem(`${STORAGE_KEY}#jwt`, value);
	}

	/** Authentication token. Getter. */
	get authJwt() : string | null {
		return window.sessionStorage.getItem(`${STORAGE_KEY}#jwt`);
	}

	/**
	 * Get user roles from JWT token.
	 * @returns Array of role names
	 */
	get userRoles(): string[] {
		const jwt = this.authJwt;
		if (!jwt) return [];
		return getUserRoles(jwt);
	}

	/**
	 * Check if current user is an admin.
	 * @returns True if user has Admin role
	 */
	get isUserAdmin(): boolean {
		const jwt = this.authJwt;
		if (!jwt) return false;
		return checkIsAdmin(jwt);
	}

	/**
	 * Check if current user has a specific role.
	 * @param role Role name to check
	 * @returns True if user has the specified role
	 */
	hasRole(role: string): boolean {
		return this.userRoles.includes(role);
	}

	/**
	 * Check if the current JWT token is expired.
	 * @returns True if token is expired or not present
	 */
	get isTokenExpired(): boolean {
		const jwt = this.authJwt;
		if (!jwt) return true;
		return isTokenExpired(jwt);
	}
}

//export default instance
let appState = new AppState();
export default appState;