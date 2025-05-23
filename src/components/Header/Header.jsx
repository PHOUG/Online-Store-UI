import '../../styles/header.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, List, ShoppingBasket } from 'lucide-react';

import HeaderLogo from './HeaderLogo';
import HeaderButton from './HeaderButton';
import CategoriesMenu from './CategoriesMenu';
import SearchBar from './HeaderSearchBar';

export default function Header() {
    const [isHoveredLogin, setIsHoveredLogin] = useState(false);
    const [isHoveredCategories, setIsHoveredCategories] = useState(false);
    const [isHoveredCart, setIsHoveredCart] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-left">
                <HeaderLogo />
                <HeaderButton
                    icon={List}
                    label="Категории"
                    hovered={isHoveredCategories}
                    setHovered={setIsHoveredCategories}
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                />
            </div>

            {/* Строка поиска */}
            <SearchBar />

            <div className="header-right">
                <HeaderButton
                    icon={ShoppingBasket}
                    label="Корзина"
                    hovered={isHoveredCart}
                    setHovered={setIsHoveredCart}
                    onClick={() => navigate('/cart')}
                />
                <HeaderButton
                    icon={User}
                    label="Войти"
                    hovered={isHoveredLogin}
                    setHovered={setIsHoveredLogin}
                    onClick={() => navigate('/login')}
                />
            </div>

            {isCategoriesOpen && <CategoriesMenu />}
        </header>
    );
}