import React, { useState } from 'react';
import ProductCard from './ProductCard';
import AddCard from './addProduct/AddCard';
import ModalAdd from './addProduct/ModalAdd';
import ModalUpdate from './updateProduct/ModalUpdate';
import '../styles/productList.css';

export default function ProductList({ products, onDelete, onCreate, onUpdate }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openAdd = () => setIsAddOpen(true);
    const closeAdd = () => setIsAddOpen(false);

    const openUpdate = (product) => {
        setSelectedProduct(product);
        setIsUpdateOpen(true);
    };

    const closeUpdate = () => {
        setIsUpdateOpen(false);
        // Очистим выбранный товар, чтобы поля точно обнулились
        setSelectedProduct(null);
    };

    const handleSaveAdd = async () => {
        await onCreate(); // Обновление списка после добавления
        closeAdd();
    };

    const handleSaveUpdate = async (updatedProduct) => {
        await onUpdate(updatedProduct);
        closeUpdate();
    };

    return (
        <>
            <ModalAdd
                isOpen={isAddOpen}
                onClose={closeAdd}
                onSave={handleSaveAdd}
            />
            {selectedProduct && (
                <ModalUpdate
                    isOpen={isUpdateOpen}
                    onClose={closeUpdate}
                    onSave={handleSaveUpdate}
                    product={selectedProduct}
                />
            )}
            <div className="product-list">
                {products.map(p => (
                    <ProductCard
                        key={p.id || p.article}
                        product={p}
                        onAddToCart={() => {}}
                        onDelete={onDelete}
                        onUpdate={openUpdate}
                    />
                ))}
                <AddCard onClick={openAdd} />
            </div>
        </>
    );
}
