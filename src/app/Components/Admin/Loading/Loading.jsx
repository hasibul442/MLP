import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";
import styles from "./style.module.css";

function Loading({text}) {
  return (
    <>
      <Box className={styles.loading}>
        <CircularProgress size={32} className={styles.progress} />
        <Typography variant="body2">{text}</Typography>
      </Box>
    </>
    );
}

export default Loading;
