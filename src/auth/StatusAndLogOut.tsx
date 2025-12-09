import config from '../shared/config';
import appState from '../shared/appState';
import backend, { setNonAuthenticatingBackend } from '../shared/backend';

import { useNavigate } from 'react-router-dom';

/**
 * Log-out section in nav bar. React component.
 * @returns Component HTML.
 */
function StatusAndLogOut() {
	const navigate = useNavigate();

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
			appState.userTitle = "";
			appState.authJwt = null;

			//switch back non-authenticating backend connector
			setNonAuthenticatingBackend();

			//indicate user is logged out
			appState.isLoggedIn.value = false;

			navigate('/')
		})
		//login failed or backend error, show error message
		.catch(err => {
			console.error('Logout error:', err);
			// Force logout on client even if backend fails
			appState.userTitle = "";
			appState.authJwt = null;
			setNonAuthenticatingBackend();
			appState.isLoggedIn.value = false;

			navigate('/')
		});
	}

	// Get initials for avatar
	const getInitials = (name: string) => {
		return name.charAt(0).toUpperCase();
	}

	//render component html
	let html = 
		<div className="status-logout-container">
			<div className="user-status">
				<div className="user-avatar">
					{getInitials(appState.userTitle)}
				</div>
				<span className="username d-none d-sm-inline">{appState.userTitle}</span>
			</div>
			<button 
				type="button"
				className="btn-logout" 
				onClick={() => onLogOut()}
			>
				<span className="d-none d-sm-inline">Atsijungti</span>
			</button>
		</div>;

	//
	return html;
}

//
export default StatusAndLogOut;