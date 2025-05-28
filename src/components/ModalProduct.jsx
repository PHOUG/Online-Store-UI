// src/common/ModalProduct.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Trash2, PencilLine } from 'lucide-react';
import ModalProductEdit from './ModalProductEdit';
import '../styles/modalProduct.css';
import { useCategories } from './CategoriesContext';

export default function ModalProduct({
                                         product,
                                         isOpen,
                                         onClose,
                                         onDelete,
                                     }) {
    const {
        imageUrls = [],
        article = '',
        name = '',
        description = '',
        brand = '',
        size = '',
        color = '',
        price = 0,
        reviewCount = 0,
        averageRating = 0,
        categoryIds = [],
    } = product;

    const { byId: categoryMap } = useCategories();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [visible, setVisible] = useState(false);

    // Блокируем скролл и управляем анимацией появления
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setVisible(true);
        } else {
            document.body.style.overflow = '';
            setVisible(false);
            setIsEditOpen(false);
            setShowConfirm(false);
            setCurrentImageIndex(0);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // время на анимацию скрытия
    };

    const prevImage = e => {
        e.stopPropagation();
        setCurrentImageIndex(i => (i === 0 ? imageUrls.length - 1 : i - 1));
    };

    const nextImage = e => {
        e.stopPropagation();
        setCurrentImageIndex(i => (i === imageUrls.length - 1 ? 0 : i + 1));
    };

    const openEdit = e => {
        e.stopPropagation();
        setIsEditOpen(true);
    };

    const openConfirm = e => {
        e.stopPropagation();
        setShowConfirm(true);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`http://localhost:8080/products/delete/${article}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                onDelete(article);
                setShowConfirm(false);
                handleClose();
            } else {
                alert('Ошибка при удалении товара');
            }
        } catch {
            alert('Ошибка при удалении');
        }
    };

    // Составляем строку с именами категорий по их ID
    const categoriesToShow = categoryIds.length > 0
        ? categoryIds.map(id => categoryMap[id] || `#${id}`).join(', ')
        : '–';

    const modal = (
        <div
            className="mp-overlay"
            onClick={handleClose}
            style={{ opacity: visible ? 1 : 0 }}
        >
            <div
                className="mp-window"
                onClick={e => e.stopPropagation()}
                style={{ transform: visible ? 'scale(1)' : 'scale(0.8)' }}
            >
                <div className="mp-left">
                    {imageUrls.length > 0 ? (
                        <>
                            <img
                                src={`${imageUrls[currentImageIndex]}`}
                                alt={`Product ${currentImageIndex + 1}`}
                                className="mp-image"
                            />
                            <button className="mp-nav mp-prev" onClick={prevImage}>
                                <ChevronLeft size={24} />
                            </button>
                            <button className="mp-nav mp-next" onClick={nextImage}>
                                <ChevronRight size={24} />
                            </button>
                        </>
                    ) : (
                        <div className="mp-no-image">No Image</div>
                    )}
                </div>

                <div className="mp-right">
                    <div className="mp-info">
                        <h2 className="mp-title">{name}</h2>
                        <p><strong>Артикул:</strong> {article}</p>
                        <p><strong>Бренд:</strong> {brand}</p>
                        <p><strong>Цена:</strong> {price.toFixed(2)} BYN</p>
                        <p><strong>Описание:</strong> {description || '–'}</p>
                        <p><strong>Размер:</strong> {size || '–'}</p>
                        <p><strong>Цвет:</strong> {color || '–'}</p>
                        <p><strong>Категории:</strong> {categoriesToShow}</p>
                        <p>
                            <strong>Рейтинг:</strong> {averageRating.toFixed(1)} ★ (
                            {reviewCount} {reviewCount === 1 ? 'отзыв' : 'отзывов'})
                        </p>
                    </div>

                </div>
            </div>

            {isEditOpen && (
                <ModalProductEdit
                    product={product}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSave={() => setIsEditOpen(false)}
                    style={{ zIndex: 2000 }}
                />
            )}
        </div>
    );

    return ReactDOM.createPortal(modal, document.body);
}

ModalProduct.propTypes = {
    product: PropTypes.shape({
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        article: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        brand: PropTypes.string,
        size: PropTypes.string,
        color: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reviewCount: PropTypes.number,
        averageRating: PropTypes.number,
        categoryIds: PropTypes.arrayOf(PropTypes.number),
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
