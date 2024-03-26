import React, { useContext } from 'react';
import { Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './app.css';

const RegisterForm = () => {
    const {
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
    } = useContext(AuthContext);

    const handleRegister = (e) => {
        //e.preventDefault();
        registerUser();
    };

    return (

        <div className="login-container" >
            <form className="login-form" onSubmit={ registerUser}>
                <h2>Inscription à Chat42</h2>
                <label>
                    Nom d'utilisateur:
                    <input
                        type="text"
                        onChange={(e) =>
                            updateRegisterInfo({ ...registerInfo, name: e.target.value })
                        }
                    />
                </label>
                <label>
                    Mot de passe:
                    <input
                        type="password"
                        onChange={(e) =>
                            updateRegisterInfo({
                                ...registerInfo,
                                password: e.target.value,
                            })
                        }
                    />
                </label>
                <button type="submit">S'inscrire</button>
                {registerError?.error && (
                    <Alert variant="danger">
                        <p>{registerError?.message}</p>
                    </Alert>
                )}
            </form>

            <p style={{ marginTop: '10px' }}>J'ai déjà un compte</p>
            <p>
                Accédez à la{' '}
                <Link to="/login" className="connexion-link">
                    page de connexion
                </Link>
            </p>
        </div>
    );

};
export default RegisterForm;
