"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import Footer from "@/Components/Footer/Footer";
import { useTranslations } from "../ClientLayout";

// Icons
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import InsightsIcon from "@mui/icons-material/Insights";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FunctionsIcon from "@mui/icons-material/Functions";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CategoryIcon from "@mui/icons-material/Category";
import { useLanguageContext } from "@/Context/LanguageContext";
import { GET } from "@/utils/HttpClient/HttpClient";

const learningMethods = [
  {
    title: "Step-by-Step",
    icon: <AutoStoriesIcon />,
    color: "#3A7BFF",
  },
  {
    title: "Quick Solution",
    icon: <FlashOnIcon />,
    color: "#17B6FF",
  },
  {
    title: "Shortcuts",
    icon: <InsightsIcon />,
    color: "#FF6B9D",
  },
  {
    title: "Visualization",
    icon: <VisibilityIcon />,
    color: "#FFB800",
  },
  {
    title: "Formula Based",
    icon: <FunctionsIcon />,
    color: "#00D4AA",
  },
  {
    title: "Practice Mode",
    icon: <BoltIcon />,
    color: "#A855F7",
  },
];

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "University Student",
    content: "MLP transformed how I approach math problems. The step-by-step solutions are incredibly helpful!",
    rating: 5,
  },
  {
    name: "Rakib Hassan",
    role: "High School Student",
    content: "The visualization methods made complex topics so much easier to understand. Highly recommended!",
    rating: 5,
  },
  {
    name: "Nusrat Khan",
    role: "Math Teacher",
    content: "I recommend MLP to all my students. The multiple solution approaches cater to different learning styles.",
    rating: 5,
  },
];

