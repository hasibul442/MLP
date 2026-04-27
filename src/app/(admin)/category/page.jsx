"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
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
                    title: { en: form.titleEn, bn: form.titleBn },
                    description: { en: form.descriptionEn, bn: form.descriptionBn },
                    icon: form.icon,
                    order: form.order ? Number(form.order) : undefined,
                }),
            });
            if (res.ok) {
                setForm({ titleEn: "", titleBn: "", descriptionEn: "", descriptionBn: "", icon: "", order: "" });
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to create category:", error);
        } finally {
            setSubmitting(false);
        }
    }

    let listContent;
    if (loading) {
        listContent = (
            <Box className={styles.loading}>
                <CircularProgress size={32} className={styles.progress} />
                <Typography variant="body2">Loading categories...</Typography>
            </Box>
        );
    } else if (categories.length === 0) {
        listContent = (
            <Box className={styles.emptyState}>
                <Typography className={styles.emptyIcon}>:mailbox_with_no_mail:</Typography>
                <Typography className={styles.emptyText}>No categories found. Add your first category above!</Typography>
            </Box>
        );
    } else {
        listContent = (
            <TableContainer className={styles.tableContainer}>
                <Table className={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Icon</TableCell>
                            <TableCell>Title (EN)</TableCell>
                            <TableCell>Title (BN)</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Order</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat._id}>
                                <TableCell>
                                    <span className={styles.iconBadge}>{cat.icon}</span>
                                </TableCell>
                                <TableCell>{cat.title?.en}</TableCell>
                                <TableCell>{cat.title?.bn}</TableCell>
                                <TableCell>
                                    <span className={styles.code}>{cat.slug}</span>
                                </TableCell>
                                <TableCell>
                                    <span className={styles.orderBadge}>{cat.order}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <div className={styles.page}>
            <Container maxWidth="lg" className="py-5">
                <main className={styles.main}>
                    <section className="row g-4 align-items-stretch mb-4 mb-lg-5">
                        <div className="col-12 col-lg-5">
                            <Chip label="Admin Workspace" className={styles.badge} />
                            <Typography variant="h3" component="h1" className={styles.heroTitle}>
                                Category Management
                            </Typography>
                            <Typography variant="body1" className={styles.heroText}>
                                Create, organize, and prioritize learning categories to keep the library structured and easy to explore.
                            </Typography>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="mt-4">
                                <Button
                                    variant="contained"
                                    size="large"
                                    className={styles.primaryBtn}
                                    type="submit"
                                    form="category-form"
                                    disabled={submitting}
                                >
                                    {submitting ? "Adding..." : "Add Category"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    className={styles.secondaryBtn}
                                    onClick={fetchCategories}
                                    disabled={loading}
                                >
                                    Refresh List
                                </Button>
                            </Stack>
                        </div>

                        <div className="col-12 col-lg-7">
                            <Card elevation={0} className={styles.card}>
                                <CardContent className="p-4 p-md-5">
                                    <Typography variant="h6" className={styles.cardHeading}>
                                        Add New Category
                                    </Typography>
                                    <form id="category-form" onSubmit={handleSubmit} className="mt-4">
                                        <div className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="titleEn"
                                                    name="titleEn"
                                                    label="Title (English)"
                                                    placeholder="Enter English title"
                                                    value={form.titleEn}
                                                    onChange={handleChange}
                                                    required
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="titleBn"
                                                    name="titleBn"
                                                    label="Title (Bengali)"
                                                    placeholder="বাংলা শিরোনাম লিখুন"
                                                    value={form.titleBn}
                                                    onChange={handleChange}
                                                    required
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="descriptionEn"
                                                    name="descriptionEn"
                                                    label="Description (English)"
                                                    placeholder="Enter English description"
                                                    value={form.descriptionEn}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="descriptionBn"
                                                    name="descriptionBn"
                                                    label="Description (Bengali)"
                                                    placeholder="বাংলা বিবরণ লিখুন"
                                                    value={form.descriptionBn}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="icon"
                                                    name="icon"
                                                    label="Icon"
                                                    placeholder=":abacus:"
                                                    value={form.icon}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="order"
                                                    name="order"
                                                    label="Order"
                                                    placeholder="1"
                                                    type="number"
                                                    value={form.order}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <section className="row g-4">
                        <div className="col-12">
                            <Card elevation={0} className={styles.card}>
                                <CardContent className="p-4 p-md-5">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                        <Typography variant="h6" className={styles.cardHeading}>
                                            Category List
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            className={styles.secondaryBtn}
                                            onClick={fetchCategories}
                                            disabled={loading}
                                        >
                                            Refresh
                                        </Button>
                                    </div>
                                    <Box className="mt-4">{listContent}</Box>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </main>
            </Container>
        </div>
    )
}
