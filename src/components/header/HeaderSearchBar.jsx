import React from 'react';
import '../../styles/header.css';

export default function SearchBar() {
    return (
        <div className="header-search">
            <input
                className="search-input"
                type="text"
                placeholder="Поиск товаров..."
            />
        </div>
    );
}
