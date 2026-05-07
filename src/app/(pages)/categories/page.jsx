"use client";
import Link from "next/link";
import { Chip, Container } from "@mui/material";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

async function getCategories() {
    try {
        const response = await fetch(`api/v1/category`, {
            cache: "no-store",
            headers: {
                "x-accept-language": "en",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const categories = await response.json();

        if (!Array.isArray(categories)) {
            return [];
        }

        return categories.map((item) => ({
            id: (item._id || item.id || item.slug).toString(),
            slug: item.slug,
            icon: item.icon || "#",
            title: item.title || "Untitled Category",
            description: item.description || "No description yet.",
            order: item.order ?? "-",
        }));
    } catch (error) {
        console.error("Failed to load categories page data:", error);
        return [];
    }
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            const categories = await getCategories();
            setCategories(categories);
        }
        fetchCategories();
    }, []);

    return (
        <div>
            <Container maxWidth="lg" className="py-5">
                <section className={styles.hero}>
                    <Chip label="Education Categories" className={styles.badge} />
                    <h1 className={styles.title}>Explore Math Categories</h1>
                    <p className={styles.subtitle}>
                        Browse solved math topics and open a category to view focused methods, shortcuts, and visual explanations.
                    </p>
                </section>

                {categories.length === 0 ? (
                    <div className={styles.emptyBox}>
                        <h2>No categories found</h2>
                        <p>Add categories from the admin panel to show them here.</p>
                    </div>
                ) : (
                    <section className="row g-4">
                        {categories.map((category) => (
                            <div className="col-12 col-md-6 col-lg-4" key={category.id}>
                                <Link href={`/categories/${category.id}`} className={styles.cardLink}>
                                    <div className={styles.card}>
                                        <div className={styles.cardHead}>
                                            <span className={styles.iconWrap}>{category.icon}</span>
                                        </div>
                                        <h2 className={styles.cardTitle}>{category.title}</h2>
                                        {/* <p className={styles.cardDescription}>{category.description}</p> */}
                                        <span className={styles.cardAction}>Open Category</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </section>
                )}
            </Container>
        </div>
    );
}
