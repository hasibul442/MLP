"use client";

import { useState, useEffect } from "react";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        slug: "",
        titleEn: "",
        titleBn: "",
        descriptionEn: "",
        descriptionBn: "",
        icon: "",
        order: "",
    });

    async function fetchCategories() {
        try {
            const res = await fetch("/api/v1/category");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/v1/category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: form.slug,
                    title: { en: form.titleEn, bn: form.titleBn },
                    description: { en: form.descriptionEn, bn: form.descriptionBn },
                    icon: form.icon,
                    order: form.order ? Number(form.order) : undefined,
                }),
            });
            if (res.ok) {
                setForm({ slug: "", titleEn: "", titleBn: "", descriptionEn: "", descriptionBn: "", icon: "", order: "" });
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to create category:", error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
            <h1>Categories</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
                <h2>Add Category</h2>
                <input name="slug" placeholder="Slug (e.g. algebra)" value={form.slug} onChange={handleChange} required style={inputStyle} />
                <div style={{ display: "flex", gap: 10 }}>
                    <input name="titleEn" placeholder="Title (EN)" value={form.titleEn} onChange={handleChange} required style={inputStyle} />
                    <input name="titleBn" placeholder="Title (BN)" value={form.titleBn} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <input name="descriptionEn" placeholder="Description (EN)" value={form.descriptionEn} onChange={handleChange} style={inputStyle} />
                    <input name="descriptionBn" placeholder="Description (BN)" value={form.descriptionBn} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <input name="icon" placeholder="Icon (e.g. 🧮)" value={form.icon} onChange={handleChange} style={inputStyle} />
                    <input name="order" placeholder="Order" type="number" value={form.order} onChange={handleChange} style={inputStyle} />
                </div>
                <button type="submit" disabled={submitting} style={buttonStyle}>
                    {submitting ? "Adding..." : "Add Category"}
                </button>
            </form>

            {/* Category List */}
            <h2>Category List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : categories.length === 0 ? (
                <p>No categories found.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Icon</th>
                            <th style={thStyle}>Slug</th>
                            <th style={thStyle}>Title (EN)</th>
                            <th style={thStyle}>Title (BN)</th>
                            <th style={thStyle}>Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat._id}>
                                <td style={tdStyle}>{cat.icon}</td>
                                <td style={tdStyle}>{cat.slug}</td>
                                <td style={tdStyle}>{cat.title?.en}</td>
                                <td style={tdStyle}>{cat.title?.bn}</td>
                                <td style={tdStyle}>{cat.order}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const inputStyle = {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
};

const buttonStyle = {
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    background: "#0070f3",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
};

const thStyle = {
    textAlign: "left",
    padding: "8px 12px",
    borderBottom: "2px solid #ccc",
};

const tdStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid #eee",
};
