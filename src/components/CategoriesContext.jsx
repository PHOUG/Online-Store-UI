// src/contexts/CategoriesContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const CategoriesContext = createContext({
    byId: {},
    list: [],
    loading: true,
});

export function CategoriesProvider({ children }) {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/category/search/all')
            .then(res => res.json())
            .then(data => setList(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // строим lookup id → name
    const byId = list.reduce((map, { id, categoryName }) => {
        map[id] = categoryName;
        return map;
    }, {});

    return (
        <CategoriesContext.Provider value={{ byId, list, loading }}>
            {children}
        </CategoriesContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoriesContext);
}
