import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) navigate("/");
    fetchProducts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Product name required");
    const p = parseFloat(price);
    const q = parseInt(qty, 10);
    if (!Number.isFinite(p) || p < 0) return setError("Price must be 0 or more");
    if (!Number.isFinite(q) || q <= 0) return setError("Quantity must be positive");

    try {
      await api.post(
        "/products",
        { name, price: p, qty: q },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setPrice("");
      setQty("");
      fetchProducts();
    } catch (err) {
      setError("Failed to add product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Calculate subtotal, GST and total
  const subtotal = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.qty, 0),
    [products]
  );
  const gst = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);

  // Download PDF Invoice
  const handleInvoice = async () => {
    if (products.length === 0) return setError("Add at least one product");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/invoice/download", {
        method: "POST", // Usually POST with products and GST data
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products, gstPercent: 18 }),
      });

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      setProducts([]); // Clear products if needed
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to download invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-black">
            L
          </div>
          <h1 className="font-semibold text-lg">
            levitation <span className="text-gray-400 text-sm">infotech</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-green-400 hover:bg-green-500 text-black px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center p-6 flex-1">
        {/* Add Product */}
        <form
          onSubmit={handleAdd}
          className="mb-6 bg-gray-900 px-6 py-3 rounded flex items-center gap-3"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            value={price}
            type="number"
            min="0"
            step="0.01"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            value={qty}
            type="number"
            min="1"
            onChange={(e) => setQty(e.target.value)}
            placeholder="Quantity"
            className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded"
          >
            Add Product +
          </button>
        </form>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        {/* Table */}
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="w-full text-left border border-gray-700">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-4 py-2 border border-gray-700">Product name</th>
                <th className="px-4 py-2 border border-gray-700">Price</th>
                <th className="px-4 py-2 border border-gray-700">Quantity</th>
                <th className="px-4 py-2 border border-gray-700">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="bg-black hover:bg-gray-800">
                  <td className="px-4 py-2 border border-gray-700 italic">{p.name}</td>
                  <td className="px-4 py-2 border border-gray-700">{p.price}</td>
                  <td className="px-4 py-2 border border-gray-700">{p.qty}</td>
                  <td className="px-4 py-2 border border-gray-700">
                    INR {(p.price * p.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-900">
                <td colSpan={3} className="px-4 py-2 border border-gray-700 text-right font-semibold">
                  Sub-Total
                </td>
                <td className="px-4 py-2 border border-gray-700">INR {subtotal.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-900">
                <td colSpan={3} className="px-4 py-2 border border-gray-700 text-right font-semibold">
                  Incl + GST 18%
                </td>
                <td className="px-4 py-2 border border-gray-700">INR {total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Invoice Button */}
        <button
          onClick={handleInvoice}
          disabled={loading}
          className="mt-8 bg-gray-800 hover:bg-gray-700 text-green-400 font-semibold px-6 py-3 rounded"
        >
          {loading ? "Generating..." : "Generate PDF Invoice"}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
