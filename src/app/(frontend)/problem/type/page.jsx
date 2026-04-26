"use client";

import { useState, useEffect } from "react";

export default function ProblemTypePage() {
    const [problemTypes, setProblemTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title_en: "",
        title_bn: "",
        description_en: "",
        description_bn: "",
        categoryId: "",
        solverKey: "",
        explanationKey: "",
        storyKey: "",
        visualKey: "",
        difficulty: "medium",
        classRange: "",
    });

    async function fetchProblemTypes() {
        try {
            const res = await fetch("/api/v1/problem-type");
            const data = await res.json();
            setProblemTypes(data);
        } catch (error) {
            console.error("Failed to fetch problem types:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCategories() {
        try {
            const res = await fetch("/api/v1/category");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    }

    useEffect(() => {
        fetchProblemTypes();
        fetchCategories();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/v1/problem-type", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setForm({
                    title_en: "", title_bn: "", description_en: "", description_bn: "",
                    categoryId: "", solverKey: "", explanationKey: "", storyKey: "",
                    visualKey: "", difficulty: "medium", classRange: "",
                });
                fetchProblemTypes();
            }
        } catch (error) {
            console.error("Failed to create problem type:", error);
        } finally {
            setSubmitting(false);
        }
    }

    function getCategoryName(id) {
        const cat = categories.find((c) => c._id === id);
        return cat ? cat.title?.en : id;
    }

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
            <h1>Problem Types</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
                <h2>Add Problem Type</h2>
                <div style={{ display: "flex", gap: 10 }}>
                    <input name="title_en" placeholder="Title (EN)" value={form.title_en} onChange={handleChange} required style={inputStyle} />
                    <input name="title_bn" placeholder="Title (BN)" value={form.title_bn} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <input name="description_en" placeholder="Description (EN)" value={form.description_en} onChange={handleChange} style={inputStyle} />
                    <input name="description_bn" placeholder="Description (BN)" value={form.description_bn} onChange={handleChange} style={inputStyle} />
                </div>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} required style={inputStyle}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.icon} {cat.title?.en} - {cat.title?.bn}
                        </option>
                    ))}
                </select>
                <div style={{ display: "flex", gap: 10 }}>
                    <input name="solverKey" placeholder="Solver Key" value={form.solverKey} onChange={handleChange} style={inputStyle} />
                    <input name="explanationKey" placeholder="Explanation Key" value={form.explanationKey} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <input name="storyKey" placeholder="Story Key" value={form.storyKey} onChange={handleChange} style={inputStyle} />
                    <input name="visualKey" placeholder="Visual Key" value={form.visualKey} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <select name="difficulty" value={form.difficulty} onChange={handleChange} style={inputStyle}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <input name="classRange" placeholder="Class Range (e.g. 1-3)" value={form.classRange} onChange={handleChange} style={inputStyle} />
                </div>
                <button type="submit" disabled={submitting} style={buttonStyle}>
                    {submitting ? "Adding..." : "Add Problem Type"}
                </button>
            </form>

            {/* List */}
            <h2>Problem Type List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : problemTypes.length === 0 ? (
                <p>No problem types found.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Title (EN)</th>
                            <th style={thStyle}>Title (BN)</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Difficulty</th>
                            <th style={thStyle}>Class Range</th>
                            <th style={thStyle}>Slug</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problemTypes.map((pt) => (
                            <tr key={pt._id}>
                                <td style={tdStyle}>{pt.title?.en}</td>
                                <td style={tdStyle}>{pt.title?.bn}</td>
                                <td style={tdStyle}>{getCategoryName(pt.categoryId)}</td>
                                <td style={tdStyle}>{pt.difficulty}</td>
                                <td style={tdStyle}>{pt.classRange}</td>
                                <td style={tdStyle}>{pt.slug}</td>
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
