import React, { useState, useEffect, useRef } from 'react';
import '../../styles/modalAdd.css';

export default function ModalAdd({ isOpen, onClose, onSave }) {
    const MAX_IMAGES = 5;

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
        images: useRef()
    };

    useEffect(() => {
        fetch('http://localhost:8080/category/search/all')
            .then(r => r.json())
            .then(setCategories)
            .catch(console.error);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

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

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        if (value.trim()) setErrors(e => ({ ...e, [name]: false }));
    };

    const handleCategory = e => {
        const { value, checked } = e.target;
        setSelectedCategories(s => checked ? [...s, value] : s.filter(x => x !== value));
        if (checked) setErrors(e => ({ ...e, categoryIds: false }));
    };

    const handleImageChange = e => {
        let files = Array.from(e.target.files).slice(0, MAX_IMAGES);
        setImageFiles(files);
        setErrors(e => ({ ...e, images: files.length === 0 }));
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        if (refs.images.current) refs.images.current.files = dt.files;
    };

    const removeImage = i => {
        const files = imageFiles.filter((_, idx) => idx !== i);
        setImageFiles(files);
        setErrors(e => ({ ...e, images: files.length === 0 }));
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        if (refs.images.current) refs.images.current.files = dt.files;
    };

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
        for (let f of ['name','price','description','brand','size','color']) {
            if (errors[f]) { refs[f].current.focus(); return; }
        }
        if (errors.categoryIds) { refs.categories.current.focus(); return; }
        if (errors.images) { refs.images.current.focus(); }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) { focusFirstError(); return; }

        const data = new FormData();
        Object.entries(form).forEach(([k,v]) => data.append(k, v));
        selectedCategories.forEach(id => data.append('categoryIds', id));
        imageFiles.forEach(f => data.append('images', f));

        const res = await fetch('http://localhost:8080/products/create', { method: 'POST', body: data });
        if (res.status === 201) {
            onSave();
        } else {
            console.error('Create failed:', await res.text());
            alert('Не удалось создать товар');
        }
    };

    const cls = key => `${errors[key]?'invalid':''} ${shake[key]?'shake':''}`.trim();

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-add">
                <h2>Добавить новый товар</h2>
                <form onSubmit={handleSubmit}>
                    {/* Название */}
                    <div className="modal-field">
                        <label>Название товара</label>
                        <input
                            ref={refs.name}
                            name="name"
                            type="text"
                            value={form.name}
                            className={cls('name')}
                            onChange={handleChange}
                            placeholder="Введите название товара"
                        />
                    </div>

                    {/* Цена */}
                    <div className="modal-field">
                        <label>Цена, BYN</label>
                        <input
                            ref={refs.price}
                            name="price"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.price}
                            className={cls('price')}
                            onChange={handleChange}
                            placeholder="123.45"
                        />
                    </div>

                    {/* Описание */}
                    <div className="modal-field">
                        <label>Описание</label>
                        <input
                            ref={refs.description}
                            name="description"
                            value={form.description}
                            className={cls('description')}
                            onChange={handleChange}
                            placeholder="Введите описание товара"
                        />
                    </div>

                    {/* Бренд */}
                    <div className="modal-field">
                        <label>Бренд</label>
                        <input
                            ref={refs.brand}
                            name="brand"
                            type="text"
                            value={form.brand}
                            className={cls('brand')}
                            onChange={handleChange}
                            placeholder="Введите бренд товара"
                        />
                    </div>

                    {/* Размер */}
                    <div className="modal-field">
                        <label>Размер</label>
                        <input
                            ref={refs.size}
                            name="size"
                            type="text"
                            value={form.size}
                            className={cls('size')}
                            onChange={handleChange}
                            placeholder="Введите размер (например, M)"
                        />
                    </div>

                    {/* Цвет */}
                    <div className="modal-field">
                        <label>Цвет</label>
                        <input
                            ref={refs.color}
                            name="color"
                            type="text"
                            value={form.color}
                            className={cls('color')}
                            onChange={handleChange}
                            placeholder="Введите цвет (например, Black)"
                        />
                    </div>

                    {/* Категории */}
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

                    {/* Изображения */}
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
                                    <img src={URL.createObjectURL(f)} alt="preview" className="preview-img" />
                                    <button type="button" onClick={() => removeImage(i)} className="remove-btn">&times;</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Кнопки */}
                    <div className="modal-buttons">
                        <button type="submit" className="modal-save">Сохранить</button>
                        <button type="button" className="modal-cancel" onClick={onClose}>Отмена</button>
                    </div>
                </form>
            </div>
        </>
    );
}
