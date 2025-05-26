import ProductList from "../components/ProductList";
import Header from "../components/header/Header";
import { useState, useEffect } from 'react';

export default function HomePage() {
    const [products, setProducts] = useState([]);

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

    const handleDelete = (article) => {
        setProducts(prev => prev.filter(p => p.article !== article));
    };

    return (
        <>
            <Header />
            <main
                style={{
                    backgroundColor: '#1f1f1f',
                    fontFamily: 'Bahnschrift',
                    color: '#e9e9e9',
                    minHeight: '100vh'
                }}
            >
                <ProductList products={products} onDelete={handleDelete} />
            </main>
        </>
    );
}
