import React, {useContext} from 'react';
import {Alert} from 'react-bootstrap';
import {AuthContext} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import './appconnexion.css';



const LoginForm = () => {
    const {
        loginInfo,
        updateLoginInfo,
        loginUser,
        loginError,
        isLoginLoading,
    } = useContext(AuthContext);

    const handleLogin = (e) => {
        //e.preventDefault();
        loginUser();
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={loginUser}>
                <h2>Connexion à Chat42</h2>
                <label>
                    Nom d'utilisateur:
                    <input
                        type="text"
                        onChange={(e) =>
                            updateLoginInfo({...loginInfo, name: e.target.value})
                        }
                    />
                </label>
                <label>
                    Mot de passe:
                    <input
                        type="password"
                        onChange={(e) =>
                            updateLoginInfo({...loginInfo, password: e.target.value})
                        }
                    />
                </label>
                <button type="submit">Se connecter</button>
                {loginError?.error && (
                    <Alert variant="danger">
                        <p>{loginError?.message}</p>
                    </Alert>
                )}
            </form>

            <p style={{marginTop: '10px'}}>Je n'ai pas de compte </p>
            <p>
                Accédez à la{' '}
                <Link to="/register" className="inscription-link">
                    page d'inscription
                </Link>
            </p>

        </div>
    );
};

export default LoginForm;
