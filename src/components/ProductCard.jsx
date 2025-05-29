// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Trash2, PencilLine } from 'lucide-react';
import ModalProduct from './ModalProduct';
import ConfirmModal from './ConfirmModal';
import '../styles/productCard.css';

function pluralizeReview(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} отзыв`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} отзыва`;
    return `${count} отзывов`;
}

export default function ProductCard({ product = {}, onAddToCart, onDelete, onUpdate }) {
    const {
        price = 0,
        name = '',
        brand = '',
        averageRating = 0,
        reviewCount = 0,
        imageUrls = [],
        article = '',
    } = product;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const isAnyModalOpen = showDetailModal || showDeleteConfirm || showEditModal;

    useEffect(() => {
        let interval = null;
        if (isHovered && imageUrls.length > 0) {
            interval = setInterval(() => {
                setCurrentImageIndex(i => (i + 1) % imageUrls.length);
            }, 1000);
        } else {
            setCurrentImageIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, isAnyModalOpen, imageUrls.length]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:8080/products/delete/${article}`, { method: 'DELETE' });
            if (res.ok) {
                onDelete(article);
            } else {
                alert('Ошибка при удалении');
            }
        } catch (err) {
            console.error(err);
            alert('Сетевая ошибка');
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const openDetailModal = (e) => {
        e.stopPropagation();
        setIsHovered(false);
        setShowDetailModal(true);
    };

    const openDeleteModal = (e) => {
        e.stopPropagation();
        setIsHovered(false);
        setShowDeleteConfirm(true);
    };

    return (
        <div
            className={`product-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {imageUrls.length > 0 && (
                <img
                    src={imageUrls[currentImageIndex]}
                    alt="Product"
                    className="product-card-image"
                    onClick={openDetailModal}
                    style={{ cursor: 'pointer' }}
                />
            )}

            <div className="product-card-content">
                <div
                    className="product-card-text"
                    onClick={openDetailModal}
                    style={{ cursor: 'pointer' }}
                >
                    <h3 className="product-card-price">{price.toFixed(2)} BYN</h3>
                    <p className="product-card-brand-name">
                        <span>{brand}</span> | {name}
                    </p>
                    <div className="product-card-rating">
                        <strong>{averageRating.toFixed(1)} ★</strong> <span>{pluralizeReview(reviewCount)}</span>
                    </div>
                </div>

                <div className="product-card-icons">
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            onUpdate(product); // вызов функции из родителя
                        }}
                        className="icon-button"
                        aria-label="Изменить товар"
                        title="Изменить товар"
                    >
                        <PencilLine size={24}/>
                    </button>

                    <button
                        onClick={openDeleteModal}
                        className="icon-button"
                        aria-label="Удалить товар"
                        title="Удалить товар"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            </div>

            <button
                onClick={e => { e.stopPropagation(); onAddToCart(product); }}
                className="product-card-button full-width-wide"
            >
                В корзину
            </button>

            {showDetailModal && (
                <ModalProduct
                    product={product}
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    onDelete={() => setShowDeleteConfirm(true)}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    productName={name}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}


        </div>
    );
}
