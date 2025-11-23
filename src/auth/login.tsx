import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderImage from '../shared/headerimage/headerImage';
import backend, { setAuthenticatingBackend } from '../shared/backend';
import config from '../shared/config';

import appState from '../shared/appState';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        console.log(JSON.stringify({
                username,
                password
            }))

        try {
            const response = await backend.post(config.backendUrl + 'login', {
                username,
                password
            });

            // Assuming the backend returns a JWT token
            console.log(response.data)
            const token = response.data.accessToken;

            appState.authJwt = token;
            appState.userTitle = username;
            appState.isLoggedIn.value = true;

            // Set up authenticated backend
            setAuthenticatingBackend(token);
            
            // Redirect to groups page
            navigate('/groups');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Nepavyko prisijungti. Patikrinkite savo duomenis.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <HeaderImage 
                title="Prisijungimas" 
                subtitle="Prisijunkite prie savo paskyros" 
                imgHeight="400px"
            />
            
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h3 className="card-title text-center mb-4">Prisijungti</h3>
                                
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Slapyvardis
                                        </label>
                                        <input
                                            type="username"
                                            className="form-control"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Slaptažodis
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="d-grid gap-2 mb-3">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Jungiamasi...' : 'Prisijungti'}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <small className="text-muted">
                                            Neturite paskyros?{' '}
                                            <a href="/register" className="text-decoration-none">
                                                Registruokitės čia
                                            </a>
                                        </small>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;