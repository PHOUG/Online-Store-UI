import ProductCard from './ProductCard';

export default function ProductList({ products }) {
    const handleAddToCart = (product) => {
        console.log('Добавлен в корзину:', product.name);
    };

    if (products.length === 0) {
        return <p>Нет доступных товаров.</p>;
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)', // 5 карточек в ряд
                gap: '50px', // одинаковые отступы по вертикали и горизонтали
                padding: '20px',
                paddingLeft: 110,
                paddingRight: 110,
            }}
        >
            {products.map(product => (
                <ProductCard
                    key={product.article}
                    product={product}
                    onAddToCart={handleAddToCart}
                />
            ))}
        </div>
    );
}
