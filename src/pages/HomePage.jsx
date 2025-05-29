import React, { useState, useEffect } from 'react';
import Header from '../components/header/Header';
import ProductList from '../components/ProductList';
import { useSelectedCategories } from '../contexts/SelectedCategoriesContext';
import {fetchProducts} from "../services/api";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const { selected } = useSelectedCategories();

    useEffect(() => {
        fetch('http://localhost:8080/products/search/all')
            .then(res => {
                if (!res.ok) throw new Error('Ошибка при загрузке товаров');
                return res.json();
            })
            .then(data => setProducts(data))
            .catch(error => {
                console.error('Ошибка при получении продуктов:', error);
                setProducts([]);
            });
    }, []);

    // Фильтрация: оставляем только товары, у которых есть все выбранные категории
    const filteredProducts =
        selected.length > 0
            ? products.filter(product =>
                selected.every(catId => product.categoryIds.includes(catId))
            )
            : products;

    const handleDelete = article => {
        setProducts(prev => prev.filter(p => p.article !== article));
    };

    const handleCreate = async (newProduct) => {
        await fetchProducts();
    };

    return (
        <>
            <Header />
            <main
                style={{
                    backgroundColor: '#1f1f1f',
                    fontFamily: 'Bahnschrift',
                    color: '#e9e9e9',
                    minHeight: '100vh',
                }}
            >
                <ProductList
                    products={filteredProducts}
                    onCreate={handleCreate}
                    onDelete={handleDelete}
                />
            </main>
        </>
    );
}
