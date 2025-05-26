import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';

export default function HeaderLogo() {
    return (
        <Link to="/" className="header-logo-link">
            <h1 className="header-logo-text">PHOUG</h1>
        </Link>
    );
}
