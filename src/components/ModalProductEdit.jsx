import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '/Users/phoug/online-store-ui/src/styles/modalProductEdit.css';

export default function ModalEditProduct({ product, isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        name: '',
        brand: '',
        price: '',
        size: '',
        color: '',
        description: '',
        article: '',
    });

    // При открытии или смене продукта обновляем форму
    useEffect(() => {
        if (product && isOpen) {
            setForm({
                name: product.name || '',
                brand: product.brand || '',
                price: product.price !== undefined ? String(product.price) : '',
                size: product.size || '',
                color: product.color || '',
                description: product.description || '',
                article: product.article || '',
            });
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Можно добавить дополнительную валидацию, например price > 0
        if (form.price && isNaN(Number(form.price))) {
            alert('Цена должна быть числом');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/products/update/${form.article}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price: form.price === '' ? null : Number(form.price)
                }),
            });

            if (response.ok) {
                const updated = await response.json();
                onSave(updated);  // Обновляем родительский стейт с новым товаром
                onClose();        // Закрываем модалку
            } else {
                alert("Ошибка при сохранении товара");
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка соединения");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000,
            }}
        >
            <form
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: '#fff',
                    padding: '24px',
                    borderRadius: '10px',
                    width: '90%',
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <h2>Редактирование товара</h2>
                <p>"aSD"</p>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Название товара" required />
                <input name="brand" value={form.brand} onChange={handleChange} placeholder="Бренд" />
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Цена"
                    min="0"
                    step="0.01"
                />
                <input name="size" value={form.size} onChange={handleChange} placeholder="Размер" />
                <input name="color" value={form.color} onChange={handleChange} placeholder="Цвет" />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" onClick={onClose}>Отмена</button>
                    <button type="submit">Сохранить</button>
                </div>
            </form>
        </div>
    );
}

ModalEditProduct.propTypes = {
    product: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};
