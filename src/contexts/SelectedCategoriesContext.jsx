import React, { createContext, useContext, useState } from 'react';

const SelectedCategoriesContext = createContext({
    selected: [],
    setSelected: () => {}
});

export function SelectedCategoriesProvider({ children }) {
    const [selected, setSelected] = useState([]);
    return (
        <SelectedCategoriesContext.Provider value={{ selected, setSelected }}>
            {children}
        </SelectedCategoriesContext.Provider>
    );
}

export function useSelectedCategories() {
    return useContext(SelectedCategoriesContext);
}
