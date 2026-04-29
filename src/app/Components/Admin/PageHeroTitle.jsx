
import { Typography, Chip } from "@mui/material";
import styles from "./commonstyle.module.css";

function PageHeroTitle({ label, title, description}) {
	return (
		<>
            <Chip label={label} className={styles.badge} />
			<Typography variant="h3" component="h1" className={styles.heroTitle}>
				{title}
			</Typography>
			<Typography variant="body1" className={styles.heroText}>
				{description}
			</Typography>
		</>
	);
}

export default PageHeroTitle;