export default function Home() {
  const t = useTranslations();
  const [categories, setCategories] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [floatingOffset, setFloatingOffset] = useState(0);
  const { language } = useLanguageContext();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await GET({
                    url: `api/v1/category`,
                    lang: language,
                });
          setCategories(data?.slice(0, 6) || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <Box className={styles.heroBackground}>
          <Box className={styles.heroGradient1} />
          <Box className={styles.heroGradient2} />
        </Box>
        <Box className={styles.heroFloatingIcons}>
          <Box
            className={styles.floatingShape}
            style={{
              transform: `translate(${Math.sin(floatingOffset * 0.02) * 15}px, ${Math.cos(floatingOffset * 0.03) * 15}px)`,
            }}
          >
            <AutoStoriesIcon className={styles.floatingIcon} />
          </Box>
          <Box
            className={styles.floatingShape2}
            style={{
              transform: `translate(${Math.cos(floatingOffset * 0.025) * 20}px, ${Math.sin(floatingOffset * 0.02) * 20}px)`,
            }}
          >
            <InsightsIcon className={styles.floatingIcon} />
          </Box>
          <Box
            className={styles.floatingShape3}
            style={{
              transform: `translate(${Math.sin(floatingOffset * 0.03) * 12}px, ${Math.cos(floatingOffset * 0.025) * 12}px)`,
            }}
          >
            <FlashOnIcon className={styles.floatingIcon} />
          </Box>
          <Box
            className={styles.floatingShape4}
            style={{
              transform: `translate(${Math.cos(floatingOffset * 0.028) * 18}px, ${Math.sin(floatingOffset * 0.022) * 18}px)`,
            }}
          >
            <VisibilityIcon className={styles.floatingIcon} />
          </Box>
          <Box
            className={styles.floatingShape5}
            style={{
              transform: `translate(${Math.sin(floatingOffset * 0.032) * 14}px, ${Math.cos(floatingOffset * 0.027) * 14}px)`,
            }}
          >
            <FunctionsIcon className={styles.floatingIcon} />
          </Box>
          <Box
            className={styles.floatingShape6}
            style={{
              transform: `translate(${Math.cos(floatingOffset * 0.024) * 16}px, ${Math.sin(floatingOffset * 0.029) * 16}px)`,
            }}
          >
            <BoltIcon className={styles.floatingIcon} />
          </Box>
          <Box
            className={styles.floatingShape7}
            style={{
              transform: `translate(${Math.sin(floatingOffset * 0.026) * 13}px, ${Math.cos(floatingOffset * 0.031) * 13}px)`,
            }}
          >
            <CategoryIcon className={styles.floatingIcon} />
          </Box>
          <Box
            className={styles.floatingShape8}
            style={{
              transform: `translate(${Math.cos(floatingOffset * 0.021) * 17}px, ${Math.sin(floatingOffset * 0.028) * 17}px)`,
            }}
          >
            <TrendingUpIcon className={styles.floatingIcon} />
          </Box>
        </Box>
        <Container maxWidth="lg" className={styles.heroContainer}>
          <Box className={styles.heroContent}>
            <Box className={styles.heroBadge}>
              <BoltIcon fontSize="small" />
              <Typography variant="caption" className={styles.badgeText}>
                Interactive Learning Platform
              </Typography>
            </Box>
            <Typography variant="h1" className={styles.heroTitle}>
              {t("Home.heroTitle")}
            </Typography>
            <Typography variant="h6" className={styles.heroSubtitle}>
              {t("Home.heroSubtitle")}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className={styles.heroButtons}>
              <Link href="/problems" passHref>
                <Button variant="contained" size="large" className={styles.primaryBtn} endIcon={<ArrowForwardIcon />}>
                  {t("Home.getStarted")}
                </Button>
              </Link>
              <Link href="/categories" passHref>
                <Button variant="outlined" size="large" className={styles.secondaryBtn}>
                  {t("Home.exploreCategories")}
                </Button>
              </Link>
            </Stack>
            <Box className={styles.heroFeatures}>
              <Box className={styles.heroFeatureItem}>
                <CheckCircleIcon fontSize="small" className={styles.checkIcon} />
                <Typography variant="body2">480+ Problems</Typography>
              </Box>
              <Box className={styles.heroFeatureItem}>
                <CheckCircleIcon fontSize="small" className={styles.checkIcon} />
                <Typography variant="body2">6 Learning Methods</Typography>
              </Box>
              <Box className={styles.heroFeatureItem}>
                <CheckCircleIcon fontSize="small" className={styles.checkIcon} />
                <Typography variant="body2">Free Access</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <Container maxWidth="lg">
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <Box className={styles.statCard}>
                <LibraryBooksIcon className={styles.statIcon} />
                <Typography variant="h3" className={styles.statValue}>480+</Typography>
                <Typography variant="body2" className={styles.statLabel}>
                  {t("Home.statsProblems")}
                </Typography>
              </Box>
            </div>
            <div className="col-6 col-md-3">
              <Box className={styles.statCard}>
                <CategoryIcon className={styles.statIcon} />
                <Typography variant="h3" className={styles.statValue}>12+</Typography>
                <Typography variant="body2" className={styles.statLabel}>
                  {t("Home.statsCategories")}
                </Typography>
              </Box>
            </div>
            <div className="col-6 col-md-3">
              <Box className={styles.statCard}>
                <TrendingUpIcon className={styles.statIcon} />
                <Typography variant="h3" className={styles.statValue}>6</Typography>
                <Typography variant="body2" className={styles.statLabel}>
                  {t("Home.statsMethods")}
                </Typography>
              </Box>
            </div>
            <div className="col-6 col-md-3">
              <Box className={styles.statCard}>
                <PeopleIcon className={styles.statIcon} />
                <Typography variant="h3" className={styles.statValue}>5K+</Typography>
                <Typography variant="body2" className={styles.statLabel}>
                  {t("Home.statsStudents")}
                </Typography>
              </Box>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <Container maxWidth="lg">
          <Box className={styles.sectionHeader}>
            <Typography variant="h3" className={styles.sectionTitle}>
              {t("Home.categories")}
            </Typography>
            <Link href="/categories" passHref>
              <Button variant="text" className={styles.viewAllBtn} endIcon={<ArrowForwardIcon />}>
                {t("Home.viewAllCategories")}
              </Button>
            </Link>
          </Box>
          <div className="row g-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div className="col-12 col-sm-6 col-md-4" key={category.id}>
                  <Link href={`/categories/${category.id}`} style={{ textDecoration: "none" }}>
                    <Card className={styles.categoryCard}>
                      <CardContent>
                        <Box className={styles.categoryIcon}>
                          <CategoryIcon fontSize="large" />
                        </Box>
                        <Typography variant="h6" className={styles.categoryTitle}>
                          {category.title}
                        </Typography>
                        {/* <Typography variant="body2" className={styles.categoryDescription}>
                          {category.description || "Explore problems in this category"}
                        </Typography> */}
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))
            ) : (
              learningMethods.map((method, index) => (
                <div className="col-12 col-sm-6 col-md-4" key={index}>
                  <Card className={styles.categoryCard}>
                    <CardContent>
                      <Box className={styles.categoryIcon} sx={{ color: method.color }}>
                        {method.icon}
                      </Box>
                      <Typography variant="h6" className={styles.categoryTitle}>
                        {method.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" className={styles.sectionTitle}>
              {t("Home.howItWorksTitle")}
            </Typography>
            <Typography variant="body1" className={styles.sectionSubtitle}>
              {t("Home.howItWorksDescription")}
            </Typography>
          </Box>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <Box className={styles.stepCard}>
                <Box className={styles.stepNumber}>1</Box>
                <Typography variant="h6" className={styles.stepTitle}>
                  {t("Home.step1Title")}
                </Typography>
                <Typography variant="body2" className={styles.stepDescription}>
                  {t("Home.step1Description")}
                </Typography>
              </Box>
            </div>
            <div className="col-12 col-md-4">
              <Box className={styles.stepCard}>
                <Box className={styles.stepNumber}>2</Box>
                <Typography variant="h6" className={styles.stepTitle}>
                  {t("Home.step2Title")}
                </Typography>
                <Typography variant="body2" className={styles.stepDescription}>
                  {t("Home.step2Description")}
                </Typography>
              </Box>
            </div>
            <div className="col-12 col-md-4">
              <Box className={styles.stepCard}>
                <Box className={styles.stepNumber}>3</Box>
                <Typography variant="h6" className={styles.stepTitle}>
                  {t("Home.step3Title")}
                </Typography>
                <Typography variant="body2" className={styles.stepDescription}>
                  {t("Home.step3Description")}
                </Typography>
              </Box>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className={styles.featuresSection}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" className={styles.sectionTitle}>
              {t("Home.featuresTitle")}
            </Typography>
            <Typography variant="body1" className={styles.sectionSubtitle}>
              {t("Home.featuresSubtitle")}
            </Typography>
          </Box>
          <div className="row g-3">
            {learningMethods.map((method, index) => (
              <div className="col-12 col-sm-6 col-md-4" key={index}>
                <Card className={styles.featureCard}>
                  <CardContent>
                    <Box className={styles.featureIcon} sx={{ color: method.color }}>
                      {method.icon}
                    </Box>
                    <Typography variant="h6" className={styles.featureTitle}>
                      {method.title}
                    </Typography>
                    <Box className={styles.featureCheck}>
                      <CheckCircleIcon fontSize="small" />
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" className={styles.sectionTitle}>
              {t("Home.testimonialsTitle")}
            </Typography>
            <Typography variant="body1" className={styles.sectionSubtitle}>
              {t("Home.testimonialsSubtitle")}
            </Typography>
          </Box>
          <Box className={styles.testimonialSlider}>
            <FormatQuoteIcon className={styles.quoteIcon} />
            <Typography variant="h6" className={styles.testimonialContent}>
              {testimonials[currentTestimonial].content}
            </Typography>
            <Typography variant="subtitle1" className={styles.testimonialName}>
              {testimonials[currentTestimonial].name}
            </Typography>
            <Typography variant="body2" className={styles.testimonialRole}>
              {testimonials[currentTestimonial].role}
            </Typography>
            <Box className={styles.testimonialControls}>
              <IconButton onClick={prevTestimonial} className={styles.testimonialBtn}>
                <KeyboardArrowLeftIcon />
              </IconButton>
              <Box className={styles.testimonialDots}>
                {testimonials.map((_, index) => (
                  <Box
                    key={index}
                    className={`${styles.dot} ${index === currentTestimonial ? styles.activeDot : ""}`}
                  />
                ))}
              </Box>
              <IconButton onClick={nextTestimonial} className={styles.testimonialBtn}>
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" className={styles.ctaTitle}>
              Ready to Master Mathematics?
            </Typography>
            <Typography variant="body1" className={styles.ctaSubtitle}>
              Start exploring our comprehensive problem library today
            </Typography>
            <Link href="/problems" passHref>
              <Button variant="contained" size="large" className={styles.ctaBtn} endIcon={<ArrowForwardIcon />}>
                Explore Problems
              </Button>
            </Link>
          </Box>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
