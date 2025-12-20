// src/components/HomePage.jsx
import React from "react";
import "./HomePage.css"; // Ye tumhara CSS copy kar ke yahan dalna

function HomePage() {
  return (
    <div className="homepage">
      <header className="header">
        <h1>Welcome to E-Commerce</h1>
      </header>

      <section className="products">
        <div className="product-card">
          <img src="/assets/images/product1.jpg" alt="Product 1" />
          <h2>Product 1</h2>
          <p>$19.99</p>
        </div>
        <div className="product-card">
          <img src="/assets/images/product2.jpg" alt="Product 2" />
          <h2>Product 2</h2>
          <p>$29.99</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 My E-Commerce</p>
      </footer>
    </div>
  );
}

export default HomePage;
