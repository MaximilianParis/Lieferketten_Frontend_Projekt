import { useState, useEffect } from 'react';

export default function CustomerManager() {
    const [customers, set_customers] = useState([]);
    const [selected_customer_Id, set_selected_customer_Id] = useState('');
    const [selected_customer, set_selected_customer] = useState(null);
    const [pickup_stations, set_pickup_stations] = useState([]);
    const [selected_pickup_station_Id, set_selected_pickup_station_Id] = useState('');

    // Formular-Felder für neues Produkt
    const [newName, setNewName] = useState('');
  
    const API_URL = 'http://localhost:8080/customers';

    // 1. Alle Produkte für die Combobox laden
    const fetch_All_customers = () => {
        fetch(API_URL)
            .then((res) => {
                if (res.status === 204) return [];
                return res.json();
            })
            .then((data) => set_customers(data))
            .catch((err) => console.error('Fehler beim Laden:', err));
    };

    // 1. Alle Produkte für die Combobox laden
    const fetch_All_pickup_stations = () => {
        fetch('http://localhost:8080/pickup_stations')
            .then((res) => {
                if (res.status === 204) return [];
                return res.json();
            })
            .then((data) => set_pickup_stations(data))
            .catch((err) => console.error('Fehler beim Laden:', err));
    };

    useEffect(() => {
        fetch_All_customers();
    }, []);

    useEffect(() => {
        fetch_All_pickup_stations();
    }, []);

    // 2. Ein einzelnes Produkt anzeigen (Sucht in der geladenen Liste)
    const handle_Show_customer = () => {
        if (!selected_customer_Id) return;
        const found = customers.find(p => String(p.customer_number) === String(selected_customer_Id));
        set_selected_customer(found || null);
    };

    // 3. Neues Produkt erstellen (POST)
    const handle_Create_customer = (e) => {
        e.preventDefault();
        if (!newName) return alert('Bitte Name ausfüllen');
        if (!selected_pickup_station_Id) return alert('Bitte Kunden auswaehlen');

        
        const customer_Data = {
            name: newName,
            pickup_station_number: parseInt(selected_pickup_station_Id)
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer_Data)
        })
            .then((res) => {
                if (res.status === 201) {
                    alert('customer erfolgreich erstellt!');
                    setNewName('');
                   
                    fetch_All_customers(); // Liste aktualisieren
                }
            })
            .catch((err) => console.error('Fehler beim Erstellen:', err));
    };

    // 4. Produkt löschen (DELETE)
    const handle_Delete_customer = () => {
        if (!selected_customer_Id) return;

        fetch(`${API_URL}/${selected_customer_Id}`, {
            method: 'DELETE'
        })
            .then((res) => {
                if (res.status === 204) {
                    alert('customer gelöscht!');
                    set_selected_customer(null);
                    set_selected_customer_Id('');
                    fetch_All_customers(); // Liste aktualisieren
                } else {
                    alert('customer konnte nicht gefunden werden.');
                }
            })
            .catch((err) => console.error('Fehler beim Löschen:', err));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
            <h2>Kunden-Verwaltung</h2>

            {/* --- FORMULAR: Abholstation ERSTELLEN --- */}
            <fieldset style={{ marginBottom: '20px', padding: '15px' }}>
                <legend>Neuen Kunde erstellen</legend>
                <form onSubmit={handle_Create_customer}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Name: </label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />

                        <label>Abholstation-ID: </label>
                        <select
                            value={selected_pickup_station_Id}
                            onChange={(e) => set_selected_pickup_station_Id(e.target.value)}
                        >
                            <option value="">-- Bitte waehlen --</option>
                            {pickup_stations.map((p) => (
                                <option key={p.station_number} value={p.station_number}>
                                    ID: {p.station_number} ({p.name})
                                </option>
                            ))}
                        </select>
                    </div>
                  <button type="submit">Erstellen</button>
                </form>
            </fieldset>

            {/* --- AUSWAHL & AKTIONEN --- */}
            <fieldset style={{ padding: '15px' }}>
                <legend>Kunden auswaehlen & bearbeiten</legend>
                <div style={{ marginBottom: '15px' }}>
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
                                      

                    <button onClick={handle_Show_customer} style={{ marginLeft: '10px' }}>Anzeigen</button>
                    <button onClick={handle_Delete_customer} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>Loeschen</button>
                </div>

                {/* --- DETAILS ANZEIGEN --- */}
                {selected_customer && (
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
                                <td>{selected_customer.customer_number}</td>
                            </tr>
                            <tr>
                                <td><strong>Name</strong></td>
                                <td>{selected_customer.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Abholstation</strong></td>
                                <td>{selected_customer.pickup_station_number}</td>
                            </tr>
                            
                        </tbody>
                    </table>
                )}
            </fieldset>
        </div>
    );
}
