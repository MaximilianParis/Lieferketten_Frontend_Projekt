import { useState, useEffect } from 'react';

export default function Pickup_StationManager() {
    const [pickup_stations, set_pickup_stations] = useState([]);
    const [selected_pickup_station_Id, set_selected_pickup_station_Id] = useState('');
    const [selected_pickup_station, set_selected_pickup_station] = useState(null);

    // Formular-Felder für neues Produkt
    const [newName, setNewName] = useState('');
  
    const API_URL = 'http://localhost:8080/pickup_stations';

    // 1. Alle Produkte für die Combobox laden
    const fetch_All_Pickup_Stations = () => {
        fetch(API_URL)
            .then((res) => {
                if (res.status === 204) return [];
                return res.json();
            })
            .then((data) => set_pickup_stations(data))
            .catch((err) => console.error('Fehler beim Laden:', err));
    };

    useEffect(() => {
        fetch_All_Pickup_Stations();
    }, []);

    // 2. Ein einzelnes Produkt anzeigen (Sucht in der geladenen Liste)
    const handle_Show_Pickup_Station = () => {
        if (!selected_pickup_station_Id) return;
        const found = pickup_stations.find(p => String(p.station_number) === String(selected_pickup_station_Id));
        set_selected_pickup_station(found || null);
    };

    // 3. Neues Produkt erstellen (POST)
    const handle_Create_Pickup_Station = (e) => {
        e.preventDefault();
        if (!newName) return alert('Bitte Name ausfüllen');

     
        const pickup_station_Data = {
            name: newName,
            
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pickup_station_Data)
        })
            .then((res) => {
                if (res.status === 201) {
                    alert('Pickup_Station erfolgreich erstellt!');
                    setNewName('');
                   
                    fetch_All_Pickup_Stations(); // Liste aktualisieren
                }
            })
            .catch((err) => console.error('Fehler beim Erstellen:', err));
    };

    // 4. Produkt löschen (DELETE)
    const handle_Delete_Pickup_Station = () => {
        if (!selected_pickup_station_Id) return;

        fetch(`${API_URL}/${selected_pickup_station_Id}`, {
            method: 'DELETE'
        })
            .then((res) => {
                if (res.status === 204) {
                    alert('pickup_station gelöscht!');
                    set_selected_pickup_station(null);
                    set_selected_pickup_station_Id('');
                    fetch_All_Pickup_Stations(); // Liste aktualisieren
                } else {
                    alert('pickup_station konnte nicht gefunden werden.');
                }
            })
            .catch((err) => console.error('Fehler beim Löschen:', err));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
            <h2>Abholstation-Verwaltung</h2>

            {/* --- FORMULAR: Abholstation ERSTELLEN --- */}
            <fieldset style={{ marginBottom: '20px', padding: '15px' }}>
                <legend>Neue Abholstation erstellen</legend>
                <form onSubmit={handle_Create_Pickup_Station}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Name: </label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                  <button type="submit">Erstellen</button>
                </form>
            </fieldset>

            {/* --- AUSWAHL & AKTIONEN --- */}
            <fieldset style={{ padding: '15px' }}>
                <legend>Abholstation auswaehlen & bearbeiten</legend>
                <div style={{ marginBottom: '15px' }}>
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

                    <button onClick={handle_Show_Pickup_Station} style={{ marginLeft: '10px' }}>Anzeigen</button>
                    <button onClick={handle_Delete_Pickup_Station} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>Loeschen</button>
                </div>

                {/* --- DETAILS ANZEIGEN --- */}
                {selected_pickup_station && (
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
                                <td>{selected_pickup_station.station_number}</td>
                            </tr>
                            <tr>
                                <td><strong>Name</strong></td>
                                <td>{selected_pickup_station.name}</td>
                            </tr>
                            
                        </tbody>
                    </table>
                )}
            </fieldset>
        </div>
    );
}
