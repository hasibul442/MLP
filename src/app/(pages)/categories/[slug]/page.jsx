import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@mui/material";
import db from "@/libs/dbconfig";
import Category from "@/server/models/Category";
import styles from "./page.module.css";

async function getCategoryBySlug(slug) {
    await db();
    const category = await Category.findOne({ slug }).lean();

    if (!category) {
        return null;
    }

    return {
        id: category._id.toString(),
        slug: category.slug,
        icon: category.icon || "#",
        titleEn: category.title?.en || "Untitled Category",
        titleBn: category.title?.bn || "",
        descriptionEn: category.description?.en || "No description available.",
        descriptionBn: category.description?.bn || "",
    };
}

export default async function CategoryDetailsPage({ params }) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    return (
        <div className={styles.page}>
            <Container maxWidth="md" className="py-5">
                <div className={styles.panel}>
                    <span className={styles.icon}>{category.icon}</span>
                    <h1 className={styles.title}>{category.titleEn}</h1>
                    {category.titleBn ? <p className={styles.subtitle}>{category.titleBn}</p> : null}

                    <div className={styles.block}>
                        <h2>What you can learn in this category</h2>
                        <p>{category.descriptionEn}</p>
                        {category.descriptionBn ? <p>{category.descriptionBn}</p> : null}
                    </div>

                    <div className={styles.block}>
                        <h2>Learning methods</h2>
                        <ul>
                            <li>Complete solved math explanation</li>
                            <li>Quick and exam-friendly method</li>
                            <li>Shortcut technique for speed</li>
                            <li>Visualization-based understanding</li>
                        </ul>
                    </div>

                    <Link href="/categories" className={styles.backLink}>
                        Back to all categories
                    </Link>
                </div>
            </Container>
        </div>
    );
}
