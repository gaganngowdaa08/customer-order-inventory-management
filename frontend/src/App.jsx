import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Dashboard />} />

                <Route path="/customers" element={<Customers />} />

                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/inventory" element={<Inventory />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;