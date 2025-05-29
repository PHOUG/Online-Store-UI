import React, { useState, useEffect, useRef } from 'react';
import '../../styles/modalAdd.css';

export default function ModalAdd({ isOpen, onClose, onCreate }) {
    const MAX_IMAGES = 5;

    // Состояние формы
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        brand: '',
        size: '',
        color: ''
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    // Валидация
    const [errors, setErrors] = useState({});
    const [shake, setShake] = useState({});

    // Refs для фокуса
    const refs = {
        name: useRef(null),
        price: useRef(null),
        description: useRef(null),
        brand: useRef(null),
        size: useRef(null),
        color: useRef(null),
        categories: useRef(null),
        images: useRef(null)
    };

    // Загрузка категорий
    useEffect(() => {
        fetch('http://localhost:8080/category/search/all')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error);
    }, []);

    // Блокировка прокрутки
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Сброс формы при открытии
    useEffect(() => {
        if (isOpen) {
            setForm({ name: '', price: '', description: '', brand: '', size: '', color: '' });
            setSelectedCategories([]);
            setImageFiles([]);
            setErrors({});
            setShake({});
            setTimeout(() => refs.name.current?.focus(), 0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Изменение полей
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (value.trim()) setErrors(prev => ({ ...prev, [name]: false }));
    };

    const handleCategory = e => {
        const { value, checked } = e.target;
        setSelectedCategories(prev => checked ? [...prev, value] : prev.filter(v => v !== value));
        if (checked || selectedCategories.length > 1) setErrors(prev => ({ ...prev, categoryIds: false }));
    };

    const handleImageChange = e => {
        let files = Array.from(e.target.files);
        if (files.length > MAX_IMAGES) files = files.slice(0, MAX_IMAGES);
        setImageFiles(files);
        setErrors(prev => ({ ...prev, images: files.length === 0 }));
        const dt = new DataTransfer(); files.forEach(f => dt.items.add(f));
        if (refs.images.current) refs.images.current.files = dt.files;
    };

    const removeImage = idx => {
        const files = imageFiles.filter((_, i) => i !== idx);
        setImageFiles(files);
        setErrors(prev => ({ ...prev, images: files.length === 0 }));
        const dt = new DataTransfer(); files.forEach(f => dt.items.add(f));
        if (refs.images.current) refs.images.current.files = dt.files;
    };

    // Валидация
    const validate = () => {
        const errs = {};
        ['name','price','description','brand','size','color'].forEach(f => {
            if (!form[f].trim()) errs[f] = true;
        });
        if (isNaN(Number(form.price))) errs.price = true;
        if (!selectedCategories.length) errs.categoryIds = true;
        if (!imageFiles.length) errs.images = true;
        setErrors(errs);
        setShake(errs);
        setTimeout(() => setShake({}), 400);
        return !Object.keys(errs).length;
    };

    const focusFirstError = () => {
        const order = ['name','price','description','brand','size','color'];
        for (let f of order) if (errors[f]) { refs[f].current.focus(); return; }
        if (errors.categoryIds) { refs.categories.current.focus(); return; }
        if (errors.images) { refs.images.current.focus(); }
    };

    // Сабмит без отлова ошибок
    const handleSubmit = e => {
        e.preventDefault();
        if (!validate()) { focusFirstError(); return; }

        const data = new FormData();
        Object.entries(form).forEach(([k,v]) => data.append(k, v));
        selectedCategories.forEach(id => data.append('categoryIds', id));
        imageFiles.forEach(file => data.append('images', file));

        fetch('http://localhost:8080/products/create', {
            method: 'POST',
            body: data
        });
        onCreate && onCreate();
        onClose();
    };

    const cls = key => `${errors[key] ? 'invalid' : ''} ${shake[key] ? 'shake' : ''}`.trim();

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-add">
                <h2>Добавить новый товар</h2>
                <form onSubmit={handleSubmit}>
                    {['name','price','description','brand','size','color'].map(key => (
                        <div className="modal-field" key={key}>
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                                ref={refs[key]}
                                name={key}
                                type={key === 'price' ? 'number' : 'text'}
                                value={form[key]}
                                className={cls(key)}
                                onChange={handleChange}
                                placeholder={key === 'price' ? '123.45' : ''}
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
                                        checked={selectedCategories.includes(cat.id.toString())}
                                        onChange={handleCategory}
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
                            {imageFiles.map((file, i) => (
                                <div key={i} className="preview-item">
                                    <img src={URL.createObjectURL(file)} alt="preview" className="preview-img" />
                                    <button type="button" onClick={() => removeImage(i)} className="remove-btn">&times;</button>
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
        </>
    );
}
