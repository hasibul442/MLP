import { ArrowBack } from '@mui/icons-material'
import { Alert, Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

function GoBack1({ title, message}) {
    const router = useRouter();
  return (
    <>
    <div>
        <Alert severity="error" className={styles.errorAlert}>
          <Typography variant="h6">{title}</Typography>
          <Typography>{message}</Typography>
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    </>
  )
}

export default GoBack1