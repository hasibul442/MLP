"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import Link from "next/link";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import Cookies from "js-cookie";
import styles from "./Navbar.module.css";

export default function Navbar({ translations }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const savedLang = Cookies.get("language") || "en";
    setCurrentLang(savedLang);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    Cookies.set("language", lang, { expires: 365 });
    handleCloseLangMenu();
    globalThis.location.reload();
  };

  const navLinks = [
    { title: translations?.home || "Home", path: "/" },
    { title: translations?.categories || "Categories", path: "/categories" },
    { title: translations?.problems || "Problems", path: "/problems" },
  ];

  return (
    <AppBar position="sticky" className={styles.navbar} elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters className={styles.toolbar}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Box className={styles.logo}>
              <SchoolIcon fontSize="large" className={styles.logoIcon} />
              <Typography variant="h6" className={styles.logoText}>
                MLP
              </Typography>
            </Box>
          </Link>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              className={styles.menuIcon}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {navLinks.map((link) => (
                <MenuItem key={link.title} onClick={handleCloseNavMenu}>
                  <Link href={link.path} style={{ textDecoration: "none", color: "inherit", width: "100%" }}>
                    <Typography sx={{ textAlign: "center" }}>{link.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}
          >
            {navLinks.map((link) => (
              <Link key={link.title} href={link.path} passHref>
                <Button className={styles.navLink}>{link.title}</Button>
              </Link>
            ))}
          </Stack>

          {/* Language Selector */}
          <Box>
            <IconButton
              onClick={handleOpenLangMenu}
              className={styles.langButton}
              size="medium"
            >
              <LanguageIcon />
              <Typography variant="body2" sx={{ ml: 0.5, textTransform: "uppercase" }}>
                {currentLang}
              </Typography>
            </IconButton>
            <Menu
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem
                onClick={() => handleLanguageChange("en")}
                selected={currentLang === "en"}
              >
                English
              </MenuItem>
              <MenuItem
                onClick={() => handleLanguageChange("bn")}
                selected={currentLang === "bn"}
              >
                বাংলা
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
