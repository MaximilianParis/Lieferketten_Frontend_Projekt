import { useState } from 'react';
import ReactFlowGraph from './ReactFlowGraph'; 
import ProductManager from './ProductManager';
import Pickup_StationManager from './Pickup_StationManager'
import CustomerManager from './CustomerManager'
import Product_OrderManager from './Product_OrderManager'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
function Home() {
    return <h1>Home Page</h1>;
}
export default function App() {
    return (
        <BrowserRouter>
            {/* Navigation */}
            <nav>
                <Link to="/">Home</Link> |{" "}
                <Link to="/ProductManager">ProductManager</Link> |{" "}
                <Link to="/Pickup_StationManager">Pickup_StationManager</Link> |{" "}
                <Link to="/CustomerManager">CustomerManager</Link> |{" "}
                <Link to="/Product_OrderManager">Product_OrderManager</Link> |{" "}
                <Link to="/ReactFlowGraph">ReactFlowGraph</Link> |{" "}
                
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ProductManager" element={<ProductManager />} />
                <Route path="/Pickup_StationManager" element={<Pickup_StationManager />} />
                <Route path="/CustomerManager" element={<CustomerManager />} />
                <Route path="/Product_OrderManager" element={<Product_OrderManager />} />
                <Route path="/ReactFlowGraph" element={<ReactFlowGraph />} />
                
            </Routes>
        </BrowserRouter>
    );
}