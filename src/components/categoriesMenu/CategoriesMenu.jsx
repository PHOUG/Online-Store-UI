import React, { useEffect, useState, useRef } from 'react';
import '../../styles/categoriesMenu.css';

// Компонент для отдельной категории с чекбоксом
export function CategoryItem({ name, selected, onToggle }) {
    return (
        <label className={`category-item ${selected ? 'selected' : ''}`}>
            <input
                type="checkbox"
                checked={selected}
                onChange={onToggle}
            />
            <span>{name}</span>
        </label>
    );
}

// Основное меню категорий с поддержкой множественного выбора
export default function CategoriesMenu({ isOpen, onClose, buttonRef, onSelectionChange }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const sidebarRef = useRef(null);

    // Загрузка категорий
    useEffect(() => {
            fetch('http://localhost:8080/category/search/all')
              .then(res => res.json())
              .then(data => setCategories(
                  data.map(({ id, categoryName }) => ({ id, name: categoryName }))
              ))
            .catch(console.error);
    }, []);

    // Блокировка прокрутки
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
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

    // Обработчик переключения категории
    const toggleCategory = (name) => {
        setSelectedCategories(prev => {
            const updated = prev.includes(name)
                ? prev.filter(c => c !== name)
                : [...prev, name];
            if (onSelectionChange) onSelectionChange(updated);
            return updated;
        });
    };

    return (
        <>
            <div className={`categories-menu-backdrop ${isOpen ? 'open' : ''}`} />
            <aside ref={sidebarRef} className={`categories-menu-sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                            {categories.map(({ id, name }) => (
                              <li key={id}>
                                    <CategoryItem
                                      name={name}
                                      selected={selectedCategories.includes(id)}
                                      onToggle={() => toggleCategory(id)}
                                    />
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
}
