"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import { interpolateTemplate } from "@/utils/helper/admin/helper";
import { handleArrayItemChange, handleArrayLengthChange, handleInputNumberChange, } from "@/utils/helper/admin/inputFormHandleHelper";
import PageHeroTitle from "@/app/Components/Admin/PageHeroTitle";
import Loading from "@/app/Components/Admin/Loading/Loading";
import ItemNotFound from "@/app/Components/Admin/NotFound/ItemNotFound";
import DetailItem from "@/app/Components/Admin/Card/DetailItem";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/v1/problem/${id}`);
        const data = await res.json();
        setProblem(data);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
        setProblem(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProblem();
    }
  }, [id]);

  let content;
  if (loading) {
    content = <Loading text="Loading problem details..." />;
  } else if (!problem || problem.error) {
    content = <ItemNotFound message={problem?.error || "Problem not found."} />;
  } else {
    content = (
      <>
        <Box className={styles.detailGrid}>
          <DetailItem
            label="Problem Type"
            value={
              problem.problemType?.title?.en || problem.problemType?.slug || "-"
            }
          />

          <DetailItem
            label="Status"
            value={
              <span className={styles.pill}>
                {problem.isActive ? "Active" : "Inactive"}
              </span>
            }
          />

          <DetailItem label="Inputs" value={problem.inputs?.length ?? 0} />

          <DetailItem
            label="Created"
            value={
              problem.createdAt
                ? new Date(problem.createdAt).toLocaleDateString()
                : "-"
            }
          />
        </Box>

        <Box className="mt-4">
          <Typography className={styles.sectionTitle}>Template (EN)</Typography>
          <Typography className={styles.sectionTest}>
            {interpolateTemplate(problem.template?.en, problem.sampleInputs)}
          </Typography>
        </Box>

        <Box className="mt-3">
          <Typography className={styles.sectionTitle}>Template (BN)</Typography>
          <Typography className={styles.sectionTest}>
            {interpolateTemplate(problem.template?.bn, problem.sampleInputs)}
          </Typography>
        </Box>
        <Box className="mt-3">
          <Typography className={styles.sectionTitle}>
            Description (EN)
          </Typography>
          <Typography className={styles.sectionTest}>
            {problem.description?.en || "-"}
          </Typography>
        </Box>
        <Box className="mt-3">
          <Typography className={styles.sectionTitle}>
            Description (BN)
          </Typography>
          <Typography className={styles.sectionTest}>
            {problem.description?.bn || "-"}
          </Typography>
        </Box>
        <Box className="mt-3">
          <Typography className={styles.sectionTitle}>Inputs</Typography>
          {problem.inputs?.length ? (
            problem.inputs.map((input, index) => (
              <Box key={`${input.key}-${index}`} className="mt-3">
                <Typography className={styles.sectionTitle}>
                  Input {index + 1}
                </Typography>
                <Box className={styles.detailGrid}>
                  <DetailItem label="Key" value={input.key || "-"} />

                  <DetailItem label="Type" value={input.type || "-"} />
                  <DetailItem
                    label="Label (EN)"
                    value={input.label?.en || "-"}
                  />
                  <DetailItem
                    label="Label (BN)"
                    value={input.label?.bn || "-"}
                  />
                  {input.type === "array" &&
                    (() => {
                      const sampleArray = Array.isArray(
                        problem.sampleInputs?.[input.key],
                      )
                        ? problem.sampleInputs[input.key]
                        : [];

                      return (
                        <>
                          <DetailItem
                            label="Item Type"
                            value={input.itemType || "-"}
                          />

                          <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>Min Items</div>
                            <input
                              className={styles.inlineInput}
                              type="number"
                              value={input.minItems ?? ""}
                              onChange={(event) =>
                                setProblem((prev) =>
                                  handleInputNumberChange(
                                    prev,
                                    index,
                                    "minItems",
                                    event.target.value,
                                  ),
                                )
                              }
                            />
                          </div>
                          <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>Max Items</div>
                            <input
                              className={styles.inlineInput}
                              type="number"
                              value={input.maxItems ?? ""}
                              onChange={(event) =>
                                setProblem((prev) =>
                                  handleInputNumberChange(
                                    prev,
                                    index,
                                    "maxItems",
                                    event.target.value,
                                  ),
                                )
                              }
                            />
                          </div>
                          <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>
                              Items Count
                            </div>
                            <input
                              className={styles.inlineInput}
                              type="number"
                              value={sampleArray.length}
                              onChange={(event) =>
                                setProblem((prev) =>
                                  handleArrayLengthChange(
                                    prev,
                                    input.key,
                                    event.target.value,
                                  ),
                                )
                              }
                            />
                          </div>
                          {sampleArray.length > 0 && (
                            <div className={styles.itemsGrid}>
                              {sampleArray.map((item, itemIndex) => (
                                <div
                                  key={`${input.key}-item-${itemIndex}`}
                                  className={styles.itemField}
                                >
                                  <div className={styles.itemLabel}>
                                    Item {itemIndex + 1}
                                  </div>
                                  <input
                                    className={styles.inlineInput}
                                    type={
                                      input.itemType === "number"
                                        ? "number"
                                        : "text"
                                    }
                                    value={item ?? ""}
                                    onChange={(event) =>
                                      setProblem((prev) =>
                                        handleArrayItemChange(
                                          prev,
                                          input.key,
                                          itemIndex,
                                          input.itemType,
                                          event.target.value,
                                        ),
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  {input.type === "number" && (
                    <>
                      <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Min</div>
                        <input
                          className={styles.inlineInput}
                          type="number"
                          value={input.min ?? ""}
                          onChange={(event) =>
                            setProblem((prev) =>
                              handleInputNumberChange(
                                prev,
                                index,
                                "min",
                                event.target.value,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>Max</div>
                        <input
                          className={styles.inlineInput}
                          type="number"
                          value={input.max ?? ""}
                          onChange={(event) =>
                            setProblem((prev) =>
                              handleInputNumberChange(
                                prev,
                                index,
                                "max",
                                event.target.value,
                              ),
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                  <DetailItem
                    label="Required"
                    value={input.required ? "Yes" : "No"}
                  />
                </Box>
              </Box>
            ))
          ) : (
            <Typography className={styles.detailValue}>-</Typography>
          )}
        </Box>
        <Box className="mt-3">
          <Typography className={styles.sectionTitle}>Sample Inputs</Typography>
          <pre className={styles.jsonBlock}>
            {JSON.stringify(problem.sampleInputs, null, 2)}
          </pre>
        </Box>
      </>
    );
  }

  return (
    <div>
      <Container maxWidth="lg" className="py-5">
        <main className={styles.main}>
          <section className="row g-4 align-items-stretch mb-4 mb-lg-5">
            <div className="col-12 col-lg-12">
              <PageHeroTitle
                label="Admin Workspace"
                title="Problem Details"
                description="Review the selected problem definition, templates, and inputs."
              />

              <Box className="mt-3">
                <Button
                  variant="outlined"
                  size="small"
                  className={styles.secondaryBtn}
                  component={Link}
                  href="/admin/problem/list"
                >
                  Back to list
                </Button>
              </Box>
            </div>

            <div className="col-12 col-lg-12">
              <Card elevation={0} className={styles.card}>
                <CardContent className="p-4 p-md-5">{content}</CardContent>
              </Card>
            </div>
          </section>
        </main>
      </Container>
    </div>
  );
}
