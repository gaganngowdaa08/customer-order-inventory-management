
import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await API.get("/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const saveCustomer = async (e) => {
        e.preventDefault();

        try {
            const customerData = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim()
            };

            if (editingId === null) {
                await API.post("/customers", customerData);
            } else {
                await API.put(`/customers/${editingId}`, customerData);
            }

            clearForm();
            await fetchCustomers();
        } catch (error) {
            console.error(error);
            alert(JSON.stringify(error.response?.data || error.message));
        }
    };

    const editCustomer = (customer) => {
        setEditingId(customer.id);
        setName(customer.name || "");
        setEmail(customer.email || "");
        setPhone(customer.phone || "");
        setAddress(customer.address || "");
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        try {
            await API.delete(`/customers/${id}`);
            await fetchCustomers();
        } catch (error) {
            console.error(error);
            alert("Failed to delete customer. This customer may have existing orders.");
        }
    };

    const clearForm = () => {
        setEditingId(null);
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setShowForm(false);
    };

    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return customers;

        return customers.filter((customer) =>
            [
                customer.name,
                customer.email,
                customer.phone,
                customer.address
            ].some((value) => String(value || "").toLowerCase().includes(query))
        );
    }, [customers, search]);

    const styles = {
        page: {
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "42px 32px 64px",
            color: "#172554"
        },
        muted: { color: "#7183a3" },
        card: {
            background: "#ffffff",
            borderRadius: "20px",
            padding: "26px",
            boxShadow: "0 8px 28px rgba(15, 23, 42, 0.06)"
        },
        input: {
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 15px",
            border: "1px solid #dbe4f0",
            borderRadius: "11px",
            fontSize: "14px",
            color: "#172554",
            background: "#fff",
            outlineColor: "#3164f4"
        },
        label: {
            display: "block",
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: "9px",
            color: "#24365b"
        },
        primary: {
            border: "none",
            borderRadius: "10px",
            padding: "13px 19px",
            background: "#2864f0",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer"
        },
        secondary: {
            border: "1px solid #dce5f1",
            borderRadius: "10px",
            padding: "12px 17px",
            background: "#f4f7fb",
            color: "#334765",
            fontWeight: 700,
            cursor: "pointer"
        },
        tableCell: {
            textAlign: "left",
            padding: "17px 14px",
            borderBottom: "1px solid #edf1f7",
            fontSize: "14px",
            verticalAlign: "middle"
        }
    };

    const stats = [
        { label: "Total customers", value: customers.length, icon: "♙", color: "#eaf2ff" },
        { label: "With email", value: customers.filter(c => c.email).length, icon: "✉", color: "#f2edff" },
        { label: "With phone", value: customers.filter(c => c.phone).length, icon: "☎", color: "#e7fbf2" },
        { label: "Search results", value: filteredCustomers.length, icon: "⌕", color: "#fff3e7" }
    ];

    return (
        <main style={styles.page}>
            <section style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: "30px"
            }}>
                <div>
                    <p style={{
                        color: "#7189ad",
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "2px",
                        margin: "0 0 10px"
                    }}>
                        CUSTOMER RELATIONSHIP MANAGEMENT
                    </p>
                    <h1 style={{
                        fontSize: "clamp(30px, 4vw, 42px)",
                        margin: "0 0 8px",
                        letterSpacing: "-1.5px",
                        color: "#f5f7ff"
                    }}>
                        Customers
                    </h1>
                    <p style={{ ...styles.muted, margin: 0 }}>
                        Manage customer profiles and contact information.
                    </p>
                </div>

                <button
                    style={styles.primary}
                    onClick={() => {
                        if (showForm && editingId === null) {
                            clearForm();
                        } else {
                            setEditingId(null);
                            setName("");
                            setEmail("");
                            setPhone("");
                            setAddress("");
                            setShowForm(true);
                        }
                    }}
                >
                    + Add customer
                </button>
            </section>

            <section style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginBottom: "26px"
            }}>
                {stats.map((stat) => (
                    <div key={stat.label} style={{
                        ...styles.card,
                        padding: "22px",
                        border: "1px solid #edf1f7"
                    }}>
                        <div style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "13px",
                            background: stat.color,
                            display: "grid",
                            placeItems: "center",
                            fontSize: "21px",
                            marginBottom: "18px"
                        }}>
                            {stat.icon}
                        </div>
                        <p style={{ ...styles.muted, fontSize: "13px", margin: "0 0 8px" }}>
                            {stat.label}
                        </p>
                        <strong style={{ fontSize: "29px", color: "#172554" }}>
                            {stat.value}
                        </strong>
                    </div>
                ))}
            </section>

            {showForm && (
                <section style={{ ...styles.card, marginBottom: "26px" }}>
                    <h2 style={{ margin: "0 0 8px", fontSize: "22px" }}>
                        {editingId === null ? "Add a customer" : "Edit customer"}
                    </h2>
                    <p style={{ ...styles.muted, margin: "0 0 24px", fontSize: "14px" }}>
                        Enter the customer's contact details below.
                    </p>

                    <form onSubmit={saveCustomer}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                            gap: "20px"
                        }}>
                            <div>
                                <label style={styles.label}>Full name *</label>
                                <input
                                    style={styles.input}
                                    placeholder="e.g. Rahul Sharma"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label style={styles.label}>Email address *</label>
                                <input
                                    style={styles.input}
                                    type="email"
                                    placeholder="e.g. rahul@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label style={styles.label}>Phone</label>
                                <input
                                    style={styles.input}
                                    type="tel"
                                    placeholder="Phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>Address</label>
                                <input
                                    style={styles.input}
                                    placeholder="City, state"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                            marginTop: "24px"
                        }}>
                            <button type="submit" style={styles.primary}>
                                {editingId === null ? "Save customer" : "Update customer"}
                            </button>
                            <button type="button" style={styles.secondary} onClick={clearForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section style={styles.card}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "18px",
                    marginBottom: "22px"
                }}>
                    <div>
                        <h2 style={{ margin: "0 0 7px", fontSize: "22px" }}>
                            Customer directory
                        </h2>
                        <p style={{ ...styles.muted, fontSize: "13px", margin: 0 }}>
                            {filteredCustomers.length} customer(s) shown
                        </p>
                    </div>

                    <input
                        style={{ ...styles.input, maxWidth: "320px" }}
                        placeholder="Search name, email, phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div style={{ width: "100%", overflowX: "auto" }}>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth: "760px"
                    }}>
                        <thead>
                            <tr style={{ background: "#f5f8fc" }}>
                                {["CUSTOMER", "EMAIL", "PHONE", "ADDRESS", "ACTIONS"].map((heading) => (
                                    <th key={heading} style={{
                                        ...styles.tableCell,
                                        color: "#647797",
                                        fontSize: "11px",
                                        letterSpacing: "0.7px",
                                        fontWeight: 800
                                    }}>
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ ...styles.tableCell, textAlign: "center", padding: "36px" }}>
                                        Loading customers...
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ ...styles.tableCell, textAlign: "center", padding: "36px", color: "#7183a3" }}>
                                        {search ? "No customers match your search." : "No customers yet. Add your first customer above."}
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td style={styles.tableCell}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    flexShrink: 0,
                                                    borderRadius: "13px",
                                                    background: "#edf3ff",
                                                    color: "#2864f0",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    fontWeight: 800
                                                }}>
                                                    {(customer.name || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <strong style={{ display: "block", color: "#172554" }}>
                                                        {customer.name}
                                                    </strong>
                                                    <span style={{ fontSize: "12px", color: "#8292ac" }}>
                                                        Customer #{customer.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td style={styles.tableCell}>{customer.email || "—"}</td>
                                        <td style={styles.tableCell}>{customer.phone || "—"}</td>
                                        <td style={styles.tableCell}>{customer.address || "—"}</td>

                                        <td style={styles.tableCell}>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    style={{
                                                        ...styles.secondary,
                                                        padding: "9px 12px",
                                                        background: "#edf4ff",
                                                        color: "#2864f0",
                                                        border: "none"
                                                    }}
                                                    onClick={() => editCustomer(customer)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    style={{
                                                        ...styles.secondary,
                                                        padding: "9px 12px",
                                                        background: "#fff0f0",
                                                        color: "#c73737",
                                                        border: "none"
                                                    }}
                                                    onClick={() => deleteCustomer(customer.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default Customers;
