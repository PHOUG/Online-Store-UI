import { useState, useEffect } from 'react';
import ModalProduct from './ModalProduct';

function pluralizeReview(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return `${count} отзыв`;
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        return `${count} отзыва`;
    } else {
        return `${count} отзывов`;
    }
}

export default function ProductCard({ product, onAddToCart, onDelete }) {
    const { price, name, brand, averageRating, reviewCount, images = [] } = product;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/products/delete/${product.article}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Если удаление прошло успешно, вызываем callback из родителя,
                // чтобы обновить список товаров
                onDelete(product.article);
                setShowModal(false); // Закрыть модальное окно после удаления
            } else if (response.status === 404) {
                alert("Товар не найден для удаления" + toString(product.article));
            } else {
                alert("Ошибка при удалении товара");
            }
        } catch (error) {
            console.error("Ошибка при запросе на удаление:", error);
        }
    };

    useEffect(() => {
        let interval = null;
        if (isHovered && images.length > 0) {
            interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % images.length);
            }, 1000);
        } else {
            setCurrentImageIndex(0);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isHovered, images.length]);

    const cardStyle = {
        backgroundColor: '#252525',
        padding: '16px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: '415px',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: isHovered ? '0 6px 16px rgba(0, 0, 0, 0.4)' : 'none',
        cursor: 'pointer',
    };

    return (
        <>
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setShowModal(true)}
                style={cardStyle}
                onMouseDown={e => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={e => {
                    e.currentTarget.style.transform = isHovered ? 'scale(1.02)' : 'scale(1)';
                }}
            >
                <div style={{ flexGrow: 1 }}>
                    <img
                        src={images[currentImageIndex]}
                        alt={`Product ${currentImageIndex + 1}`}
                        style={{
                            width: '100%',
                            height: '275px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                    />

                    <h3 style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        margin: '12px 0 4px 0'
                    }}>
                        {price} BYN
                    </h3>

                    <p style={{
                        margin: '0 0 4px 0',
                        color: '#aaa',
                        fontSize: '14px',
                    }}>
                        <span style={{ color: '#fff' }}>{brand}</span>
                        <span> | {name}</span>
                    </p>

                    <div style={{ color: '#e9e9e9', fontSize: '14px' }}>
                        <span style={{ fontWeight: 'bold' }}>{averageRating.toFixed(1)} ★</span>
                        <span style={{ marginLeft: '8px', color: '#aaa' }}>
                            {pluralizeReview(reviewCount)}
                        </span>
                    </div>
                </div>

                <button
                    style={{
                        padding: '10px 16px',
                        backgroundColor: '#e9e9e9',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#1f1f1f',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontFamily: 'Bahnschrift',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // предотвратить открытие модального окна
                        onAddToCart(product);
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e83100';
                        e.target.style.color = '#e9e9e9';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#e9e9e9';
                        e.target.style.color = '#1f1f1f';
                    }}
                    onMouseDown={(e) => {
                        e.target.style.transform = 'scale(0.96)';
                    }}
                    onMouseUp={(e) => {
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    В корзину
                </button>
            </div>

            <ModalProduct
                product={product}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onDelete={handleDelete}  // Передаем сюда функцию удаления с fetch
            />
        </>
    );
}
