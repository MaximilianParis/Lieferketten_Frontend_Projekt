import { useState, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function App() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [optimal_edges, set_optimal_edges] = useState([]);
    const [all_edges, set_all_edges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [duration, set_duration] = useState(-1);

    useEffect(() => {
        // Hole die Daten von Spring Boot API
        fetch('http://localhost:8080/route')
            .then((response) => {
                if (response.status === 204) {
                    alert('Keine Daten vorhanden (No Content)');
                }
                return response.json();
            })
            .then((data) => {
                const uniqueStationIds = new Set();
                const newEdges = [];

                // 1. Kanten erstellen und alle Stations-IDs sammeln
               
                data.forEach((dto, index) => {
                   
                    uniqueStationIds.add(dto.stationA);
                    uniqueStationIds.add(dto.stationB);

                    newEdges.push({
                        id: `e-${dto.stationA}-${dto.stationB}-${index}`,
                        source: String(dto.stationA),
                        target: String(dto.stationB),
                        label: `${dto.distance} Min`, // Nutzt das Feld 'distance' aus dem Record
                    });
                });

                // 2. Stationen kreisförmig auf dem Bildschirm anordnen
                const stationArray = Array.from(uniqueStationIds);
                const radius = 220; // Größe des Kreises
                const centerX = 300;
                const centerY = 300;

                const newNodes = stationArray.map((stationId, index) => {
                    const angle = (index / stationArray.length) * 2 * Math.PI;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);

                    return {
                        id: String(stationId),
                        position: { x, y },
                        data: { label: `Station ${stationId}` },
                        // CSS-Styling für runde Kreise
                        style: {
                            borderRadius: '50%',
                            width: 70,
                            height: 70,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff',
                            border: '2px solid #333333',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            fontWeight: 'bold'
                        }
                    };
                });

                setNodes(newNodes);
                setEdges(newEdges);
                set_all_edges(newEdges);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Fehler beim Laden des Graphen:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Hole die Daten von Spring Boot API
        fetch('http://localhost:8080/route/calculate')
            .then((response) => {
                if (response.status === 204) {
                    alert('Keine Daten vorhanden (No Content)');
                }
                return response.json();
            })
            .then((data) => {
                
                const newEdges = [];
                            
                data.Optimal_Edges.forEach((dto, index) => {
                                     
                    newEdges.push({
                        id: `e-${dto.stationA}-${dto.stationB}-${index}`,
                        source: String(dto.stationA),
                        target: String(dto.stationB),
                        label: `${dto.distance} Min`, // Nutzt das Feld 'distance' aus dem Record
                    });
                });
                            
                                
                set_optimal_edges(newEdges);
                set_duration(data.duration)
                setLoading(false);
            })
            .catch((error) => {
                console.error('Fehler beim Laden des Graphen:', error);
                setLoading(false);
            });
    }, []);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );



   

    if (loading) {
        return <div style={{ padding: 20, fontFamily: 'sans-serif' }}>Lade Graphen aus dem Spring Boot Backend...</div>;
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <button onClick={() => setEdges(optimal_edges)} style={{ marginLeft: '10px' }}>Optimale Route anzeigen</button>
            <button onClick={() => setEdges(all_edges)} style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}>Reset</button>
            <p>Dauer der Auslieferung {duration}</p>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            />
           
        </div>
    );
}
