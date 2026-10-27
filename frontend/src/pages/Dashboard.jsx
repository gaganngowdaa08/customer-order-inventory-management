
import { useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

function Dashboard() {
    const [dashboard, setDashboard] = useState({
        totalCustomers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        API.get("/dashboard/summary")
            .then((response) => {
                setDashboard(response.data);
                setError("");
            })
            .catch((err) => {
                console.error("Failed to load dashboard", err);
                setError("Dashboard summary could not be loaded.");
            })
            .finally(() => setLoading(false));
    }, []);

    const stats = [
        {
            title: "Total Customers",
            value: dashboard.totalCustomers,
            icon: "♙",
            color: "blue"
        },
        {
            title: "Total Products",
            value: dashboard.totalProducts,
            icon: "▦",
            color: "purple"
        },
        {
            title: "Total Orders",
            value: dashboard.totalOrders,
            icon: "▤",
            color: "orange"
        },
        {
            title: "Total Sales",
            value: `₹${Number(dashboard.totalSales || 0).toLocaleString("en-IN", {
                maximumFractionDigits: 2
            })}`,
            icon: "₹",
            color: "green"
        }
    ];

    return (
        <main className="dashboard-page">
            <section className="dashboard-heading">
                <div>
                    <p className="eyebrow">OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Welcome back! Here's your business at a glance.
                    </p>
                </div>

                <div className="dashboard-date">
                    {new Date().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    })}
                </div>
            </section>

            {error && <p className="dashboard-error">{error}</p>}

            <section className="stats-grid">
                {stats.map((stat) => (
                    <article className="stat-card" key={stat.title}>
                        <div className={`stat-icon ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <p className="stat-title">{stat.title}</p>
                        <h2 className="stat-value">
                            {loading ? "..." : stat.value}
                        </h2>
                        <p className="stat-note">
                            {loading ? "Loading data..." : "Current recorded total"}
                        </p>
                    </article>
                ))}
            </section>

            <section className="dashboard-welcome">
                <div>
                    <p className="eyebrow">BUSINESS MANAGEMENT</p>
                    <h2>Everything in one place.</h2>
                    <p>
                        Manage your customers, products, inventory and orders
                        from a single workspace.
                    </p>
                </div>
                <div className="welcome-symbol">↗</div>
            </section>

            <section className="dashboard-section">
                <h2>Quick overview</h2>
                <div className="overview-grid">
                    <div className="overview-item">
                        <span>Customer records</span>
                        <strong>{loading ? "..." : dashboard.totalCustomers}</strong>
                    </div>
                    <div className="overview-item">
                        <span>Products in catalogue</span>
                        <strong>{loading ? "..." : dashboard.totalProducts}</strong>
                    </div>
                    <div className="overview-item">
                        <span>Orders recorded</span>
                        <strong>{loading ? "..." : dashboard.totalOrders}</strong>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Dashboard;
