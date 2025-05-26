import React, { useState, useRef, useEffect } from 'react';
import '../styles/modalAdd.css';

export default function ModalAdd({ isOpen, onClose, onSave }) {
    const MAX_IMAGES = 5;

    // Поля формы
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    // Ошибки и эффект “тряски”
    const [errors, setErrors] = useState({});
    const [shakeInputs, setShakeInputs] = useState({});

    // Ref-ы для фокуса и для инпута файлов
    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const descriptionRef = useRef(null);
    const brandRef = useRef(null);
    const sizeRef = useRef(null);
    const colorRef = useRef(null);
    const categoryRef = useRef(null);
    const imagesRef = useRef(null);
    const saveButtonRef = useRef(null);

    // Получаем категории из API
    useEffect(() => {
        fetch('http://localhost:8080/category/search/all')
            .then(res => res.json())
            .then(data => setCategories(data.map(cat => cat.categoryName)))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Очистка при размонтировании (если модалка будет удалена из DOM)
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    // Сброс формы при открытии
    useEffect(() => {
        if (isOpen) {
            setName('');
            setPrice('');
            setDescription('');
            setBrand('');
            setSize('');
            setColor('');
            setSelectedCategories([]);
            setImageFiles([]);
            setErrors({});
            setShakeInputs({});
            setTimeout(() => nameRef.current?.focus(), 0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Перевод Enter → следующий инпут
    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef?.current?.focus();
        }
    };

    const handleImageChange = e => {
        // Получили все выбранные файлы
        let files = Array.from(e.target.files);

        // Если пользователь выбрал больше чем MAX_IMAGES
        if (files.length > MAX_IMAGES) {
            alert(`Можно загрузить не более ${MAX_IMAGES} изображений.`);
            // Оставляем только первые MAX_IMAGES
            files = files.slice(0, MAX_IMAGES);
        }

        // Сохраняем в стейт
        setImageFiles(files);
        setErrors(prev => ({ ...prev, imageFiles: files.length === 0 }));

        // Перезаписываем FileList в input, чтобы браузер «забыл» лишние
        const dt = new DataTransfer();
        files.forEach(file => dt.items.add(file));
        if (imagesRef.current) {
            imagesRef.current.files = dt.files;
        }
    };

    // Универсальный onChange
    const handleChange = (setter, field) => e => {
        setter(e.target.value);
        if (e.target.value.trim() !== '') {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    // Удаление превью-изображения и очищение input[type=file]
    const removeImage = idx => {
        const newFiles = imageFiles.filter((_, i) => i !== idx);
        setImageFiles(newFiles);
        setErrors(prev => ({ ...prev, imageFiles: newFiles.length === 0 }));

        const dt = new DataTransfer();
        newFiles.forEach(file => dt.items.add(file));
        if (imagesRef.current) {
            imagesRef.current.files = dt.files;
        }
    };

    // Валидация и сабмит
    const handleSubmit = e => {
        e.preventDefault();

        const newErrors = {
            name: !name.trim(),
            price: !price.trim() || isNaN(Number(price)),
            description: !description.trim(),
            brand: !brand.trim(),
            size: !size.trim(),
            color: !color.trim(),
            selectedCategories: selectedCategories.length === 0,
            imageFiles: imageFiles.length === 0
        };
        setErrors(newErrors);
        setShakeInputs(newErrors);
        setTimeout(() => setShakeInputs({}), 400);

        if (Object.values(newErrors).some(Boolean)) {
            // фокус на первом ошибочном поле
            const order = [
                { field: 'name', ref: nameRef },
                { field: 'price', ref: priceRef },
                { field: 'description', ref: descriptionRef },
                { field: 'brand', ref: brandRef },
                { field: 'size', ref: sizeRef },
                { field: 'color', ref: colorRef },
                { field: 'selectedCategories', ref: categoryRef },
                { field: 'imageFiles', ref: imagesRef }
            ];
            for (let item of order) {
                if (newErrors[item.field]) {
                    item.ref.current?.focus();
                    break;
                }
            }
            return;
        }

        // Создаем объект товара и передаем наверх
        const newProduct = {
            name,
            price: parseFloat(price),
            description,
            brand,
            size,
            color,
            categories: selectedCategories,
            images: imageFiles
        };
        onSave(newProduct);

        // Сброс формы
        setName('');
        setPrice('');
        setDescription('');
        setBrand('');
        setSize('');
        setColor('');
        setSelectedCategories([]);
        setImageFiles([]);
        setErrors({});
        setShakeInputs({});
    };

    // CSS-классы для валидации/shake
    const getClass = field =>
        `${errors[field] ? 'invalid' : ''} ${shakeInputs[field] ? 'shake' : ''}`.trim();

    const renderLabelWithError = (labelText, field) => (
        <div className="label-with-error">
            <label>{labelText}</label>
            {errors[field] && (
                <span className={`error-text${shakeInputs[field] ? ' shake' : ''}`}>
                    Заполните поле
                </span>
            )}
        </div>
    );

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-add">
                <h2>Добавить новый товар</h2>
                <form onSubmit={handleSubmit}>
                    {/* Название товара */}
                    <div className="modal-field">
                        {renderLabelWithError('Название товара', 'name')}
                        <input
                            ref={nameRef}
                            type="text"
                            value={name}
                            className={getClass('name')}
                            placeholder="Введите название (например, «Футболка Hugo»)"
                            onKeyDown={e => handleKeyDown(e, priceRef)}
                            onChange={handleChange(setName, 'name')}
                        />
                    </div>

                    {/* Цена, BYN */}
                    <div className="modal-field">
                        {renderLabelWithError('Цена, BYN', 'price')}
                        <input
                            ref={priceRef}
                            type="number"
                            value={price}
                            className={getClass('price')}
                            placeholder="Введите цену (например, 239.99)"
                            min="0.01"
                            step="0.01"
                            onKeyDown={e => handleKeyDown(e, descriptionRef)}
                            onChange={handleChange(setPrice, 'price')}
                        />
                    </div>

                    {/* Описание */}
                    <div className="modal-field">
                        {renderLabelWithError('Описание', 'description')}
                        <input
                            ref={descriptionRef}
                            type="text"
                            value={description}
                            className={getClass('description')}
                            placeholder="Краткое описание"
                            onKeyDown={e => handleKeyDown(e, brandRef)}
                            onChange={handleChange(setDescription, 'description')}
                        />
                    </div>

                    {/* Бренд */}
                    <div className="modal-field">
                        {renderLabelWithError('Бренд', 'brand')}
                        <input
                            ref={brandRef}
                            type="text"
                            value={brand}
                            className={getClass('brand')}
                            placeholder="Введите бренд (например, «Hugo»)"
                            onKeyDown={e => handleKeyDown(e, sizeRef)}
                            onChange={handleChange(setBrand, 'brand')}
                        />
                    </div>

                    {/* Размер */}
                    <div className="modal-field">
                        {renderLabelWithError('Размер', 'size')}
                        <input
                            ref={sizeRef}
                            type="text"
                            value={size}
                            className={getClass('size')}
                            placeholder="Укажите размер (например, «XL» или «42»)"
                            onKeyDown={e => handleKeyDown(e, colorRef)}
                            onChange={handleChange(setSize, 'size')}
                        />
                    </div>

                    {/* Цвет */}
                    <div className="modal-field">
                        {renderLabelWithError('Цвет', 'color')}
                        <input
                            ref={colorRef}
                            type="text"
                            value={color}
                            className={getClass('color')}
                            placeholder="Укажите цвет (например, «Белый»)"
                            onKeyDown={e => handleKeyDown(e, categoryRef)}
                            onChange={handleChange(setColor, 'color')}
                        />
                    </div>

                    {/* Категории */}
                    <div className={`checkbox-group ${getClass('selectedCategories')}`}>
                        {renderLabelWithError('Категория', 'selectedCategories')}
                        <div
                            ref={categoryRef}
                            className="category-scroll"
                        >
                            {categories.map((cat, idx) => (
                                <label key={idx} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        value={cat}
                                        checked={selectedCategories.includes(cat)}
                                        onChange={e => {
                                            const { value, checked } = e.target;
                                            setSelectedCategories(prev =>
                                                checked ? [...prev, value] : prev.filter(v => v !== value)
                                            );
                                            if (checked || selectedCategories.length > 1) {
                                                setErrors(prev => ({ ...prev, selectedCategories: false }));
                                            }
                                        }}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>


                    {/* Загрузка изображений */}
                    <div className="modal-field">
                        {renderLabelWithError('Изображения (загрузка файлов)', 'imageFiles')}
                        <input
                            ref={imagesRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className={getClass('imageFiles')}
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Превью выбранных изображений */}
                    {imageFiles.length > 0 && (
                        <div className="image-previews">
                            {imageFiles.map((file, idx) => (
                                <div key={idx} className="preview-item">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${idx}`}
                                        className="preview-img"
                                    />
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeImage(idx)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Кнопки */}
                    <div className="modal-buttons">
                        <button type="submit" className="modal-save" ref={saveButtonRef}>
                            Сохранить
                        </button>
                        <button type="button" className="modal-cancel" onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
