"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Container,
} from "@mui/material";
import { ArrowBack, Functions, Lightbulb, Info } from "@mui/icons-material";
import Loading1 from "@/app/Components/Frontend/Loading/Loading1";
import GoBack1 from "@/app/Components/Frontend/GoBack/GoBack1";

async function getProblemDetails(problemId) {
  try {
    const response = await fetch(`/api/v1/problem/${problemId}`, {
      cache: "no-store",
      headers: {
        "x-accept-language": "en",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch problem details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching problem details:", error);
    throw error;
  }
}

async function getSolution(problemId, inputs, lang) {
  try {
    const response = await fetch(`/api/v1/problem/solution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-accept-language": "bn",
      },
      body: JSON.stringify({
        id: problemId,
        inputs: inputs,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch solution");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching solution:", error);
    throw error;
  }
}

function SolutionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = searchParams.get("id");
  const [problemDetails, setProblemDetails] = useState(null);
  const [solutions, setSolutions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableInputs, setEditableInputs] = useState({});
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!problemId) {
        setError("No problem ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch problem details if not already loaded
        let details = problemDetails;
        if (!details) {
          details = await getProblemDetails(problemId);
          setProblemDetails(details);
        }

        // Fetch solution
        const solution = await getSolution(
          problemId,
          details.sampleInputs,
          "en",
        );
        setSolutions(solution);
        
        // Sync editable inputs with the solution's actual input values
        if (solution?.inputs) {
          const { labels, ...inputValues } = solution.inputs;
          setEditableInputs(inputValues);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [problemId]);

  const handleInputChange = (key, value) => {
    setEditableInputs(prev => ({
      ...prev,
      [key]: Number.parseFloat(value) || 0
    }));
  };

  const handleRecalculate = async () => {
    try {
      setCalculating(true);
      setError(null);
      const solution = await getSolution(problemId, editableInputs, "en");
      setSolutions(solution);
      
      // Sync editable inputs with the new solution's input values
      if (solution?.inputs) {
        const { labels, ...inputValues } = solution.inputs;
        setEditableInputs(inputValues);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (<Loading1 text="Calculating solution..." />);
  }

  if (error) {
    return (<GoBack1 title="Problem Not Found" message="The specified problem could not be found. Please check the problem ID and try again." />);
  }

  if (!solutions?.success) {
    return ( <GoBack1 title="Solution Error" message={solutions?.error?.message || "Failed to generate solution"} /> );
  }

  const { problem, inputs, solution, metadata } = solutions;

  return (
    <Container maxWidth="xl" className="py-5">
      {/* Back Button */}
      <Button
        variant="text"
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        className={styles.backButton}
      >
        Back to Problems
      </Button>

      <div className="row">
        <div className="col-sm-8">
          {/* Problem Card */}
          <Card className={`shadow-lg mb-4 ${styles.problemCard}`}>
            <CardContent className={styles.problemCardContent}>
              {problem?.type && (
                <Chip
                  icon={<Functions />}
                  label={problem.type}
                  className={styles.problemTypeChip}
                />
              )}

              <Typography variant="h4" className={styles.problemTitle}>
                {problemDetails?.title || "Math Problem"}
              </Typography>

              <Divider className={styles.problemDivider} />

              {/* Inputs Section */}
              <Typography variant="h6" className={styles.inputsTitle}>
                Given Values
              </Typography>
              <div className="row g-2">
                {Object.keys(inputs).map((key) => {
                  if (key === "labels") return null;

                  const label = inputs.labels?.[key] || key;

                  return (
                    <div className="col-12 col-sm-6 col-md-4" key={key}>
                      <Box className={`card h-100 ${styles.inputBox}`}>
                        <Typography
                          variant="caption"
                          className={styles.inputLabel}
                        >
                          {label}
                        </Typography>
                        <Typography variant="h6" className={styles.inputValue}>
                          {inputs[key]}
                        </Typography>
                      </Box>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Solution Section */}
          <Card className={`shadow-lg mb-4 ${styles.solutionCard}`}>
            <CardHeader
              avatar={<Lightbulb className={styles.solutionIcon} />}
              title={
                <Typography variant="h5" className={styles.solutionTitle}>
                  Step-by-Step Solution
                </Typography>
              }
              className={styles.solutionCardHeader}
            />
            <CardContent className={styles.solutionCardContent}>
              {/* Render HTML Solution */}
              {solution?.html && (
                <Box
                  className={styles.htmlSolution}
                  dangerouslySetInnerHTML={{ __html: solution.html }}
                />
              )}
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card className={`shadow-lg ${styles.metadataCard}`}>
            <CardHeader
              avatar={<Info className={styles.metadataIcon} />}
              title={
                <Typography variant="h6" className={styles.metadataTitle}>
                  Solution Information
                </Typography>
              }
              className={styles.metadataCardHeader}
            />
            <CardContent>
              <div className="row g-3">
                <div className="col-12 col-sm-6 col-md-3">
                  <Typography
                    variant="caption"
                    className={styles.metadataLabel}
                  >
                    Solver
                  </Typography>
                  <Typography variant="body1" className={styles.metadataValue}>
                    {metadata?.solverId || "N/A"}
                  </Typography>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Typography
                    variant="caption"
                    className={styles.metadataLabel}
                  >
                    Method
                  </Typography>
                  <Typography variant="body1" className={styles.metadataValue}>
                    {metadata?.calculationMethod || "N/A"}
                  </Typography>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Typography
                    variant="caption"
                    className={styles.metadataLabel}
                  >
                    Formula
                  </Typography>
                  <Typography variant="body1" className={styles.metadataValue}>
                    {solution?.workingFormula || "N/A"}
                  </Typography>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                  <Typography
                    variant="caption"
                    className={styles.metadataLabel}
                  >
                    Generated
                  </Typography>
                  <Typography variant="body1" className={styles.metadataValue}>
                    {metadata?.timestamp
                      ? new Date(metadata.timestamp).toLocaleString()
                      : "N/A"}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-sm-4">
          {/* Input Controls Card */}
          <Card className={`shadow-lg sticky-top ${styles.controlsCard}`}>
            <CardHeader
              avatar={<Functions className={styles.controlsIcon} />}
              title={
                <Typography variant="h6" className={styles.controlsTitle}>
                  Adjust Values
                </Typography>
              }
              className={styles.controlsCardHeader}
            />
            <CardContent>
              <Typography variant="body2" className={styles.controlsDescription}>
                Modify the input values below and click calculate to see the updated solution.
              </Typography>
              
              <div className="mt-3">
                {problemDetails?.inputs?.map((input) => (
                  <div key={input.key} className="mb-3">
                    <label htmlFor={input.key} className={styles.inputFieldLabel}>
                      {input.label}
                    </label>
                    <input
                      id={input.key}
                      type="number"
                      className={`form-control ${styles.inputField}`}
                      value={editableInputs[input.key] || ''}
                      onChange={(e) => handleInputChange(input.key, e.target.value)}
                      min={input.min}
                      max={input.max}
                      required={input.required}
                      disabled={calculating}
                    />
                    {input.min !== null && input.max !== null && (
                      <small className={styles.inputHint}>
                        Range: {input.min} - {input.max}
                      </small>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="contained"
                  fullWidth
                  className={styles.calculateButton}
                  onClick={handleRecalculate}
                  disabled={calculating}
                  startIcon={calculating ? <CircularProgress size={20} /> : <Lightbulb />}
                >
                  {calculating ? 'Calculating...' : 'Calculate Solution'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default SolutionPage;
