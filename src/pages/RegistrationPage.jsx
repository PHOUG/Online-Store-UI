import { useEffect } from 'react';
import '/Users/phoug/online-store-ui/src/styles/login.css';

export default function RegistrationPage() {
    useEffect(() => {
        document.title = 'Phoug - Registration';
    }, []);

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-heading">Регистрация</h2>

                <form className="login-form">
                    <div className="login-input-group">
                        <label className="login-label">Имя пользователя</label>
                        <input
                            type="text"
                            placeholder="Введите имя пользователя"
                            className="login-input"
                        />
                    </div>

                    <div className="login-input-group">
                        <label className="login-label">Email</label>
                        <input
                            type="email"
                            placeholder="Введите ваш email"
                            className="login-input"
                        />
                    </div>

                    <div className="login-input-group">
                        <label className="login-label">Пароль</label>
                        <input
                            type="password"
                            placeholder="Введите пароль"
                            className="login-input"
                        />
                    </div>

                    <div className="login-input-group">
                        <label className="login-label">Подтверждение пароля</label>
                        <input
                            type="password"
                            placeholder="Подтвердите пароль"
                            className="login-input"
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
}
