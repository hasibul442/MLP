"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Modal,
  Chip,
} from "@mui/material";
import PageHeroTitle from "@/app/Components/Admin/PageHeroTitle";
import Link from "next/link";
import PromptTextBlock from "./PromptTextBlock";
import { interpolateTemplate } from "@/utils/helper/admin/helper";

function Page() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState({});
  const [solution, setSolution] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const fetchPrompt = async () => {
    try {
      const res = await fetch(`/api/v1/prompt/${id}`);
      const data = await res.json();
      setPrompt(data);
    } catch (error) {
      console.error("Failed to fetch prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolution = async () => {
    try {
      const res = await fetch(`/api/v1/problem/solution/${id}`);
      const data = await res.json();
      setSolution(data);
    } catch (error) {
      console.error("Failed to fetch solution:", error);
    }
  };

  const fetchProblem = async () => {
    try {
      const res = await fetch(`/api/v1/problem/${id}`);
      const data = await res.json();
      setProblem(data);
    } catch (error) {
      console.error("Failed to fetch problem:", error);
    }
  }

  useEffect(() => {
    fetchPrompt();
    fetchSolution();
    fetchProblem();
  }, [id]);

  return (
    <div>
      <Container maxWidth="xl" className="py-5">
        <main className={styles.main}>
          <section className="row g-4 align-items-stretch mb-4 mb-lg-5">
            <div className="col-12 col-lg-12">
              <h4><b>{interpolateTemplate(problem?.template?.en, problem?.sampleInputs)}</b></h4>
              <h6>{problem?.description?.en}</h6>
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

                <Button
                  variant="contained"
                  size="small"
                  className={` ms-2`}
                  onClick={handleOpenModal}
                >
                  Modify Solution
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  className={` ms-2`}
                  // onClick={handleOpenModal}
                >
                  Verify Solution
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  className={` ms-2`}
                  // onClick={handleOpenModal}
                >
                  Genarate Solution
                </Button>
              </Box>
            </div>

            <div className="col-3 col-lg-3">
              <Card elevation={0} className={styles.card}>
                <CardContent className="p-3">
                  {loading ? (
                    <Typography variant="body1" gutterBottom>
                      Loading...
                    </Typography>
                  ) : (
                    <Box>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          Input Fields
                        </Typography>
                        {problem?.inputs && problem.inputs.length > 0 ? (
                          <div className="row g-3">
                            {problem.inputs.map((input, index) => (
                              <div className="col-md-12" key={input.key || index}>
                                <Card 
                                  elevation={0} 
                                  sx={{ 
                                    height: '100%',
                                    border: '2px solid',
                                    borderColor: 'primary.main',
                                    borderRadius: 2,
                                    backgroundColor: 'background.paper',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                      boxShadow: '0 8px 16px rgba(25, 118, 210, 0.15)',
                                    }
                                  }}
                                >
                                  <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'flex-start', 
                                      mb: 2 
                                    }}>
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          fontWeight: 700, 
                                          color: "primary.main",
                                          fontSize: '1.1rem',
                                          fontFamily: 'monospace'
                                        }}
                                      >
                                        {input.key}
                                      </Typography>
                                      <Chip 
                                        label={input.type} 
                                        size="small" 
                                        color="primary" 
                                        sx={{ 
                                          fontWeight: 600,
                                          fontSize: '0.75rem'
                                        }}
                                      />
                                    </Box>
                                    
                                    <Box sx={{ mb: 2, backgroundColor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
                                      <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', lineHeight: 1.6 }}>
                                        <strong style={{ color: '#666' }}>EN:</strong> <span style={{ color: '#000' }}>{input.label?.en || "N/A"}</span>
                                      </Typography>
                                      
                                      <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                                        <strong style={{ color: '#666' }}>BN:</strong> <span style={{ color: '#000' }}>{input.label?.bn || "N/A"}</span>
                                      </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                      {input.min !== null && input.min !== undefined && (
                                        <Chip 
                                          label={`Min: ${input.min}`} 
                                          size="small" 
                                          sx={{ 
                                            backgroundColor: '#e3f2fd',
                                            color: '#1565c0',
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                          }}
                                        />
                                      )}
                                      {input.max !== null && input.max !== undefined && (
                                        <Chip 
                                          label={`Max: ${input.max}`} 
                                          size="small" 
                                          sx={{ 
                                            backgroundColor: '#e3f2fd',
                                            color: '#1565c0',
                                            fontWeight: 500,
                                            fontSize: '0.75rem'
                                          }}
                                        />
                                      )}
                                      {input.required && (
                                        <Chip 
                                          label="Required" 
                                          size="small" 
                                          sx={{ 
                                            backgroundColor: '#ffebee',
                                            color: '#c62828',
                                            fontWeight: 600,
                                            fontSize: '0.75rem'
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </CardContent>
                                </Card>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No input fields configured.
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                    
                </CardContent>
              </Card> 
            </div>
            <div className="col-6 col-lg-6">
              <Card elevation={0} className={`${styles.card}`}>
                <CardContent className="p-3">
                  {loading ? (
                    <Typography variant="body1" gutterBottom>
                      Loading...
                    </Typography>
                  ) : (
                    <Box>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                         Solution Content
                        </Typography>
                        {solution.status === "success" ? (
                          <div className="row g-3">
                            <div className="col-12 col-md-6">
                              <Card elevation={1} sx={{ border: '1px solid #e0e0e0' }}>
                                <CardContent>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                                    English Solution
                                  </Typography>
                                  {solution?.data?.solutionEn ? (
                                    <Box
                                      sx={{
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word",
                                        fontFamily: "monospace",
                                        fontSize: "0.875rem",
                                        color: "#ffffff",
                                        padding: 2,
                                        borderRadius: 1,
                                        overflowY: "auto",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      {JSON.stringify(solution.data.solutionEn, null, 2)}
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      No English solution available
                                    </Typography>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                            <div className="col-12 col-md-6">
                              <Card elevation={1} sx={{ border: '1px solid #e0e0e0' }}>
                                <CardContent>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                                    Bengali Solution
                                  </Typography>
                                  {solution?.data?.solutionBn ? (
                                    <Box
                                      sx={{
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word",
                                        fontFamily: "monospace",
                                        fontSize: "0.875rem",
                                        color: "#ffffff",
                                        padding: 2,
                                        borderRadius: 1,
                                        overflowY: "auto",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      {JSON.stringify(solution.data.solutionBn, null, 2)}
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      No Bengali solution available
                                    </Typography>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        ) : (
                          <Typography variant="body1" color="error" gutterBottom>
                            {solution.message || "An error occurred."}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                    
                </CardContent>
              </Card>
            </div>
            <div className="col-3 col-lg-3">
              <Card elevation={0} className={styles.card}>
                <CardContent className="p-3">
                  <Typography variant="p" gutterBottom>
                    Generated Prompt
                  </Typography>
                  {loading ? (
                    <Typography variant="body1" gutterBottom>
                      Loading...
                    </Typography>
                  ) : prompt.status === "success" ? (
                    <PromptTextBlock prompt={prompt.data} />
                  ) : prompt.status === "info" ? (
                    <Typography variant="body1" color="info.main" gutterBottom>
                      {prompt.message || "No prompt found."}
                    </Typography>
                  ) : prompt.status === "error" ? (
                    <Typography variant="body1" color="error" gutterBottom>
                      {prompt.message || "An error occurred."}
                    </Typography>
                  ) : (
                    <Typography variant="body1" gutterBottom>
                      No prompt available.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modify-solution-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
              maxHeight: "90vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
              overflow: "auto",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Modify Solution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Make changes to the solution content here.
            </Typography>
            
            {/* Add your solution editing form here */}
            <Box sx={{ mb: 3 }}>
              {/* Solution form content */}
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleCloseModal}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </div>
  );
}

export default Page;
