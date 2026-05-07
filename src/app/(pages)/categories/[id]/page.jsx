"use client";
import Link from "next/link";
import { Container } from "@mui/material";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CategoryDetailsPage() {
    const { id } = useParams();
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getCategoryDetails(id) {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/v1/category/${id}`, {
                cache: "no-store",
                headers: {
                    "x-accept-language": "bn",
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch category details: ${response.status}`);
            }

            const categoryDetails = await response.json();
            setCategories(categoryDetails);
        } catch (error) {
            console.error("Failed to load category details:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            getCategoryDetails(id);
        }
    }, [id]);

    const categoryData = categories;
    
    return (
        <div>
            <Container maxWidth="lg" className="py-5">
                {/* Loading State */}
                {loading && (
                    <div className={styles.loadingBox}>
                        <div className={styles.spinner}></div>
                        <p>Loading category details...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className={styles.errorBox}>
                        <h2>❌ Error Loading Category</h2>
                        <p>{error}</p>
                        <Link href="/categories" className={styles.backLink}>
                            ← Back to all categories
                        </Link>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* Category Header */}
                        {categoryData && (
                            <div className={styles.panel}>
                                <Link href="/categories" className={styles.backLink}>
                                    ← Back to all categories
                                </Link>
                                
                                <div className="mt-3">
                                    <span className={styles.icon}>{categoryData.icon || "📚"}</span>
                                    <h1 className={styles.title}>{categoryData.title?.en || categoryData.title}</h1>
                                    {categoryData.title?.bn && <p className={styles.subtitle}>{categoryData.title.bn}</p>}
                                </div>

                                {categoryData.description && (
                                    <div className={styles.block}>
                                        <h2>About this category</h2>
                                        <p>{categoryData.description?.en || categoryData.description}</p>
                                        {categoryData.description?.bn && <p>{categoryData.description.bn}</p>}
                                    </div>
                                )}

                                <div className={styles.block}>
                                    <h2>Learning methods</h2>
                                    <ul>
                                        <li>Complete step-by-step solution</li>
                                        <li>Bilingual support (English/বাংলা)</li>
                                        <li>Traditional Bengali math format</li>
                                        <li>Interactive problem solving</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Problem Types Section */}
                        {categoryData?.problem_types && categoryData.problem_types.length > 0 && (
                            <>
                                <div className="mt-5 mb-4">
                                    <h2 className={styles.sectionTitle}>Problem Types</h2>
                                    <p className={styles.sectionSubtitle}>
                                        Choose a problem type to start solving
                                    </p>
                                </div>
                                
                                <section className="row g-4">
                                    {categoryData.problem_types.map((problemType) => (
                                        <div className="col-12 col-md-6 col-lg-4" key={problemType._id || problemType.id}>
                                            <Link 
                                                href={`/problems?type=${problemType._id || problemType.id}`} 
                                                className={styles.cardLink}
                                            >
                                                <div className={styles.card}>
                                                    <div className={styles.cardHead}>
                                                        <span className={styles.iconWrap}>
                                                            {problemType.icon || "🧮"}
                                                        </span>
                                                    </div>
                                                    <h3 className={styles.cardTitle}>
                                                        {problemType.title?.en || problemType.title}
                                                    </h3>
                                                    {problemType.title?.bn && (
                                                        <p className={styles.cardTitleBn}>{problemType.title.bn}</p>
                                                    )}
                                                    {problemType.description && (
                                                        <p className={styles.cardDescription}>
                                                            {problemType.description?.en || problemType.description}
                                                        </p>
                                                    )}
                                                    <span className={styles.cardAction}>Solve Problems →</span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </section>
                            </>
                        )}

                        {/* Empty State */}
                        {(!categoryData?.problem_types || categoryData.problem_types.length === 0) && categoryData && (
                            <div className={styles.emptyBox}>
                                <h2>No problem types available yet</h2>
                                <p>Problem types for this category are coming soon.</p>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}
