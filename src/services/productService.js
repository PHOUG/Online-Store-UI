const API_URL = 'http://localhost:8080/products'; // замени порт, если у тебя другой

export async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/search/all`);
        if (!response.ok) {
            throw new Error('Ошибка при получении списка товаров');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
        return [];
    }
}