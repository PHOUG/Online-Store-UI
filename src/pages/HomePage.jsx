import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductList from '../components/ProductList';

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
                setProducts([]); // важно: чтобы не было undefined
            });
    }, []);

    return (
        <>
            <Header />
            <main
                style={{
                    padding: '20px',
                    backgroundColor: '#1f1f1f',
                    fontFamily: 'Bahnschrift',
                    color: '#e9e9e9',
                    minHeight: '100vh'
                }}
            >
                <ProductList products={products} />
            </main>
        </>
    );
}