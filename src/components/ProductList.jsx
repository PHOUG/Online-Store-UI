// src/components/products/ProductList.jsx
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import AddCard from './addProduct/AddCard';
import ModalAdd from './addProduct/ModalAdd';
import '../styles/productList.css';

export default function ProductList({ products, onDelete, onCreate }) {
    const [productsState, setProductsState] = useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        setProductsState(products || []);
    }, [products]);

    const handleSave = (newProduct) => {
        onCreate(newProduct);
        setIsAddOpen(false);
    };

    if (!productsState.length) {
        return (
            <>
                {/* Модальное окно */}
                <ModalAdd
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    onSave={handleSave}
                />

                {/* Сетка товаров + AddCard */}
                <div className="product-list">

                    {/* Вставляем AddCard после всех ProductCard */}
                    <AddCard onClick={() => setIsAddOpen(true)} />
                </div>
            </>
        );
    }

    return (
        <>
            {/* Модальное окно */}
            <ModalAdd
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSave={handleSave}
            />

            {/* Сетка товаров + AddCard */}
            <div className="product-list">
                {productsState.map(product => (
                    <ProductCard
                        key={product.article}
                        product={product}
                        onAddToCart={p => console.log('В корзину:', p)}
                        onDelete={onDelete}
                    />
                ))}

                {/* Вставляем AddCard после всех ProductCard */}
                <AddCard onClick={() => setIsAddOpen(true)} />
            </div>
        </>
    );
}
