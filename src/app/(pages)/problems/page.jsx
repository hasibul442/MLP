"use client";
import Link from "next/link";
import { Container } from "@mui/material";
import styles from "./page.module.css";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function ProblemsPage() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const searchParams = useSearchParams();

    const problem_type = searchParams.get("type");

    async function getProblems(type) {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/v1/problem?type=${type}`, {
                cache: "no-store",
                headers: {
                    "x-accept-language": "en",
                },
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch problems: ${response.status}`);
            }

            const problemsData = await response.json();
            setProblems(problemsData);
        } catch (error) {
            console.error("Failed to load problems:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProblems(problem_type);
    }, [problem_type]);

    // Get unique problem types for filter
    const problemTypes = useMemo(() => {
        const types = problems
            .map(p => p.problemType)
            .filter(Boolean)
            .reduce((acc, type) => {
                if (!acc.some(t => t.id === type.id)) {
                    acc.push(type);
                }
                return acc;
            }, []);
        return types;
    }, [problems]);

    // Filter problems based on search and type
    const filteredProblems = useMemo(() => {
        return problems.filter(problem => {
            const matchesSearch = 
                searchQuery === "" ||
                problem.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
                problem.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                problem.problemType?.title?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = 
                selectedType === "all" || 
                problem.problemType?.id === selectedType;

            return matchesSearch && matchesType;
        });
    }, [problems, searchQuery, selectedType]);

    return (
        <div>
            <Container maxWidth="lg" className="py-5">
                {/* Hero Section */}
                <div className={styles.hero}>
                    <h1 className={styles.title}>Explore Math Problems</h1>
                    <p className={styles.subtitle}>
                        Solve step-by-step math problems with bilingual explanations. 
                        Choose from various categories and difficulty levels.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className={styles.loadingBox}>
                        <div className={styles.spinner}></div>
                        <p>Loading problems...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className={styles.errorBox}>
                        <h2>❌ Error Loading Problems</h2>
                        <p>{error}</p>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* Filter Section */}
                        <div className={styles.filterSection}>
                            <div className={styles.filterGroup}>
                                <div className={styles.searchBox}>
                                    <input
                                        type="text"
                                        placeholder="Search problems..."
                                        className={styles.searchInput}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="type-filter" className={styles.filterLabel}>Type:</label>
                                    <select
                                        id="type-filter"
                                        className={styles.filterSelect}
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                    >
                                        <option value="all">All Types</option>
                                        {problemTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className={styles.statsBar}>
                            <div className={styles.statsText}>
                                Showing <span className={styles.statsCount}>{filteredProblems.length}</span> of{" "}
                                <span className={styles.statsCount}>{problems.length}</span> problems
                            </div>
                        </div>

                        {/* Problems Grid */}
                        {filteredProblems.length > 0 ? (
                            <section className="row g-4">
                                {filteredProblems.map((problem) => (
                                    <div className="col-12 col-md-12 col-lg-12" key={problem.id}>
                                        <Link 
                                            href={`/problems/solution?id=${problem.id}`} 
                                            className={styles.cardLink}
                                        >
                                            <div className={styles.card}>
                                                <div className={styles.cardHeader}>
                                                    {problem.problemType && (
                                                        <span className={styles.problemType}>
                                                            <span className={styles.problemIcon}>
                                                                {problem.problemType.icon || "🧮"}
                                                            </span>
                                                            {problem.problemType.title || ""}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={styles.cardTitle}>
                                                    {problem.title || "Problem"}
                                                </h3>

                                                <div className={styles.cardFooter}>
                                                    <div className={`${styles.difficultyBadge} ${styles.difficultyEasy}`}>
                                                        Easy
                                                    </div>
                                                    <span className={styles.cardAction}>Solve →</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </section>
                        ) : (
                            <div className={styles.emptyBox}>
                                <h2>No problems found</h2>
                                <p>
                                    {searchQuery || selectedType !== "all"
                                        ? "Try adjusting your filters or search query."
                                        : "No problems are available yet."}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}
