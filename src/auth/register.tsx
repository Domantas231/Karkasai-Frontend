import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderImage from '../shared/headerimage/headerImage';
import backend from '../shared/backend';
import config from '../shared/config';
import { notifyFailure, notifySuccess } from '../shared/notify';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            notifyFailure('Slaptažodžiai nesutampa')
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            notifyFailure('Slaptažodis turi būti bent 6 simbolių ilgio')
            return;
        }

        try {
            await backend.post(config.backendUrl + 'accounts', {
                email: formData.email,
                password: formData.password,
                username: formData.username
            });

            // Redirect to login page after successful registration
            notifySuccess('Registracija sėkminga! Prašome prisijungti')
            navigate('/login');
        } catch (err: any) {
            console.error('Registration error:', err);
            err.response?.data?.map((p :{ description: string }) => notifyFailure(p.description))
        }
    };

    return (
        <>
            <HeaderImage 
                title="Registracija" 
                subtitle="Sukurkite naują paskyrą" 
                imgHeight="400px"
            />
            
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h3 className="card-title text-center mb-4">Registruotis</h3>
                                
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Vartotojo vardas
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            El. paštas
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
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
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                        />
                                        <small className="text-muted">
                                            Bent 6 simboliai
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Patvirtinti slaptažodį
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="d-grid gap-2 mb-3">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                        >
                                            Registruotis
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <small className="text-muted">
                                            Jau turite paskyrą?{' '}
                                            <a href="/login" className="text-decoration-none">
                                                Prisijunkite čia
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

export default Register;