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
import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import { useTranslations } from "./ClientLayout";

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

const learningMethods = [
  {
    title: "Step-by-Step",
    icon: <AutoStoriesIcon />,
    color: "#3a7bff",
  },
  {
    title: "Quick Solution",
    icon: <FlashOnIcon />,
    color: "#17b6ff",
  },
  {
    title: "Shortcuts",
    icon: <InsightsIcon />,
    color: "#ff6b9d",
  },
  {
    title: "Visualization",
    icon: <VisibilityIcon />,
    color: "#ffb800",
  },
  {
    title: "Formula Based",
    icon: <FunctionsIcon />,
    color: "#00d4aa",
  },
  {
    title: "Practice Mode",
    icon: <BoltIcon />,
    color: "#a855f7",
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
  const translations = useTranslations();
  const [categories, setCategories] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [floatingOffset, setFloatingOffset] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/v1/category");
        if (response.ok) {
          const data = await response.json();
          setCategories(data?.categories?.slice(0, 6) || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
    <div className={styles.pageWrapper}>
      <Navbar translations={translations.Navbar} />

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
              {translations.Home?.heroTitle || "Master Math with Interactive Learning"}
            </Typography>
            <Typography variant="h6" className={styles.heroSubtitle}>
              {translations.Home?.heroSubtitle || "Explore step-by-step solutions, shortcuts, and visual methods to excel in mathematics"}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className={styles.heroButtons}>
              <Link href="/problems" passHref>
                <Button variant="contained" size="large" className={styles.primaryBtn} endIcon={<ArrowForwardIcon />}>
                  {translations.Home?.getStarted || "Get Started"}
                </Button>
              </Link>
              <Link href="/categories" passHref>
                <Button variant="outlined" size="large" className={styles.secondaryBtn}>
                  {translations.Home?.exploreCategories || "Explore Categories"}
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
                  {translations.Home?.statsProblems || "Problems Solved"}
                </Typography>
              </Box>
            </div>
            <div className="col-6 col-md-3">
              <Box className={styles.statCard}>
                <CategoryIcon className={styles.statIcon} />
                <Typography variant="h3" className={styles.statValue}>12+</Typography>
                <Typography variant="body2" className={styles.statLabel}>
                  {translations.Home?.statsCategories || "Categories"}
                </Typography>
              </Box>
            </div>
            <div className="col-6 col-md-3">
              <Box className={styles.statCard}>
                <TrendingUpIcon className={styles.statIcon} />
                <Typography variant="h3" className={styles.statValue}>6</Typography>
                <Typography variant="body2" className={styles.statLabel}>
                  {translations.Home?.statsMethods || "Learning Methods"}
                </Typography>
              </Box>
            </div>
            <div className="col-6 col-md-3">
              <Box className={styles.statCard}>
                <PeopleIcon className={styles.statIcon} />
                <Typography variant="h3" className={styles.statValue}>5K+</Typography>
                <Typography variant="body2" className={styles.statLabel}>
                  {translations.Home?.statsStudents || "Active Learners"}
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
              {translations.Home?.categories || "Math Categories"}
            </Typography>
            <Link href="/categories" passHref>
              <Button variant="text" className={styles.viewAllBtn} endIcon={<ArrowForwardIcon />}>
                {translations.Home?.viewAllCategories || "View All"}
              </Button>
            </Link>
          </Box>
          <div className="row g-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div className="col-12 col-sm-6 col-md-4" key={category._id}>
                  <Link href={`/categories/${category._id}`} style={{ textDecoration: "none" }}>
                    <Card className={styles.categoryCard}>
                      <CardContent>
                        <Box className={styles.categoryIcon}>
                          <CategoryIcon fontSize="large" />
                        </Box>
                        <Typography variant="h6" className={styles.categoryTitle}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" className={styles.categoryDescription}>
                          {category.description || "Explore problems in this category"}
                        </Typography>
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
              {translations.Home?.howItWorksTitle || "How It Works"}
            </Typography>
            <Typography variant="body1" className={styles.sectionSubtitle}>
              {translations.Home?.howItWorksDescription || "Learn math the smart way"}
            </Typography>
          </Box>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <Box className={styles.stepCard}>
                <Box className={styles.stepNumber}>1</Box>
                <Typography variant="h6" className={styles.stepTitle}>
                  {translations.Home?.step1Title || "Choose a Problem"}
                </Typography>
                <Typography variant="body2" className={styles.stepDescription}>
                  {translations.Home?.step1Description || "Browse through various math categories"}
                </Typography>
              </Box>
            </div>
            <div className="col-12 col-md-4">
              <Box className={styles.stepCard}>
                <Box className={styles.stepNumber}>2</Box>
                <Typography variant="h6" className={styles.stepTitle}>
                  {translations.Home?.step2Title || "Select Method"}
                </Typography>
                <Typography variant="body2" className={styles.stepDescription}>
                  {translations.Home?.step2Description || "Pick from multiple solution approaches"}
                </Typography>
              </Box>
            </div>
            <div className="col-12 col-md-4">
              <Box className={styles.stepCard}>
                <Box className={styles.stepNumber}>3</Box>
                <Typography variant="h6" className={styles.stepTitle}>
                  {translations.Home?.step3Title || "Learn & Practice"}
                </Typography>
                <Typography variant="body2" className={styles.stepDescription}>
                  {translations.Home?.step3Description || "Follow detailed steps"}
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
              {translations.Home?.featuresTitle || "Why Choose MLP?"}
            </Typography>
            <Typography variant="body1" className={styles.sectionSubtitle}>
              {translations.Home?.featuresSubtitle || "Everything you need to excel"}
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
              {translations.Home?.testimonialsTitle || "What Students Say"}
            </Typography>
            <Typography variant="body1" className={styles.sectionSubtitle}>
              {translations.Home?.testimonialsSubtitle || "Join thousands of learners"}
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

      <Footer translations={translations.Footer} />
    </div>
  );
}
