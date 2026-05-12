"use client";

import { Box, Container, Typography, Stack, IconButton, Divider } from "@mui/material";
import Link from "next/link";
import SchoolIcon from "@mui/icons-material/School";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import styles from "./Footer.module.css";

export default function Footer({ translations }) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { title: translations?.categories || "Categories", path: "/categories" },
      { title: translations?.problems || "Problems", path: "/problems" },
      { title: translations?.solutions || "Solutions", path: "/problems/solution" },
    ],
    resources: [
      { title: translations?.about || "About Us", path: "/about" },
      { title: translations?.contact || "Contact", path: "/contact" },
      { title: translations?.faq || "FAQ", path: "/faq" },
    ],
  };

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <div className="row g-4 py-5">
          {/* Brand Section */}
          <div className="col-12 col-md-4">
            <Box className={styles.brandSection}>
              <Box className={styles.logo}>
                <SchoolIcon fontSize="large" className={styles.logoIcon} />
                <Typography variant="h6" className={styles.logoText}>
                  MLP
                </Typography>
              </Box>
              <Typography variant="body2" className={styles.description}>
                {translations?.footerDescription ||
                  "Your trusted companion for mastering mathematics through interactive learning and comprehensive problem-solving."}
              </Typography>
              <Stack direction="row" spacing={1} className="mt-3">
                <IconButton className={styles.socialIcon} size="small">
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton className={styles.socialIcon} size="small">
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton className={styles.socialIcon} size="small">
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton className={styles.socialIcon} size="small">
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          </div>

          {/* Platform Links */}
          <div className="col-6 col-md-3">
            <Typography variant="h6" className={styles.footerHeading}>
              {translations?.platform || "Platform"}
            </Typography>
            <Stack spacing={1.5} className="mt-3">
              {footerLinks.platform.map((link) => (
                <Link key={link.title} href={link.path} className={styles.footerLink}>
                  {link.title}
                </Link>
              ))}
            </Stack>
          </div>

          {/* Resources Links */}
          <div className="col-6 col-md-3">
            <Typography variant="h6" className={styles.footerHeading}>
              {translations?.resources || "Resources"}
            </Typography>
            <Stack spacing={1.5} className="mt-3">
              {footerLinks.resources.map((link) => (
                <Link key={link.title} href={link.path} className={styles.footerLink}>
                  {link.title}
                </Link>
              ))}
            </Stack>
          </div>

          {/* Newsletter (Optional) */}
          <div className="col-12 col-md-2">
            <Typography variant="h6" className={styles.footerHeading}>
              {translations?.legal || "Legal"}
            </Typography>
            <Stack spacing={1.5} className="mt-3">
              <Link href="/privacy" className={styles.footerLink}>
                {translations?.privacy || "Privacy"}
              </Link>
              <Link href="/terms" className={styles.footerLink}>
                {translations?.terms || "Terms"}
              </Link>
            </Stack>
          </div>
        </div>

        <Divider className={styles.divider} />

        <Box className={styles.copyright}>
          <Typography variant="body2" className={styles.copyrightText}>
            © {currentYear} MLP. {translations?.rightsReserved || "All rights reserved."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
