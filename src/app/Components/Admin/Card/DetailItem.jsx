import styles from "./style.module.css";

function DetailItem({ label, value }) {
  return (
    <>
      <div className={styles.detailItem}>
        <div className={styles.detailLabel}>{label}</div>
        <div className={styles.detailValue}>{value}</div>
      </div>
    </>
  );
}

export default DetailItem;
