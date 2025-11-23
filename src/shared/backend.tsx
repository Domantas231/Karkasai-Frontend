import axios, { AxiosInstance } from 'axios';

/**
 * This module exposes a separate axios instance to be used for connections to backend.
 *
 * The backend connector uses a request interceptor to automatically add the JWT from
 * sessionStorage to each request. This ensures that the Authorization header is always
 * up-to-date, even after page navigation or component re-renders.
 *
 * When user logs in, the JWT is stored in sessionStorage and the interceptor will
 * automatically add it to all subsequent requests.
 *
 * When user logs out, the JWT is removed from sessionStorage and requests will no
 * longer include the Authorization header.
 */

// Storage key for JWT (must match appState.tsx)
const STORAGE_KEY = 'HabitTribe.frontend.AppState';
const JWT_STORAGE_KEY = `${STORAGE_KEY}#jwt`;

// Create a single axios instance that will be used throughout the app
const backend = axios.create({
    withCredentials: true
});

// Add request interceptor to dynamically add Authorization header
backend.interceptors.request.use(
    (config) => {
        // Get JWT from sessionStorage
        const jwt = window.sessionStorage.getItem(JWT_STORAGE_KEY);

        // If JWT exists, add it to the Authorization header
        if (jwt && jwt !== "") {
            config.headers.Authorization = `Bearer ${jwt}`;
        } else {
            // Remove Authorization header if no JWT
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Set backend connector to version that automatically authenticates to the server with given JWT.
 * @param jwt JWT to use.
 * @deprecated This function is kept for backward compatibility but is no longer needed.
 * The backend now automatically reads the JWT from sessionStorage via interceptor.
 */
function setAuthenticatingBackend(jwt : string) {
    // No-op: The interceptor handles adding the JWT automatically
    // JWT should already be in sessionStorage by the time this is called
}

/**
 * Set backend connector to non-authenticating version.
 * @deprecated This function is kept for backward compatibility but is no longer needed.
 * The backend now automatically reads the JWT from sessionStorage via interceptor.
 */
function setNonAuthenticatingBackend() {
    // No-op: The interceptor handles removing the JWT automatically
    // JWT should already be removed from sessionStorage by the time this is called
}

//
export {
    backend as default,
    setAuthenticatingBackend,
    setNonAuthenticatingBackend
}