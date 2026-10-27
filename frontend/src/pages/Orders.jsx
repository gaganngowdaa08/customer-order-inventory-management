
import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [customerId, setCustomerId] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("1");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await API.get("/orders");
            setOrders(response.data);
        } catch (err) {
            console.error("Failed to load orders:", err);
            setError("Unable to load orders. Please check your backend.");
        } finally {
            setLoading(false);
        }
    };

    const fetchFormData = async () => {
        try {
            const [customerResponse, productResponse] = await Promise.all([
                API.get("/customers"),
                API.get("/products"),
            ]);

            setCustomers(customerResponse.data);
            setProducts(productResponse.data);
        } catch (err) {
            console.error("Failed to load customers/products:", err);
            setFormError(
                "Could not load customers or products. Please check your backend."
            );
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchFormData();
    }, []);

    const selectedProduct = products.find(
        (product) => String(product.id) === String(productId)
    );

    const availableStock = Number(selectedProduct?.stockQuantity ?? 0);
    const numericQuantity = Number(quantity);
    const estimatedTotal =
        Number(selectedProduct?.price ?? 0) * numericQuantity;

    const formatAmount = (amount) =>
        Number(amount ?? 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return date;

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const totalRevenue = orders.reduce(
        (total, order) => total + Number(order.totalAmount ?? 0),
        0
    );

    const placeOrder = async (event) => {
        event.preventDefault();
        setFormError("");
        setSuccess("");

        if (!customerId) {
            setFormError("Please select a customer.");
            return;
        }

        if (!productId) {
            setFormError("Please select a product.");
            return;
        }

        if (!Number.isInteger(numericQuantity) || numericQuantity < 1) {
            setFormError("Quantity must be a whole number of at least 1.");
            return;
        }

        if (numericQuantity > availableStock) {
            setFormError(
                `Only ${availableStock} unit(s) are currently available.`
            );
            return;
        }

        try {
            setSubmitting(true);

            await API.post("/orders", {
                customerId: Number(customerId),
                items: [
                    {
                        productId: Number(productId),
                        quantity: numericQuantity,
                    },
                ],
            });

            setSuccess("Order placed successfully!");
            setCustomerId("");
            setProductId("");
            setQuantity("1");

            await Promise.all([fetchOrders(), fetchFormData()]);
        } catch (err) {
            console.error("Failed to place order:", err);

            const responseMessage = err.response?.data?.message;
            setFormError(
                responseMessage ||
                "Unable to place order. Check product stock and backend validation."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <p className="eyebrow">ORDER MANAGEMENT</p>
                    <h1>Orders</h1>
                    <p className="page-description">
                        Create customer orders and track transactions.
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                        fetchOrders();
                        fetchFormData();
                    }}
                    disabled={loading || submitting}
                >
                    {loading ? "Loading..." : "↻ Refresh"}
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <p>Total orders</p>
                    <h2>{orders.length}</h2>
                </div>
                <div className="stat-card">
                    <p>Total order value</p>
                    <h2>₹{formatAmount(totalRevenue)}</h2>
                </div>
                <div className="stat-card">
                    <p>Placed orders</p>
                    <h2>
                        {orders.filter(
                            (order) =>
                                String(order.status).toUpperCase() === "PLACED"
                        ).length}
                    </h2>
                </div>
                <div className="stat-card">
                    <p>Other statuses</p>
                    <h2>
                        {orders.filter(
                            (order) =>
                                String(order.status).toUpperCase() !== "PLACED"
                        ).length}
                    </h2>
                </div>
            </div>

            <section className="content-card">
                <div className="section-heading">
                    <div>
                        <h2>Create a customer order</h2>
                        <p>Select a customer, product and quantity.</p>
                    </div>
                </div>

                {formError && (
                    <div className="error-message" role="alert">
                        {formError}
                    </div>
                )}

                {success && (
                    <p
                        role="status"
                        style={{
                            padding: "12px 16px",
                            borderRadius: 10,
                            color: "#047857",
                            background: "#d1fae5",
                        }}
                    >
                        {success}
                    </p>
                )}

                <form onSubmit={placeOrder} className="product-form">
                    <label>
                        Customer *
                        <select
                            className="search-input"
                            value={customerId}
                            onChange={(event) => setCustomerId(event.target.value)}
                            required
                        >
                            <option value="">Select a customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Product *
                        <select
                            className="search-input"
                            value={productId}
                            onChange={(event) => setProductId(event.target.value)}
                            required
                        >
                            <option value="">Select a product</option>
                            {products.map((product) => (
                                <option
                                    key={product.id}
                                    value={product.id}
                                    disabled={Number(product.stockQuantity) < 1}
                                >
                                    {product.name} — ₹{formatAmount(product.price)}
                                    {" "}({product.stockQuantity} available)
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Quantity *
                        <input
                            className="search-input"
                            type="number"
                            min="1"
                            max={selectedProduct ? availableStock : undefined}
                            step="1"
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)}
                            required
                        />
                    </label>

                    <div>
                        <p style={{ marginBottom: 8, color: "#64748b" }}>
                            Estimated total
                        </p>
                        <h2 style={{ margin: 0, color: "#172554" }}>
                            ₹{formatAmount(
                                Number.isFinite(estimatedTotal) ? estimatedTotal : 0
                            )}
                        </h2>
                    </div>

                    <div className="product-form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                            disabled={submitting || customers.length === 0 || products.length === 0}
                        >
                            {submitting ? "Placing order..." : "Place Order"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="content-card">
                <div className="section-heading">
                    <div>
                        <h2>Order directory</h2>
                        <p>{orders.length} order(s) found</p>
                    </div>
                </div>

                {loading ? (
                    <p className="state-message">Loading orders...</p>
                ) : error ? (
                    <div className="state-message error-message">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={fetchOrders}
                        >
                            Try again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <p className="state-message">No orders found yet.</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ORDER ID</th>
                                    <th>CUSTOMER</th>
                                    <th>DATE</th>
                                    <th>TOTAL AMOUNT</th>
                                    <th>STATUS</th>
                                    <th>ITEMS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong>#{order.id}</strong></td>
                                        <td>
                                            <strong>
                                                {order.customer?.name || "Unknown customer"}
                                            </strong>
                                        </td>
                                        <td>{formatDate(order.orderDate)}</td>
                                        <td>
                                            <strong>
                                                ₹{formatAmount(order.totalAmount)}
                                            </strong>
                                        </td>
                                        <td>
                                            <span
                                                className={`status-badge ${String(order.status).toUpperCase() === "PLACED"
                                                        ? "status-success"
                                                        : "status-neutral"
                                                    }`}
                                            >
                                                {order.status || "UNKNOWN"}
                                            </span>
                                        </td>
                                        <td>
                                            {order.items?.length
                                                ? order.items.map((item, index) => (
                                                    <div
                                                        key={item.id ?? `${order.id}-${index}`}
                                                        className="order-item"
                                                    >
                                                        <span>
                                                            {item.product?.name || "Unknown product"}
                                                        </span>
                                                        <span className="item-quantity">
                                                            × {item.quantity}
                                                        </span>
                                                    </div>
                                                ))
                                                : "No items"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Orders;
