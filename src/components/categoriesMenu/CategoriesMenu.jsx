import React, { useEffect, useState, useRef } from 'react';
import '../../styles/categoriesMenu.css';
import CategoryItem from './Category';

export default function CategoriesMenu({ isOpen, onClose, buttonRef, onCategorySelect }) {
    const [categories, setCategories] = useState([]);
    const sidebarRef = useRef(null);

    // Загрузка категорий
    useEffect(() => {
        fetch('http://localhost:8080/category/search/all')
            .then(res => res.json())
            .then(data => setCategories(data.map(cat => cat.categoryName)))
            .catch(console.error);
    }, []);

    // Блокировка прокрутки
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Закрытие при клике вне сайдбара и кнопки
    useEffect(() => {
        const handleClickOutside = event => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, buttonRef]);

    return (
        <>
            <div className={`categories-menu-backdrop ${isOpen ? 'open' : ''}`} />
            <aside ref={sidebarRef} className={`categories-menu-sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    {categories.map((cat, idx) => (
                        <li key={idx} onClick={() => onCategorySelect(cat)}>
                            <CategoryItem name={cat} />
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
}
