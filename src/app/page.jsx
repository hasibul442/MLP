"use client";

import styles from "./page.module.css";
import { Box, Button, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

const highlights = [
  {
    title: "Step-by-Step Solver",
    description:
      "See complete solved math with each step explained in simple educational language.",
    icon: <AutoStoriesRoundedIcon fontSize="small" />,
  },
  {
    title: "Quick Solution Way",
    description:
      "Learn the fastest valid method to reach the answer when time matters most.",
    icon: <FlashOnRoundedIcon fontSize="small" />,
  },
  {
    title: "Shortcut Method",
    description:
      "Discover smart shortcut techniques for algebra, arithmetic, and exam-style questions.",
    icon: <InsightsRoundedIcon fontSize="small" />,
  },
  {
    title: "Visualization Way",
    description:
      "Understand concepts through visual breakdowns so formulas and patterns become easier to remember.",
    icon: <VisibilityRoundedIcon fontSize="small" />,
  },
  {
    title: "Formula-Focused Learning",
    description:
      "Access clear formula-based solving paths for each topic with where and when to use them.",
    icon: <FunctionsRoundedIcon fontSize="small" />,
  },
  {
    title: "Read-Only Education Content",
    description:
      "Students only view guided solutions and learning methods in a focused, distraction-free experience.",
    icon: <BoltRoundedIcon fontSize="small" />,
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Container maxWidth="lg" className="py-5">
        <main className={styles.main}>
          <section className="row align-items-center g-4 g-lg-5 mb-4 mb-lg-5">
            <div className="col-12 col-lg-7">
              <Chip label="Education Mode" className={styles.badge} />
              <Typography variant="h2" component="h1" className={styles.heroTitle}>
                Solved Math and Smart Methods for Better Learning
              </Typography>
              <Typography variant="body1" className={styles.heroText}>
                This platform is built for education purposes where users can view solved math, quick math solution ways,
                shortcut methods, and visualization-based explanations.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className="mt-4">
                <Button variant="contained" size="large" className={styles.primaryBtn}>
                  View Solved Math
                </Button>
                <Button variant="outlined" size="large" className={styles.secondaryBtn}>
                  Explore Learning Ways
                </Button>
              </Stack>
            </div>

            <div className="col-12 col-lg-5">
              <Card elevation={0} className={styles.heroCard}>
                <CardContent className="p-4 p-md-5">
                  <Typography variant="h6" className={styles.cardHeading}>
                    Learning Library Snapshot
                  </Typography>
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <Typography variant="h4" className={styles.statValue}>
                        480+
                      </Typography>
                      <Typography variant="caption" className={styles.statLabel}>
                        Solved Examples
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h4" className={styles.statValue}>
                        6
                      </Typography>
                      <Typography variant="caption" className={styles.statLabel}>
                        Learning Ways
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
