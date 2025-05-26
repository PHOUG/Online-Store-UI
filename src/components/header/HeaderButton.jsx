import React from 'react';

const HeaderButton = React.forwardRef(function HeaderButton(
    { icon: Icon, label, hovered, setHovered, onClick },
    ref
) {
    const color = hovered ? '#E83100' : '#E9E9E9';

    return (
        <button
            ref={ref}
            type="button"
            className="header-button"
            style={{ color }}
            onMouseEnter={() => setHovered && setHovered(true)}
            onMouseLeave={() => setHovered && setHovered(false)}
            onClick={onClick}
        >
            <Icon size={24} color="currentColor" />
            <span className="header-button-label">{label}</span>
        </button>
    );
});

export default HeaderButton;
