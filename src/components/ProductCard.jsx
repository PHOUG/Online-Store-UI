// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Trash2, PencilLine } from 'lucide-react';
import ModalProduct from './ModalProduct';
import ModalAdd from '../addProduct/ModalAdd';
import ConfirmModal from './ConfirmModal';
import '../styles/productCard.css';  // импорт стилей

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
            clearInterval(interval);
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

    return (
        <div
            className={`product-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Картинка — кликабельна */}
            {imageUrls.length > 0 && (
                <img
                    src={`${imageUrls[currentImageIndex]}`}
                    alt="Product"
                    className="product-card-image"
                    style={{ cursor: 'pointer' }}
                    onClick={e => {
                        e.stopPropagation();
                        setShowDetailModal(true);
                        setIsHovered(false);
                    }}

                />
            )}

            {/* Блок: информация + иконки */}
            <div className="product-card-content">
                {/* Текст — кликабелен */}
                <div
                    className="product-card-text"
                    style={{ cursor: 'pointer' }}
                    onClick={e => {
                        e.stopPropagation();
                        setShowDetailModal(true);
                        setIsHovered(false);
                    }}
                >
                    <h3 className="product-card-price">{price.toFixed(2)} BYN</h3>
                    <p className="product-card-brand-name">
                        <span>{brand}</span> | {name}
                    </p>
                    <div className="product-card-rating">
                        <strong>{averageRating.toFixed(1)} ★</strong>{' '}
                        <span>{pluralizeReview(reviewCount)}</span>
                    </div>
                </div>

                {/* Иконки — клики не всплывают */}
                <div className="product-card-icons">
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setShowEditModal(true);
                            setIsHovered(false);
                        }}
                        className="icon-button"
                        aria-label="Изменить товар"
                        title="Изменить товар"
                    >
                        <PencilLine size={24} />
                    </button>

                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                            setIsHovered(false);
                        }}
                        className="icon-button"
                        aria-label="Удалить товар"
                        title="Удалить товар"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            </div>

            {/* Кнопка "В корзину" — клик не всплывает */}
            <button
                onClick={e => {
                    e.stopPropagation();
                    onAddToCart(product);
                }}
                className="product-card-button full-width-wide"
                aria-label="Добавить в корзину"
            >
                В корзину
            </button>

            {/* Детальный просмотр товара */}
            {showDetailModal && (
                <ModalProduct
                    product={product}
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    onDelete={() => setShowDeleteConfirm(true)}
                />
            )}

            {/* Подтверждение удаления */}
            {showDeleteConfirm && (
                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    productName={name}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}

            {/* Модалка редактирования */}
            {showEditModal && (
                <ModalAdd
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={updated => {
                        onUpdate(updated);
                        setShowEditModal(false);
                    }}
                    initialData={product}
                />
            )}
        </div>
    );
}
