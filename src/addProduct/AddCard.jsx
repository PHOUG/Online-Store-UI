import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import '../styles/addCard.css';

export default function AddCard({ onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`add-card${isHovered ? ' hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <Plus size={48} />
            <span className="add-card-label">Добавить товар</span>
        </div>
    );
}
