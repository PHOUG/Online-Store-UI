export default function HeaderButton({ icon: Icon, label, hovered, setHovered, onClick }) {
    const color = hovered ? '#E83100' : '#E9E9E9';

    return (
        <div
            className="header-button"
            style={{ color }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
        >
            <Icon size={24} color="currentColor" />
            <span className="header-button-label" style={{ color: 'currentColor' }}>
                {label}
            </span>
        </div>
    );
}
