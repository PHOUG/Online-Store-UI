import React, { useState, useRef } from 'react';
import '../../styles/header.css';
import { useNavigate } from 'react-router-dom';
import { User, List, ShoppingBasket } from 'lucide-react';

import HeaderLogo from './HeaderLogo';
import HeaderButton from './HeaderButton';
import CategoriesMenu from '../categoriesMenu/CategoriesMenu';
import SearchBar from './HeaderSearchBar';

export default function Header() {
    const [isHoveredLogin, setIsHoveredLogin] = useState(false);
    const [isHoveredCategories, setIsHoveredCategories] = useState(false);
    const [isHoveredCart, setIsHoveredCart] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const categoriesButtonRef = useRef(null);
    const navigate = useNavigate();

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <HeaderLogo />
                    <HeaderButton
                        ref={categoriesButtonRef}
                        icon={List}
                        label="Категории"
                        hovered={isHoveredCategories}
                        setHovered={setIsHoveredCategories}
                        onClick={() => setIsCategoriesOpen(prev => !prev)}
                    />
                </div>

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
            </header>

            <CategoriesMenu
                isOpen={isCategoriesOpen}
                onClose={() => setIsCategoriesOpen(false)}
                buttonRef={categoriesButtonRef}
            />
        </>
    );
}
