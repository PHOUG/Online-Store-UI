import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/header/Header';
import ProductList from '../components/ProductList';
import { useSelectedCategories } from '../contexts/SelectedCategoriesContext';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const { selected } = useSelectedCategories();

    const loadProducts = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:8080/products/search/all');
            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();
            setProducts(data);
        } catch (e) {
            console.error(e);
            setProducts([]);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleCreate = async () => {
        await loadProducts();
    };

    const handleDelete = article => {
        setProducts(prev => prev.filter(p => p.article !== article));
    };

    const handleUpdate = (updatedProduct) => {
        setProducts((prev) =>
            prev.map(p => (p.article === updatedProduct.article ? updatedProduct : p))
        );
    };


    const filtered = selected.length
        ? products.filter(p => selected.every(id => p.categoryIds.includes(id)))
        : products;

    return (
        <>
            <Header />
            <main style={{
                backgroundColor: '#1f1f1f',
                fontFamily: 'Bahnschrift',
                color: '#e9e9e9',
                minHeight: '100vh',
            }}>
                <ProductList
                    products={filtered}
                    onCreate={handleCreate}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </main>
        </>
    );
}
