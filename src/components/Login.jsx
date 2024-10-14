import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useContext(GameContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            signUpWithEmail(email, password);
        } else {
            signInWithEmail(email, password);
        }
    };

    return (
        <div className="login-container">
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            <p onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
            </p>
        </div>
    );
}

export default Login;
