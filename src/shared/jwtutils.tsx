/**
 * JWT utility functions for decoding tokens and extracting user information.
 */

export interface JwtPayload {
    sub: string;
    name: string;
    jti: string;
    exp: number;
    iat?: number;
    // .NET uses this claim type for roles
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
}

/**
 * Decodes a JWT token and returns the payload.
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJwt(token: string): JwtPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if necessary
        const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        
        const jsonPayload = decodeURIComponent(
            atob(padded)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

/**
 * Extracts user roles from a JWT token.
 * @param token JWT token string
 * @returns Array of role names
 */
export function getUserRoles(token: string): string[] {
    const payload = decodeJwt(token);
    if (!payload) return [];
    
    const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    if (Array.isArray(roleClaim)) {
        return roleClaim;
    }
    if (typeof roleClaim === 'string') {
        return [roleClaim];
    }
    
    return [];
}

/**
 * Checks if the token contains a specific role.
 * @param token JWT token string
 * @param role Role name to check
 * @returns True if user has the role
 */
export function hasRole(token: string, role: string): boolean {
    return getUserRoles(token).includes(role);
}

/**
 * Checks if the token belongs to an admin user.
 * @param token JWT token string
 * @returns True if user is admin
 */
export function isAdmin(token: string): boolean {
    return hasRole(token, 'Admin');
}

/**
 * Checks if the JWT token is expired.
 * @param token JWT token string
 * @returns True if token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return true;
    
    // exp is in seconds, Date.now() is in milliseconds
    return Date.now() >= payload.exp * 1000;
}

/**
 * Gets the username from the JWT token.
 * @param token JWT token string
 * @returns Username or null
 */
export function getUsernameFromToken(token: string): string | null {
    const payload = decodeJwt(token);
    return payload?.name || null;
}