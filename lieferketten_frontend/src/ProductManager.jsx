import { useState, useEffect } from 'react';

export default function ProductManager() {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);


    // Formular-Felder für neues Produkt
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');

    const API_URL = 'http://localhost:8080/products';

    // 1. Alle Produkte für die Combobox laden
    const fetchAllProducts = () => {
        fetch(API_URL)
            .then((res) => {
                if (res.status === 204) return [];
                return res.json();
            })
            .then((data) => setProducts(data))
            .catch((err) => console.error('Fehler beim Laden:', err));
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    // 2. Ein einzelnes Produkt anzeigen (Sucht in der geladenen Liste)
    const handleShowProduct = () => {
        if (!selectedProductId) return;
        const found = products.find(p => String(p.id) === String(selectedProductId));
        setSelectedProduct(found || null);
    };

    // 3. Neues Produkt erstellen (POST)
    const handleCreateProduct = (e) => {
        e.preventDefault();
        if (!newName || !newPrice) return alert('Bitte Name und Preis ausfüllen');

        
        const productData = {
            product_name: newName,
            price: parseFloat(newPrice)
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        })
            .then((res) => {
                if (res.status === 201) {
                    alert('Produkt erfolgreich erstellt!');
                    setNewName('');
                    setNewPrice('');
                    fetchAllProducts(); // Liste aktualisieren
                }
            })
            .catch((err) => console.error('Fehler beim Erstellen:', err));
    };

    // 4. Produkt löschen (DELETE)
    const handleDeleteProduct = () => {
        if (!selectedProductId) return;

        fetch(`${API_URL}/${selectedProductId}`, {
            method: 'DELETE'
        })
            .then((res) => {
                if (res.status === 204) {
                    alert('Produkt gelöscht!');
                    setSelectedProduct(null);
                    setSelectedProductId('');
                    fetchAllProducts(); // Liste aktualisieren
                } else {
                    alert('Produkt konnte nicht gefunden werden.');
                }
            })
            .catch((err) => console.error('Fehler beim Löschen:', err));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
            <h2>Produkt-Verwaltung</h2>

            {/* --- FORMULAR: PRODUKT ERSTELLEN --- */}
            <fieldset style={{ marginBottom: '20px', padding: '15px' }}>
                <legend>Neues Produkt erstellen</legend>
                <form onSubmit={handleCreateProduct}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Name: </label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Preis: </label>
                        <input
                            type="number"
                            step="0.01"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                        />
                    </div>
                    <button type="submit">Erstellen</button>
                </form>
            </fieldset>

            {/* --- AUSWAHL & AKTIONEN --- */}
            <fieldset style={{ padding: '15px' }}>
                <legend>Produkt auswaehlen & bearbeiten</legend>
                <div style={{ marginBottom: '15px' }}>
                    <label>Produkt-ID: </label>
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                        <option value="">-- Bitte waehlen --</option>
                        {products.map((p) => (
                            <option key={p.product_number} value={p.product_number}>
                                ID: {p.product_number} ({p.product_name})
                            </option>
                        ))}
                    </select>

                    <button onClick={handleShowProduct} style={{ marginLeft: '10px' }}>Anzeigen</button>
                    <button onClick={handleDeleteProduct} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>Loeschen</button>
                </div>

                {/* --- DETAILS ANZEIGEN --- */}
                {selectedProduct && (
                    <table border="1" cellPadding="5" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Eigenschaft</th>
                                <th>Wert</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>ID</strong></td>
                                <td>{selectedProduct.product_number}</td>
                            </tr>
                            <tr>
                                <td><strong>Name</strong></td>
                                <td>{selectedProduct.product_name}</td>
                            </tr>
                            <tr>
                                <td><strong>Preis</strong></td>
                                <td>{selectedProduct.price} €</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </fieldset>
        </div>
    );
}
