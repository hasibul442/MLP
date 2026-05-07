import { Box, CircularProgress, Typography } from "@mui/material";
import styles from "./page.module.css";

function Loading1({ text }) {
  return (
    <>
      <div>
        <Box className={styles.loadingContainer}>
          <Box className={styles.loadingBox}>
            <CircularProgress size={60} className={styles.loadingSpinner} />
            <Typography variant="h6" color="textSecondary">
              {text || "Loading..."}
            </Typography>
          </Box>
        </Box>
      </div>
    </>
  );
}

export default Loading1;
