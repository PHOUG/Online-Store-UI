import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState(null);
    const [loading, setLoading]   = useState(false);

    useEffect(() => {
        document.title = 'Phoug — Login';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const resp = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!resp.ok) {
                const body = await resp.json().catch(() => ({}));
                throw new Error(body.message || 'Неверный логин или пароль');
            }

            const { token, user } = await resp.json();
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-heading">Авторизация</h2>

                <div className="login-subtext-wrapper">
                    <span className="login-subtext">Ещё нет аккаунта?</span>
                    <button
                        className="login-link"
                        onClick={() => navigate('/registration')}
                    >
                        Создать
                    </button>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label className="login-label">Имя пользователя</label>
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Введите ваш логин"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-input-group">
                        <label className="login-label">Пароль</label>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Введите ваш пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Входим…' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
}
