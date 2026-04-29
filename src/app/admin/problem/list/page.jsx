"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Loading from "@/app/Components/Admin/Loading/Loading";
import ItemNotFound from "@/app/Components/Admin/NotFound/ItemNotFound";
import PageHeroTitle from "@/app/Components/Admin/PageHeroTitle";
import { interpolateTemplate } from "@/utils/helper/admin/helper";

export default function ProblemListPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProblems() {
    try {
      const res = await fetch("/api/v1/problem");
      const data = await res.json();
      setProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  let listContent;
  if (loading) {
    listContent = <Loading text="Loading problems..." />;
  } else if (problems.length === 0) {
    listContent = <ItemNotFound message="No problems found yet." />;
  } else {
    listContent = (
      <TableContainer className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Problem Type</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem._id}>
                <TableCell>
                  <span className={styles.code}>
                    {problem.problemType?.title?.en || "-"} 
					({problem.problemType?.title?.bn || "N/A"})
                  </span>
                </TableCell>
                {/* <TableCell>{problem.template?.en || "-"}</TableCell> */}
                <TableCell>
                  {interpolateTemplate(
                    problem.template?.en,
                    problem.sampleInputs,
                  )}{" "}
                  <br />
                  <br />
                  <small>
                    {interpolateTemplate(
                      problem.template?.bn,
                      problem.sampleInputs,
                    )}
                  </small>
                </TableCell>
                <TableCell>
                  <span className={styles.pill}>
                    {problem.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {problem.createdAt
                    ? new Date(problem.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <IconButton
                    className={styles.secondaryBtn}
                    component={Link}
                    href={`/admin/problem/${problem._id}`}
                    aria-label="View problem"
                    size="small"
                  >
                    <AddRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <div>
      <Container maxWidth="xl" className="py-5">
        <main className={styles.main}>
          <section className="row g-4 align-items-stretch mb-4 mb-lg-5">
            <div className="col-12 col-lg-12">
              <PageHeroTitle
                label="Admin Workspace"
                title="Problem List"
                description="Review created problems and verify templates, inputs, and status."
              />
            </div>

            <div className="col-12 col-lg-12">
              <Card elevation={0} className={styles.card}>
                <CardContent className="p-4 p-md-5">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <Typography variant="h6" className={styles.cardHeading}>
                      All Problems
                    </Typography>
                    <Box className="d-flex align-items-center gap-2">
                      <IconButton
                        className={styles.secondaryBtn}
                        component={Link}
                        href="/admin/problem"
                        aria-label="Add problem"
                        size="small"
                      >
                        <AddRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        className={styles.secondaryBtn}
                        onClick={fetchProblems}
                        disabled={loading}
                        aria-label="Refresh list"
                        size="small"
                      >
                        <RefreshRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </div>
                  <Box className="mt-4">{listContent}</Box>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </Container>
    </div>
  );
}
