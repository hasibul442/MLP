import { Box, Typography } from "@mui/material";
import styles from "./style.module.css";

function ItemNotFound({ message }) {
  return (
    <>
      <Box className={styles.emptyState}>
        <Typography className={styles.emptyText}>
          {message || "Item Not found."}
        </Typography>
      </Box>
    </>
  );
}

export default ItemNotFound;
