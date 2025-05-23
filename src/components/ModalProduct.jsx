import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Trash2, PencilLine } from 'lucide-react';
import ModalProductEdit from './ModalProductEdit';

export default function ModalProduct({
                                         product,
                                         isOpen,
                                         onClose,
                                         onDelete,
                                     }) {
    const {
        images = [],
        article,
        name,
        description,
        brand,
        size,
        color,
        price,
        reviewCount,
        averageRating,
        categories = [],
    } = product;

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
            setIsEditOpen(false); // закрываем редактор при закрытии основного окна
            setShowConfirm(false);
            setCurrentImageIndex(0);
        }
    }, [isOpen]);

    const handleEditClick = e => {
        e.stopPropagation();
        setIsEditOpen(true);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // время для анимации
    };

    if (!isOpen) return null;

    const prevImage = e => {
        e.stopPropagation();
        setCurrentImageIndex(i => (i === 0 ? images.length - 1 : i - 1));
    };
    const nextImage = e => {
        e.stopPropagation();
        setCurrentImageIndex(i => (i === images.length - 1 ? 0 : i + 1));
    };

    const handleDeleteClick = e => {
        e.stopPropagation();
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/products/delete/${article}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onDelete(article);
                setShowConfirm(false);
                handleClose();
            } else {
                alert("Ошибка при удалении товара");
            }
        } catch {
            alert("Ошибка при удалении");
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    return (
        <>
            {/* Основное модальное окно */}
            <div
                onClick={handleClose}
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '16px',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            >
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        position: 'relative',
                        backgroundColor: '#E9E9E9',
                        color: '#1F1F1F',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        width: '100%',
                        maxWidth: '800px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        height: '500px',
                        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                        transition: 'transform 0.3s ease',
                    }}
                >
                    {/* Левая часть с изображениями */}
                    <div style={{ position: 'relative', flex: '0 0 50%' }}>
                        {images.length > 0 ? (
                            <>
                                <img
                                    src={images[currentImageIndex]}
                                    alt={`Product image ${currentImageIndex + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <button
                                    onClick={prevImage}
                                    onMouseDown={e =>
                                        (e.currentTarget.style.transform = 'translateY(-50%) scale(0.96)')
                                    }
                                    onMouseUp={e =>
                                        (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')
                                    }
                                    style={{
                                        position: 'absolute',
                                        top: '50%', left: '8px',
                                        transform: 'translateY(-50%) scale(1)',
                                        padding: '8px',
                                        backgroundColor: 'rgba(232,49,0,0.25)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        transition: 'transform 0.1s ease',
                                    }}
                                >
                                    <ChevronLeft size={24} color="#1F1F1F" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    onMouseDown={e =>
                                        (e.currentTarget.style.transform = 'translateY(-50%) scale(0.96)')
                                    }
                                    onMouseUp={e =>
                                        (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')
                                    }
                                    style={{
                                        position: 'absolute',
                                        top: '50%', right: '8px',
                                        transform: 'translateY(-50%) scale(1)',
                                        padding: '8px',
                                        backgroundColor: 'rgba(232,49,0,0.25)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        transition: 'transform 0.1s ease',
                                    }}
                                >
                                    <ChevronRight size={24} color="#1F1F1F" />
                                </button>
                            </>
                        ) : (
                            <div
                                style={{
                                    width: '100%', height: '100%',
                                    backgroundColor: '#ccc',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#777',
                                }}
                            >
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Правая часть с информацией */}
                    <div
                        style={{
                            flex: '1 1 50%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '24px',
                        }}
                    >
                        <div style={{ overflowY: 'auto' }}>
                            <h2 style={{ marginTop: 0 }}>{name}</h2>
                            <p><strong>Артикул:</strong> {article}</p>
                            <p><strong>Бренд:</strong> {brand}</p>
                            <p><strong>Цена:</strong> {price} BYN</p>
                            <p><strong>Описание:</strong> {description || '–'}</p>
                            <p><strong>Размер:</strong> {size || '–'}</p>
                            <p><strong>Цвет:</strong> {color || '–'}</p>
                            <p>
                                <strong>Категории:</strong>{' '}
                                {categories.length > 0
                                    ? categories.map(cat => cat.name).join(', ')
                                    : '–'}
                            </p>
                            <p>
                                <strong>Рейтинг:</strong> {averageRating.toFixed(1)} ★ (
                                {reviewCount} {reviewCount === 1 ? 'отзыв' : 'отзывов'})
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '16px',
                                marginTop: '16px',
                            }}
                        >
                            <button
                                onClick={handleEditClick}
                                onMouseEnter={e => (e.currentTarget.style.color = '#E83100')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#1F1F1F')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#1F1F1F',
                                    transition: 'color 0.2s ease',
                                }}
                                title="Редактировать"
                            >
                                <PencilLine size={20} color="currentColor" />
                            </button>

                            <button
                                onClick={handleDeleteClick}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#1F1F1F',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#E83100')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#1F1F1F')}
                                title="Удалить"
                            >
                                <Trash2 size={20} color="currentColor" />
                            </button>
                        </div>
                    </div>

                    {/* Confirm delete внутри основного модального окна */}
                    {showConfirm && (
                        <div
                            onClick={e => e.stopPropagation()}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                padding: '24px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                zIndex: 1100,
                                width: '80%',
                                maxWidth: '400px',
                                textAlign: 'center',
                                opacity: showConfirm ? 1 : 0,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <p style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 'bold' }}>
                                Вы уверены, что хотите удалить этот товар?
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                <button
                                    onClick={confirmDelete}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#E83100',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Да
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#ccc',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Нет
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Второе модальное окно редактирования поверх первого */}
            {isEditOpen && (
                <ModalProductEdit
                    product={product}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSave={() => {
                        setIsEditOpen(false);
                        // если нужно, обновить данные
                    }}
                    style={{
                        zIndex: 2000, // выше первого окна
                    }}
                />
            )}
        </>
    );
}

ModalProduct.propTypes = {
    product: PropTypes.shape({
        images: PropTypes.arrayOf(PropTypes.string),
        article: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        brand: PropTypes.string,
        size: PropTypes.string,
        color: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reviewCount: PropTypes.number,
        averageRating: PropTypes.number,
        categories: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
            }),
        ),
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
