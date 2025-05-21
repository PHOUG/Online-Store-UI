export default function Header() {
    return (
        <header style={{
            padding: 1,
            paddingLeft: 30,
            margin: 0,      /* убираем внешний отступ браузера */
            backgroundColor: '#e83100',
            color: '#e9e9e9',
            fontFamily: 'Bahnschrift', // шрифт
            fontSize: '20px'
        }}>
            <h1>   PHOUG</h1>
        </header>
    );
}
