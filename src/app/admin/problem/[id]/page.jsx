"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Container,
	Typography,
} from "@mui/material";

export default function ProblemDetailPage() {
	const { id } = useParams();
	const [problem, setProblem] = useState(null);
	const [loading, setLoading] = useState(true);

	const handleInputNumberChange = (index, field, value) => {
		setProblem((prev) => {
			if (!prev) {
				return prev;
			}

			const inputs = [...(prev.inputs || [])];
			const nextValue = value === "" ? "" : Number(value);
			inputs[index] = {
				...inputs[index],
				[field]: Number.isNaN(nextValue) ? "" : nextValue,
			};
			return { ...prev, inputs };
		});
	};

	const handleArrayLengthChange = (inputKey, value) => {
		setProblem((prev) => {
			if (!prev) {
				return prev;
			}

			const count = Math.max(0, Number(value) || 0);
			const sampleInputs = { ...(prev.sampleInputs || {}) };
			const current = Array.isArray(sampleInputs[inputKey])
				? [...sampleInputs[inputKey]]
				: [];

			if (current.length > count) {
				current.length = count;
			} else {
				while (current.length < count) {
					current.push("");
				}
			}

			sampleInputs[inputKey] = current;
			return { ...prev, sampleInputs };
		});
	};

	const handleArrayItemChange = (inputKey, itemIndex, itemType, value) => {
		setProblem((prev) => {
			if (!prev) {
				return prev;
			}

			const sampleInputs = { ...(prev.sampleInputs || {}) };
			const current = Array.isArray(sampleInputs[inputKey])
				? [...sampleInputs[inputKey]]
				: [];

			const nextValue =
				itemType === "number" ? (value === "" ? "" : Number(value)) : value;
			current[itemIndex] = Number.isNaN(nextValue) ? "" : nextValue;
			sampleInputs[inputKey] = current;
			return { ...prev, sampleInputs };
		});
	};

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
		content = (
			<Box className={styles.loading}>
				<CircularProgress size={32} className={styles.progress} />
				<Typography variant="body2">Loading problem...</Typography>
			</Box>
		);
	} else if (!problem || problem.error) {
		content = (
			<Box className={styles.emptyState}>
				<Typography className={styles.emptyText}>
					{problem?.error || "Problem not found."}
				</Typography>
			</Box>
		);
	} else {
		content = (
			<>
				<Box className={styles.detailGrid}>
					<div className={styles.detailItem}>
						<div className={styles.detailLabel}>Problem Type</div>
						<div className={styles.detailValue}>
							{problem.problemType?.title?.en || problem.problemType?.slug || "-"}
						</div>
					</div>
					<div className={styles.detailItem}>
						<div className={styles.detailLabel}>Status</div>
						<div className={styles.detailValue}>
							<span className={styles.pill}>
								{problem.isActive ? "Active" : "Inactive"}
							</span>
						</div>
					</div>
					<div className={styles.detailItem}>
						<div className={styles.detailLabel}>Inputs</div>
						<div className={styles.detailValue}>{problem.inputs?.length ?? 0}</div>
					</div>
					<div className={styles.detailItem}>
						<div className={styles.detailLabel}>Created</div>
						<div className={styles.detailValue}>
							{problem.createdAt
								? new Date(problem.createdAt).toLocaleDateString()
								: "-"}
						</div>
					</div>
				</Box>

				<Box className="mt-4">
					<Typography className={styles.sectionTitle}>Template (EN)</Typography>
					<Typography>{problem.template?.en || "-"}</Typography>
				</Box>
				<Box className="mt-3">
					<Typography className={styles.sectionTitle}>Template (BN)</Typography>
					<Typography>{problem.template?.bn || "-"}</Typography>
				</Box>
				<Box className="mt-3">
					<Typography className={styles.sectionTitle}>Description (EN)</Typography>
					<Typography>{problem.description?.en || "-"}</Typography>
				</Box>
				<Box className="mt-3">
					<Typography className={styles.sectionTitle}>Description (BN)</Typography>
					<Typography>{problem.description?.bn || "-"}</Typography>
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
									<div className={styles.detailItem}>
										<div className={styles.detailLabel}>Key</div>
										<div className={styles.detailValue}>{input.key || "-"}</div>
									</div>
									<div className={styles.detailItem}>
										<div className={styles.detailLabel}>Type</div>
										<div className={styles.detailValue}>{input.type || "-"}</div>
									</div>
									<div className={styles.detailItem}>
										<div className={styles.detailLabel}>Label (EN)</div>
										<div className={styles.detailValue}>{input.label?.en || "-"}</div>
									</div>
									<div className={styles.detailItem}>
										<div className={styles.detailLabel}>Label (BN)</div>
										<div className={styles.detailValue}>{input.label?.bn || "-"}</div>
									</div>
									{input.type === "array" && (
										(() => {
											const sampleArray = Array.isArray(
												problem.sampleInputs?.[input.key]
											)
												? problem.sampleInputs[input.key]
												: [];

											return (
										<>
											<div className={styles.detailItem}>
												<div className={styles.detailLabel}>Item Type</div>
												<div className={styles.detailValue}>{input.itemType || "-"}</div>
											</div>
											<div className={styles.detailItem}>
												<div className={styles.detailLabel}>Min Items</div>
												<input
													className={styles.inlineInput}
													type="number"
													value={input.minItems ?? ""}
													onChange={(event) =>
														handleInputNumberChange(
															index,
															"minItems",
															event.target.value
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
														handleInputNumberChange(
															index,
															"maxItems",
															event.target.value
														)
													}
												/>
											</div>
											<div className={styles.detailItem}>
												<div className={styles.detailLabel}>Items Count</div>
												<input
													className={styles.inlineInput}
													type="number"
													value={sampleArray.length}
													onChange={(event) =>
														handleArrayLengthChange(input.key, event.target.value)
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
																type={input.itemType === "number" ? "number" : "text"}
																value={item ?? ""}
																onChange={(event) =>
																handleArrayItemChange(
																	input.key,
																	itemIndex,
																	input.itemType,
																	event.target.value
																)
															}
															/>
														</div>
														))}
												</div>
											)}
										</>
										);
									})()
									)}
									{input.type === "number" && (
										<>
											<div className={styles.detailItem}>
												<div className={styles.detailLabel}>Min</div>
												<input
													className={styles.inlineInput}
													type="number"
													value={input.min ?? ""}
													onChange={(event) =>
														handleInputNumberChange(
															index,
															"min",
															event.target.value
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
														handleInputNumberChange(
															index,
															"max",
															event.target.value
														)
													}
												/>
											</div>
										</>
									)}
									<div className={styles.detailItem}>
										<div className={styles.detailLabel}>Required</div>
										<div className={styles.detailValue}>
											{input.required ? "Yes" : "No"}
										</div>
									</div>
								</Box>
							</Box>
						))
					) : (
						<Typography className={styles.detailValue}>-</Typography>
					)}
				</Box>
				<Box className="mt-3">
					<Typography className={styles.sectionTitle}>Sample Inputs</Typography>
					<pre className={styles.jsonBlock}>{JSON.stringify(problem.sampleInputs, null, 2)}</pre>
				</Box>
			</>
		);
	}

	return (
		<div className="page-background">
			<Container maxWidth="lg" className="py-5">
				<main className={styles.main}>
					<section className="row g-4 align-items-stretch mb-4 mb-lg-5">
						<div className="col-12 col-lg-12">
							<Chip label="Admin Workspace" className={styles.badge} />
							<Typography variant="h3" component="h1" className={styles.heroTitle}>
								Problem Details
							</Typography>
							<Typography variant="body1" className={styles.heroText}>
								Review the selected problem definition, templates, and inputs.
							</Typography>
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
