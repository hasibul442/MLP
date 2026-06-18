import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ArrowBack, Functions, Lightbulb, Info } from "@mui/icons-material";
import styles from "./page.module.css";

function SolutionTab({ solution }) {
  const [value, setValue] = useState("1");
  const solutionData = solution?.solution || {};

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Step-by-Step Solution" value="1" />
              <Tab label="Shortcut Formula" value="2" />
              <Tab label="Detailed Explanation" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
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
                {solutionData?.steps && Array.isArray(solutionData.steps) ? (
                  <Box>
                    {solutionData.steps.map((step, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          mb: 3, 
                          pb: 2, 
                          borderBottom: index < solutionData.steps.length - 1 ? '1px solid #e0e0e0' : 'none' 
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'primary.main', 
                            mb: 1 
                          }}
                        >
                          Step {step.order || index + 1}
                        </Typography>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ mb: 1.5, color: 'text.primary' }}
                        >
                          {step.description}
                        </Typography>
                        
                        {step.formula && (
                          <Box 
                            sx={{ 
                              bgcolor: '#00021d', 
                              p: 2, 
                              borderRadius: 1,
                              fontFamily: 'monospace',
                              fontSize: '1rem'
                            }}
                          >
                            <Typography 
                              variant="body1" 
                              component="pre" 
                              sx={{ 
                                m: 0,
                                color: '#ffffff',
                                whiteSpace: 'pre-wrap'
                              }}
                            >
                              {step.formula}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No step-by-step solution available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="2">
            <Card className={`shadow-lg mb-4 ${styles.solutionCard}`}>
              <CardHeader
                avatar={<Lightbulb className={styles.solutionIcon} />}
                title={
                  <Typography variant="h5" className={styles.solutionTitle}>
                    Shortcut Formula
                  </Typography>
                }
                className={styles.solutionCardHeader}
              />
              <CardContent className={styles.solutionCardContent}>
                {solution?.shortcutFormula ? (
                  <Typography variant="body1" className={styles.shortcutFormula}>
                    {solution.shortcutFormula}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No shortcut formula available for this problem.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="3">
            <Card className={`shadow-lg mb-4 ${styles.solutionCard}`}>
              <CardHeader
                avatar={<Lightbulb className={styles.solutionIcon} />}
                title={
                  <Typography variant="h5" className={styles.solutionTitle}>
                    Detailed Explanation
                  </Typography>
                }
                className={styles.solutionCardHeader}
              />
              <CardContent className={styles.solutionCardContent}>
                {solutionData?.html ? (
                  <Box
                    className={styles.htmlSolution}
                    dangerouslySetInnerHTML={{ __html: solutionData?.html }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No detailed explanation available for this problem.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}

export default SolutionTab;
