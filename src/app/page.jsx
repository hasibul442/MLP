"use client";

import styles from "./page.module.css";
import { Box, Button, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

const highlights = [
  {
    title: "Step-by-Step Solver",
    description:
      "Break down every equation with clean, guided steps so students can understand the method, not only the answer.",
    icon: <AutoStoriesRoundedIcon fontSize="small" />,
  },
  {
    title: "Instant Practice Mode",
    description:
      "Generate fresh problem sets by category and difficulty to turn weak spots into strengths quickly.",
    icon: <FlashOnRoundedIcon fontSize="small" />,
  },
  {
    title: "Progress Insights",
    description:
      "Track solved problems and trends over time to focus on the concepts that need the most attention.",
    icon: <InsightsRoundedIcon fontSize="small" />,
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Container maxWidth="lg" className="py-5">
        <main className={styles.main}>
          <section className="row align-items-center g-4 g-lg-5 mb-4 mb-lg-5">
            <div className="col-12 col-lg-7">
              <Chip label="MathSolver Platform" className={styles.badge} />
              <Typography variant="h2" component="h1" className={styles.heroTitle}>
                Learn Math Faster With A Smarter Study Experience
              </Typography>
              <Typography variant="body1" className={styles.heroText}>
                MathSolver helps students solve problems step-by-step, practice by topic, and grow confidence with real-time
                progress feedback.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="mt-4">
                <Button variant="contained" size="large" className={styles.primaryBtn}>
                  Start Solving
                </Button>
                <Button variant="outlined" size="large" className={styles.secondaryBtn}>
                  Explore Problems
                </Button>
              </Stack>
            </div>

            <div className="col-12 col-lg-5">
              <Card elevation={0} className={styles.heroCard}>
                <CardContent className="p-4 p-md-5">
                  <Typography variant="h6" className={styles.cardHeading}>
                    Today&apos;s Progress
                  </Typography>
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <Typography variant="h4" className={styles.statValue}>
                        248
                      </Typography>
                      <Typography variant="caption" className={styles.statLabel}>
                        Problems Solved
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h4" className={styles.statValue}>
                        92%
                      </Typography>
                      <Typography variant="caption" className={styles.statLabel}>
                        Accuracy
                      </Typography>
                    </div>
                  </div>

                  <Box className={styles.progressTrack}>
                    <Box className={styles.progressFill} />
                  </Box>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="row g-4 mt-1">
            {highlights.map((item) => (
              <div className="col-12 col-md-6 col-lg-4" key={item.title}>
                <Card elevation={0} className={styles.featureCard}>
                  <CardContent>
                    <div className={styles.featureIcon}>{item.icon}</div>
                    <Typography variant="h6" className={styles.featureTitle}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" className={styles.featureDescription}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </section>
        </main>
      </Container>
    </div>
  );
}
