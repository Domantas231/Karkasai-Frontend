import config from '../shared/config';
import appState from '../shared/appState';
import backend, { setNonAuthenticatingBackend } from '../shared/backend';

/**
 * Log-out section in nav bar. React component.
 * @returns Component HTML.
 */
function StatusAndLogOut() {
	/**
	 * Handles 'Log-out' command.
	 */
	let onLogOut = () => {
		//send log-out request to the backend
		backend.post(
			config.backendUrl + "logout",
			{
				params : {					
				}
			}
		)
		//logout ok
		.then(resp => {			
			//forget user information and JWT
			appState.userId = -1;
			appState.userTitle = "";
			appState.authJwt = null;

			//switch back non-authenticating backend connector
			setNonAuthenticatingBackend();

			//indicate user is logged out
			appState.isLoggedIn.value = false;
		})
		//login failed or backend error, show error message
		.catch(err => {
			console.error('Logout error:', err);
			// Force logout on client even if backend fails
			appState.userId = -1;
			appState.userTitle = "";
			appState.authJwt = null;
			setNonAuthenticatingBackend();
			appState.isLoggedIn.value = false;
		});
	}

	//render component html
	let html = 
		<>
		<span className="d-flex align-items-center">
			<span>Welcome, {appState.userTitle}</span>
			<button 
				type="button"
				className="btn btn-primary btn-sm me-5" 
				onClick={() => onLogOut()}
				>Log out</button>
		</span>
		</>;

	//
	return html;
}

//
export default StatusAndLogOut;