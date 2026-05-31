import { useState, useEffect } from 'react';

export default function Product_OrderManager() {
    const [product_orders, set_product_orders] = useState([]);
    const [selected_product_order_Id, set_selected_product_order_Id] = useState('');
    const [selected_product_order, set_selected_product_order] = useState(null);

    const [customers, set_customers] = useState([]);
    const [selected_customer_Id, set_selected_customer_Id] = useState('');

    const [products, set_products] = useState([]);
    const [selected_product_Id, set_selected_product_Id] = useState('');
  
    const API_URL = 'http://localhost:8080/product_orders';

    // 1. Alle Produkte für die Combobox laden
    const fetch_All_product_orders = () => {
        fetch(API_URL)
            .then((res) => {
                if (res.status === 204) return [];
                return res.json();
            })
            .then((data) => set_product_orders(data))
            .catch((err) => console.error('Fehler beim Laden:', err));
    };

    // 1. Alle Produkte für die Combobox laden
    const fetch_All_products = () => {
        fetch('http://localhost:8080/products')
            .then((res) => {
                if (res.status === 204) return [];
                return res.json();
            })
            .then((data) => set_products(data))
            .catch((err) => console.error('Fehler beim Laden:', err));
    };

    // 1. Alle Produkte für die Combobox laden
    const fetch_All_customers = () => {
        fetch('http://localhost:8080/customers')
            .then((res) => {
                if (res.status === 204) return [];
                return res.json();
            })
            .then((data) => set_customers(data))
            .catch((err) => console.error('Fehler beim Laden:', err));
    };

    useEffect(() => {
        fetch_All_product_orders();
    }, []);

    useEffect(() => {
        fetch_All_products();
    }, []);

    useEffect(() => {
        fetch_All_customers();
    }, []);

    // 2. Ein einzelnes Produkt anzeigen (Sucht in der geladenen Liste)
    const handle_Show_product_order = () => {
        if (!selected_product_order_Id) return;
        const found = product_orders.find(p => String(p.order_number) === String(selected_product_order_Id));
        set_selected_product_order(found || null);
    };

    // 3. Neues Produkt erstellen (POST)
    const handle_Create_product_order = (e) => {
        e.preventDefault();
        if (!selected_product_Id) return alert('Bitte Produkt auswaehlen');
        if (!selected_customer_Id) return alert('Bitte Kunden auswaehlen');

        
        const product_order_Data = {
            client_number: parseInt(selected_customer_Id),
            ordered_product_number: parseInt(selected_product_Id)
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product_order_Data)
        })
            .then((res) => {
                if (res.status === 201) {
                    alert('product_order erfolgreich erstellt!');
                                       
                    fetch_All_product_orders(); // Liste aktualisieren
                }
            })
            .catch((err) => console.error('Fehler beim Erstellen:', err));
    };

    // 4. Produkt löschen (DELETE)
    const handle_Delete_product_order = () => {
        if (!selected_product_order_Id) return;

        fetch(`${API_URL}/${selected_product_order_Id}`, {
            method: 'DELETE'
        })
            .then((res) => {
                if (res.status === 204) {
                    alert('product_order gelöscht!');
                    set_selected_product_order(null);
                    set_selected_product_order_Id('');
                    fetch_All_product_orders(); // Liste aktualisieren
                } else {
                    alert('Auftrag konnte nicht gefunden werden.');
                }
            })
            .catch((err) => console.error('Fehler beim Löschen:', err));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
            <h2>Auftag-Verwaltung</h2>

            {/* --- FORMULAR: Abholstation ERSTELLEN --- */}
            <fieldset style={{ marginBottom: '20px', padding: '15px' }}>
                <legend>Neuen Auftrag erstellen</legend>
                <form onSubmit={handle_Create_product_order}>
                    <label>Produkt-ID: </label>
                    <select
                        value={selected_product_Id}
                        onChange={(e) => set_selected_product_Id(e.target.value)}
                    >
                        <option value="">-- Bitte waehlen --</option>
                        {products.map((p) => (
                            <option key={p.product_number} value={p.product_number}>
                                ID: {p.product_number} ({p.product_name})
                            </option>
                        ))}
                    </select>

                    <label>Kunden-ID: </label>
                    <select
                        value={selected_customer_Id}
                        onChange={(e) => set_selected_customer_Id(e.target.value)}
                    >
                        <option value="">-- Bitte waehlen --</option>
                        {customers.map((p) => (
                            <option key={p.customer_number} value={p.customer_number}>
                                ID: {p.customer_number} ({p.name})
                            </option>
                        ))}
                    </select>

                  <button type="submit">Erstellen</button>
                </form>
            </fieldset>

            {/* --- AUSWAHL & AKTIONEN --- */}
            <fieldset style={{ padding: '15px' }}>
                <legend>Auftrag auswaehlen & bearbeiten</legend>
                <div style={{ marginBottom: '15px' }}>
                    <label>Auftrag-ID: </label>
                    <select
                        value={selected_product_order_Id}
                        onChange={(e) => set_selected_product_order_Id(e.target.value)}
                    >
                        <option value="">-- Bitte waehlen --</option>
                        {product_orders.map((p) => (
                            <option key={p.order_number} value={p.order_number}>
                                ID: {p.order_number} 
                            </option>
                        ))}
                    </select>
                                       

                    <button onClick={handle_Show_product_order} style={{ marginLeft: '10px' }}>Anzeigen</button>
                    <button onClick={handle_Delete_product_order} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>Loeschen</button>
                </div>

                {/* --- DETAILS ANZEIGEN --- */}
                {selected_product_order && (
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
                                <td>{selected_product_order.order_number}</td>
                            </tr>
                            <tr>
                                <td><strong>Auftraggeber</strong></td>
                                <td>{selected_product_order.client_number}</td>
                            </tr>
                            <tr>
                                <td><strong>Bestelltes Produkt</strong></td>
                                <td>{selected_product_order.ordered_product_number}</td>
                            </tr>
                            
                        </tbody>
                    </table>
                )}
            </fieldset>
        </div>
    );
}
