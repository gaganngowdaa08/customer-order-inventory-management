
import { NavLink } from "react-router-dom";
import "../App.css";

function Navbar() {
    const links = [
        { to: "/", label: "Dashboard", icon: "▦", end: true },
        { to: "/customers", label: "Customers", icon: "♙" },
        { to: "/products", label: "Products", icon: "◇" },
        { to: "/orders", label: "Orders", icon: "▤" },
        { to: "/inventory", label: "Inventory", icon: "▥" }
    ];

    return (
        <header className="app-navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="brand">
                    <span className="brand-logo">OI</span>
                    <span className="brand-text">
                        <strong>StockFlow</strong>
                        <small>ORDER & INVENTORY</small>
                    </span>
                </NavLink>

                <nav className="nav-links" aria-label="Main navigation">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                `nav-link${isActive ? " active" : ""}`
                            }
                        >
                            <span className="nav-icon">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="navbar-status">
                    <span className="status-dot"></span>
                    <span>System Online</span>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
