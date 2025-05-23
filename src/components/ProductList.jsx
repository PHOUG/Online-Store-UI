import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onDelete }) {
    const [productsState, setProductsState] = useState([]);

    useEffect(() => {
        setProductsState(products || []);
    }, [products]);

    if (!productsState || productsState.length === 0) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 60px)',
                    fontSize: '20px',
                    color: '#e9e9e9',
                    fontFamily: 'Bahnschrift',
                    backgroundColor: '#1f1f1f',
                }}
            >
                Товары не найдены
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '20px',
                padding: '20px 110px',
            }}
        >
            {products.map(product => (
                <ProductCard
                    key={product.article}
                    product={product}
                    onAddToCart={(p) => console.log('В корзину:', p)} // по желанию передай сюда реальный метод
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
