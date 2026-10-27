
import { useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [category, setCategory] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setError("");
            const response = await API.get("/products");
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setError("Could not load products. Check that the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setPrice("");
        setStockQuantity("");
        setCategory("");
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const productData = {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            stockQuantity: Number(stockQuantity),
            category: category.trim()
        };

        try {
            if (editingId === null) {
                await API.post("/products", productData);
            } else {
                await API.put(`/products/${editingId}`, productData);
            }

            clearForm();
            await fetchProducts();
        } catch (err) {
            console.error(err);
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response?.data?.message ||
                    "Could not save the product. Check the entered values and backend response."
            );
        } finally {
            setSaving(false);
        }
    };

    const editProduct = (product) => {
        setEditingId(product.id);
        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(String(product.price ?? ""));
        setStockQuantity(String(product.stockQuantity ?? ""));
        setCategory(product.category || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteProduct = async (product) => {
        const confirmed = window.confirm(
            `Delete "${product.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setError("");
            await API.delete(`/products/${product.id}`);
            await fetchProducts();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Could not delete this product. It may be linked to an existing order."
            );
        }
    };

    const filteredProducts = products.filter((product) => {
        const query = search.toLowerCase();

        return (
            String(product.name || "").toLowerCase().includes(query) ||
            String(product.category || "").toLowerCase().includes(query) ||
            String(product.description || "").toLowerCase().includes(query)
        );
    });

    const totalUnits = products.reduce(
        (total, product) => total + Number(product.stockQuantity || 0),
        0
    );

    const lowStock = products.filter(
        (product) => Number(product.stockQuantity) > 0 &&
            Number(product.stockQuantity) <= 10
    ).length;

    const outOfStock = products.filter(
        (product) => Number(product.stockQuantity) <= 0
    ).length;

    return (
        <main className="management-page">
            <section className="management-heading">
                <div>
                    <p className="eyebrow">CATALOGUE MANAGEMENT</p>
                    <h1>Products</h1>
                    <p className="management-subtitle">
                        Manage your product catalogue, prices and available stock.
                    </p>
                </div>

                <button
                    className="primary-button"
                    type="button"
                    onClick={() => {
                        clearForm();
                        document.getElementById("product-form")?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }}
                >
                    + Add product
                </button>
            </section>

            {error && (
                <div className="management-error" role="alert">
                    {error}
                </div>
            )}

            <section className="management-stats">
                <article className="management-stat">
                    <span>Total products</span>
                    <strong>{products.length}</strong>
                </article>
                <article className="management-stat">
                    <span>Total units in stock</span>
                    <strong>{totalUnits}</strong>
                </article>
                <article className="management-stat">
                    <span>Low-stock products</span>
                    <strong>{lowStock}</strong>
                </article>
                <article className="management-stat">
                    <span>Out of stock</span>
                    <strong>{outOfStock}</strong>
                </article>
            </section>

            <section className="product-form-card" id="product-form">
                <div className="section-heading">
                    <div>
                        <h2>{editingId === null ? "Add a product" : "Edit product"}</h2>
                        <p>Enter the product details below.</p>
                    </div>

                    {editingId !== null && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={clearForm}
                        >
                            Cancel edit
                        </button>
                    )}
                </div>

                <form onSubmit={saveProduct} className="product-form">
                    <label>
                        Product name *
                        <input
                            required
                            maxLength={100}
                            placeholder="e.g. Running Shoes"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <label>
                        Category *
                        <input
                            required
                            maxLength={60}
                            placeholder="e.g. Footwear"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </label>

                    <label>
                        Price (₹) *
                        <input
                            required
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="2499.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </label>

                    <label>
                        Stock quantity *
                        <input
                            required
                            type="number"
                            min="0"
                            step="1"
                            placeholder="50"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                        />
                    </label>

                    <label className="product-description-field">
                        Description
                        <textarea
                            rows="3"
                            maxLength={500}
                            placeholder="Describe this product..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>

                    <div className="product-form-actions">
                        <button className="primary-button" type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId === null
                                    ? "Save product"
                                    : "Update product"}
                        </button>

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={clearForm}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </section>

            <section className="product-table-card">
                <div className="section-heading product-list-heading">
                    <div>
                        <h2>Product catalogue</h2>
                        <p>{filteredProducts.length} product(s) shown</p>
                    </div>

                    <input
                        className="product-search"
                        type="search"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="table-scroll">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Inventory status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="table-message">
                                        Loading products...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="table-message">
                                        {search
                                            ? "No products match your search."
                                            : "No products yet. Add your first product above."}
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const quantity = Number(product.stockQuantity || 0);
                                    const status =
                                        quantity <= 0
                                            ? "Out of stock"
                                            : quantity <= 10
                                                ? "Low stock"
                                                : "In stock";

                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="product-name-cell">
                                                    <span className="product-avatar">
                                                        {String(product.name || "P")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                    <div>
                                                        <strong>{product.name}</strong>
                                                        <small>
                                                            {product.description || "No description"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{product.category || "—"}</td>
                                            <td className="price-cell">
                                                {Number(product.price || 0).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        style: "currency",
                                                        currency: "INR"
                                                    }
                                                )}
                                            </td>
                                            <td>{quantity}</td>
                                            <td>
                                                <span
                                                    className={`stock-badge ${quantity <= 0
                                                            ? "stock-out"
                                                            : quantity <= 10
                                                                ? "stock-low"
                                                                : "stock-good"
                                                        }`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="edit-button"
                                                        type="button"
                                                        onClick={() => editProduct(product)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        type="button"
                                                        onClick={() => deleteProduct(product)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default Products;
