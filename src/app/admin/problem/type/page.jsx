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
    MenuItem,
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

    let listContent;
    if (loading) {
        listContent = (
            <Box className={styles.loading}>
                <CircularProgress size={32} className={styles.progress} />
                <Typography variant="body2">Loading problem types...</Typography>
            </Box>
        );
    } else if (problemTypes.length === 0) {
        listContent = (
            <Box className={styles.emptyState}>
                <Typography className={styles.emptyText}>No problem types found. Add your first one above.</Typography>
            </Box>
        );
    } else {
        listContent = (
            <TableContainer className={styles.tableContainer}>
                <Table className={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title (EN)</TableCell>
                            <TableCell>Title (BN)</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>Class Range</TableCell>
                            <TableCell>Slug</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {problemTypes.map((pt) => (
                            <TableRow key={pt._id}>
                                <TableCell>{pt.title?.en}</TableCell>
                                <TableCell>{pt.title?.bn}</TableCell>
                                <TableCell>{getCategoryName(pt.categoryId)}</TableCell>
                                <TableCell>
                                    <span className={styles.pill}>{pt.difficulty}</span>
                                </TableCell>
                                <TableCell>
                                    <span className={styles.pill}>{pt.classRange || "-"}</span>
                                </TableCell>
                                <TableCell>
                                    <span className={styles.code}>{pt.slug}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <div className="page-background">
            <Container maxWidth="lg" className="py-5">
                <main className={styles.main}>
                    <section className="row g-4 align-items-stretch mb-4 mb-lg-5">
                        <div className="col-12 col-lg-5">
                            <Chip label="Admin Workspace" className={styles.badge} />
                            <Typography variant="h3" component="h1" className={styles.heroTitle}>
                                Problem Type Management
                            </Typography>
                            <Typography variant="body1" className={styles.heroText}>
                                Configure problem types, assign categories, and map solver keys to enrich the learning library.
                            </Typography>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="mt-4">
                                <Button
                                    variant="contained"
                                    size="large"
                                    className={styles.primaryBtn}
                                    type="submit"
                                    form="problem-type-form"
                                    disabled={submitting}
                                >
                                    {submitting ? "Adding..." : "Add Problem Type"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    className={styles.secondaryBtn}
                                    onClick={fetchProblemTypes}
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
                                        Add New Problem Type
                                    </Typography>
                                    <form id="problem-type-form" onSubmit={handleSubmit} className="mt-4">
                                        <div className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="title_en"
                                                    name="title_en"
                                                    label="Title (English)"
                                                    placeholder="Enter English title"
                                                    value={form.title_en}
                                                    onChange={handleChange}
                                                    required
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="title_bn"
                                                    name="title_bn"
                                                    label="Title (Bengali)"
                                                    placeholder="বাংলা শিরোনাম লিখুন"
                                                    value={form.title_bn}
                                                    onChange={handleChange}
                                                    required
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="description_en"
                                                    name="description_en"
                                                    label="Description (English)"
                                                    placeholder="Enter English description"
                                                    value={form.description_en}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="description_bn"
                                                    name="description_bn"
                                                    label="Description (Bengali)"
                                                    placeholder="বাংলা বিবরণ লিখুন"
                                                    value={form.description_bn}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <TextField
                                                    id="categoryId"
                                                    name="categoryId"
                                                    label="Category"
                                                    value={form.categoryId}
                                                    onChange={handleChange}
                                                    required
                                                    select
                                                    fullWidth
                                                    className={styles.textField}
                                                >
                                                    <MenuItem value="">Select Category</MenuItem>
                                                    {categories.map((cat) => (
                                                        <MenuItem key={cat._id} value={cat._id}>
                                                            {cat.icon} {cat.title?.en} - {cat.title?.bn}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="solverKey"
                                                    name="solverKey"
                                                    label="Solver Key"
                                                    placeholder="solver"
                                                    value={form.solverKey}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="explanationKey"
                                                    name="explanationKey"
                                                    label="Explanation Key"
                                                    placeholder="explanation"
                                                    value={form.explanationKey}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="storyKey"
                                                    name="storyKey"
                                                    label="Story Key"
                                                    placeholder="story"
                                                    value={form.storyKey}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="visualKey"
                                                    name="visualKey"
                                                    label="Visual Key"
                                                    placeholder="visual"
                                                    value={form.visualKey}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    className={styles.textField}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="difficulty"
                                                    name="difficulty"
                                                    label="Difficulty"
                                                    value={form.difficulty}
                                                    onChange={handleChange}
                                                    select
                                                    fullWidth
                                                    className={styles.textField}
                                                >
                                                    <MenuItem value="easy">Easy</MenuItem>
                                                    <MenuItem value="medium">Medium</MenuItem>
                                                    <MenuItem value="hard">Hard</MenuItem>
                                                </TextField>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <TextField
                                                    id="classRange"
                                                    name="classRange"
                                                    label="Class Range"
                                                    placeholder="1-3"
                                                    value={form.classRange}
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
                                            Problem Type List
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            className={styles.secondaryBtn}
                                            onClick={fetchProblemTypes}
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
    );
}
