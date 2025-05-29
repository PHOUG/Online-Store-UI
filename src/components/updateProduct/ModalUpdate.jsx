// src/components/addProduct/ModalUpdate.jsx
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/modalAdd.css';

export default function ModalUpdate({ isOpen, onClose, onSave, product }) {
    const MAX_IMAGES = 5;

    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        brand: '',
        size: '',
        color: '',
    });

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [shake, setShake] = useState({});

    const refs = {
        name: useRef(),
        price: useRef(),
        description: useRef(),
        brand: useRef(),
        size: useRef(),
        color: useRef(),
        categories: useRef(),
        images: useRef(),
    };

    useEffect(() => {
        fetch('http://localhost:8080/category/search/all')
            .then(r => r.json())
            .then(setCategories)
            .catch(console.error);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && product) {
            setForm({
                name: product.name || '',
                price: product.price != null ? product.price.toString() : '',
                description: product.description || '',
                brand: product.brand || '',
                size: product.size || '',
                color: product.color || '',
            });
            setSelectedCategories((product.categoryIds || []).map(String));
            setImageFiles([]);
            setErrors({});
            setShake({});
            setTimeout(() => refs.name.current?.focus(), 0);
        }
    }, [isOpen, product]);

    if (!isOpen) return null;

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (value.trim()) setErrors(prev => ({ ...prev, [name]: false }));
    };

    const handleCategoryChange = e => {
        const { value, checked } = e.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(id => id !== value)
        );
        if (checked) setErrors(prev => ({ ...prev, categoryIds: false }));
    };

    const handleImageChange = e => {
        const files = Array.from(e.target.files).slice(0, MAX_IMAGES);
        setImageFiles(files);
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        if (refs.images.current) refs.images.current.files = dt.files;
    };

    const removeImage = index => {
        const updated = imageFiles.filter((_, i) => i !== index);
        setImageFiles(updated);
        const dt = new DataTransfer();
        updated.forEach(f => dt.items.add(f));
        if (refs.images.current) refs.images.current.files = dt.files;
    };

    const validate = () => {
        const errs = {};
        ['name', 'price', 'description', 'brand', 'size', 'color'].forEach(field => {
            if (!form[field].trim()) errs[field] = true;
        });
        if (!form.price.trim() || isNaN(Number(form.price))) errs.price = true;
        if (selectedCategories.length === 0) errs.categoryIds = true;

        setErrors(errs);
        setShake(errs);
        setTimeout(() => setShake({}), 400);

        return Object.keys(errs).length === 0;
    };

    const focusFirstError = () => {
        for (const field of ['name', 'price', 'description', 'brand', 'size', 'color']) {
            if (errors[field]) {
                refs[field].current?.focus();
                return;
            }
        }
        if (errors.categoryIds) refs.categories.current?.focus();
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) {
            focusFirstError();
            return;
        }

        if (!product.article) {
            alert('Артикул товара не указан.');
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });
        selectedCategories.forEach(id => formData.append('categoryIds', id));
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => formData.append('images', file));
        }

        try {
            const res = await fetch(`http://localhost:8080/products/update/${product.article}`, {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                const updatedProduct = await res.json();
                onSave(updatedProduct);
                onClose();
            } else {
                const errorText = await res.text();
                console.error('Ошибка при обновлении товара:', errorText);
                alert('Не удалось обновить товар');
            }
        } catch (error) {
            console.error('Ошибка при обновлении товара:', error);
            alert('Не удалось обновить товар');
        }
    };

    const cls = key =>
        `${errors[key] ? 'invalid' : ''} ${shake[key] ? 'shake' : ''}`.trim();

    return ReactDOM.createPortal(
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-add modal-center">
                <h2>Редактировать товар</h2>
                <form onSubmit={handleSubmit}>
                    {['name', 'price', 'description', 'brand', 'size', 'color'].map(field => (
                        <div key={field} className="modal-field">
                            <label>{{
                                name: 'Название товара',
                                price: 'Цена, BYN',
                                description: 'Описание',
                                brand: 'Бренд',
                                size: 'Размер',
                                color: 'Цвет'
                            }[field]}</label>
                            <input
                                ref={refs[field]}
                                name={field}
                                type={field === 'price' ? 'number' : 'text'}
                                value={form[field]}
                                className={cls(field)}
                                onChange={handleChange}
                                placeholder={{
                                    name: 'Введите название товара',
                                    price: '123.45',
                                    description: 'Введите подробное описание',
                                    brand: 'Введите бренд',
                                    size: 'Введите размер (например, M)',
                                    color: 'Введите цвет'
                                }[field]}
                                min={field === 'price' ? '0.01' : undefined}
                                step={field === 'price' ? '0.01' : undefined}
                            />
                        </div>
                    ))}
                    <div className={`checkbox-group ${cls('categoryIds')}`}>
                        <label>Категории</label>
                        <div ref={refs.categories} className="category-scroll">
                            {categories.map(cat => (
                                <label key={cat.id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        value={cat.id}
                                        checked={selectedCategories.includes(String(cat.id))}
                                        onChange={handleCategoryChange}
                                    />
                                    {cat.categoryName || cat.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="modal-field">
                        <label>Изображения</label>
                        <input
                            ref={refs.images}
                            type="file"
                            multiple
                            accept="image/*"
                            className={cls('images')}
                            onChange={handleImageChange}
                        />
                    </div>
                    {imageFiles.length > 0 && (
                        <div className="image-previews">
                            {imageFiles.map((f, i) => (
                                <div key={i} className="preview-item">
                                    <img
                                        src={URL.createObjectURL(f)}
                                        alt={`preview-${i}`}
                                        className="preview-img"
                                    />
                                    <button type="button" onClick={() => removeImage(i)} className="remove-btn">
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="modal-buttons">
                        <button type="submit" className="modal-save">Сохранить</button>
                        <button type="button" className="modal-cancel" onClick={onClose}>Отмена</button>
                    </div>
                </form>
            </div>
        </>,
        document.body
    );
}
