
import { useEffect, useState } from "react";
import API from "../services/api";

function Inventory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/products");
            setProducts(response.data);
        } catch (err) {
            console.error("Failed to load inventory:", err);
            setError("Unable to load inventory. Please check your backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const query = search.toLowerCase();

        return (
            String(product.id).includes(query) ||
            (product.name || "").toLowerCase().includes(query) ||
            (product.category || "").toLowerCase().includes(query)
        );
    });

    const totalUnits = products.reduce(
        (total, product) => total + Number(product.stockQuantity ?? 0),
        0
    );

    const lowStockCount = products.filter(
        (product) =>
            Number(product.stockQuantity) > 0 &&
            Number(product.stockQuantity) <= 10
    ).length;

    const outOfStockCount = products.filter(
        (product) => Number(product.stockQuantity) === 0
    ).length;

    const formatPrice = (price) =>
        Number(price ?? 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const getStockStatus = (quantity) => {
        const stock = Number(quantity ?? 0);

        if (stock === 0) {
            return { label: "OUT OF STOCK", className: "status-danger" };
        }

        if (stock <= 10) {
            return { label: "LOW STOCK", className: "status-warning" };
        }

        return { label: "IN STOCK", className: "status-success" };
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <p className="eyebrow">INVENTORY MANAGEMENT</p>
                    <h1>Inventory</h1>
                    <p className="page-description">
                        Monitor product availability, stock levels and pricing.
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={fetchProducts}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "↻ Refresh"}
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <p>Total products</p>
                    <h2>{products.length}</h2>
                </div>

                <div className="stat-card">
                    <p>Total units in stock</p>
                    <h2>{totalUnits.toLocaleString("en-IN")}</h2>
                </div>

                <div className="stat-card">
                    <p>Low-stock products</p>
                    <h2>{lowStockCount}</h2>
                </div>

                <div className="stat-card">
                    <p>Out of stock</p>
                    <h2>{outOfStockCount}</h2>
                </div>
            </div>

            <section className="content-card">
                <div className="section-heading">
                    <div>
                        <h2>Inventory catalogue</h2>
                        <p>{filteredProducts.length} product(s) shown</p>
                    </div>

                    <input
                        type="search"
                        className="search-input"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p className="state-message">Loading inventory...</p>
                ) : error ? (
                    <div className="state-message error-message">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={fetchProducts}
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <p className="state-message">
                        {products.length === 0
                            ? "No products found in your inventory."
                            : "No products match your search."}
                    </p>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>PRODUCT ID</th>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((product) => {
                                    const status = getStockStatus(
                                        product.stockQuantity
                                    );

                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <strong>#{product.id}</strong>
                                            </td>

                                            <td>
                                                <strong>
                                                    {product.name || "Unnamed product"}
                                                </strong>
                                            </td>

                                            <td>
                                                {product.category || "Uncategorised"}
                                            </td>

                                            <td>
                                                <strong>
                                                    ₹{formatPrice(product.price)}
                                                </strong>
                                            </td>

                                            <td>
                                                <strong>
                                                    {product.stockQuantity ?? 0}
                                                </strong>
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Inventory;
