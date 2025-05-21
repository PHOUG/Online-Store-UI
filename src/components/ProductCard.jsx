import { useState, useEffect } from 'react';

export default function ProductCard({ product, onAddToCart }) {
    const { price, name, brand, averageRating, reviewCount, images = [] } = product;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isHovered) {
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
        height: '100%',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: isHovered ? '0 6px 16px rgba(0, 0, 0, 0.4)' : 'none',
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={cardStyle}
        >
            <div style={{ flexGrow: 1 }}>
                <img
                    src={images[currentImageIndex]}
                    alt={`Product ${currentImageIndex + 1}`}
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        transition: 'opacity 0.3s ease-in-out'
                    }}
                />

                <h3 style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    margin: '12px 0 4px 0'
                }}>
                    {price} BYN
                </h3>

                <p style={{ margin: '0 0 4px 0', color: '#aaa' }}>
                    <span style={{ color: '#fff' }}>{brand}</span>
                    <span> | {name}</span>
                </p>

                <div style={{ color: '#e9e9e9', fontSize: '14px', marginBottom: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>{averageRating.toFixed(1)} ★</span>
                    <span style={{ marginLeft: '8px', color: '#aaa' }}>
                        {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <button
                style={{
                    marginTop: '0px',
                    padding: '10px 16px',
                    backgroundColor: '#e9e9e9',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#1f1f1f',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                }}
                onClick={() => onAddToCart(product)}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e83100';
                    e.target.style.color = '#fff';
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
    );
}
