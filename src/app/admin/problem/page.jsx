"use client";

import { useMemo, useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { parseNumber, slugify } from "@/utils/helper/admin/helper";

export default function ProblemPage() {
  const [problemTypes, setProblemTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    problemType: "",
    templateEn: "",
    templateBn: "",
    descriptionEn: "",
    descriptionBn: "",
    specialInstruction: "",
    inputs: [
      {
        key: "",
        labelEn: "",
        labelBn: "",
        type: "number",
        itemType: "number",
        minItems: "",
        maxItems: "",
        min: "",
        max: "",
        required: true,
      },
    ],
    sampleInputsJson: "",
    isActive: true,
  });
  const [payloadJsonText, setPayloadJsonText] = useState("");
  const [payloadJsonError, setPayloadJsonError] = useState("");

  useEffect(() => {
    async function fetchProblemTypes() {
      try {
        const res = await fetch("/api/v1/problem-type", {
          headers: { "X-Accept-Language": "bn" },
        });
        const data = await res.json();
        setProblemTypes(data);
      } catch (error) {
        console.error("Failed to fetch problem types:", error);
      } finally {
        setLoadingTypes(false);
      }
    }

    fetchProblemTypes();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSpecialInstructionChange(e) {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, specialInstruction: slugify(value) }));
  }

  function handleToggle(name) {
    return (event) => {
      setForm((prev) => ({ ...prev, [name]: event.target.checked }));
    };
  }

  function handleInputChange(index, field, value) {
    setForm((prev) => {
      const inputs = [...prev.inputs];
      inputs[index] = { ...inputs[index], [field]: value };
      return { ...prev, inputs };
    });
  }

  function handleInputToggle(index, field) {
    return (event) => {
      handleInputChange(index, field, event.target.checked);
    };
  }

  function handleAddInput() {
    setForm((prev) => ({
      ...prev,
      inputs: [
        ...prev.inputs,
        {
          key: "",
          labelEn: "",
          labelBn: "",
          type: "number",
          itemType: "number",
          minItems: "",
          maxItems: "",
          min: "",
          max: "",
          required: true,
        },
      ],
    }));
  }

  function handleRemoveInput(index) {
    setForm((prev) => {
      if (prev.inputs.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        inputs: prev.inputs.filter((_, idx) => idx !== index),
      };
    });
  }

  const payload = useMemo(() => {
    const inputDefinitions = form.inputs.map((input) => {
      const minItems = parseNumber(input.minItems);
      const maxItems = parseNumber(input.maxItems);
      const min = parseNumber(input.min);
      const max = parseNumber(input.max);
      const definition = {
        key: input.key.trim(),
        label_en: input.labelEn,
        label_bn: input.labelBn,
        type: input.type,
        required: input.required,
      };

      if (input.type === "array") {
        definition.item_type = input.itemType || "number";
        if (minItems !== undefined) {
          definition.min_items = minItems;
        }
        if (maxItems !== undefined) {
          definition.max_items = maxItems;
        }
      }

      if (min !== undefined) {
        definition.min = min;
      }
      if (max !== undefined) {
        definition.max = max;
      }

      return definition;
    });

    let sampleInputs;
    if (form.sampleInputsJson.trim()) {
      try {
        sampleInputs = JSON.parse(form.sampleInputsJson);
      } catch (error) {
        sampleInputs = {};
      }
    }

    return {
      problem_type_id: form.problemType.trim(),
      template_en: form.templateEn,
      template_bn: form.templateBn,
      description_en: form.descriptionEn,
      description_bn: form.descriptionBn,
      inputs: inputDefinitions,
      sample_inputs: sampleInputs,
      isActive: form.isActive,
      special_instruction: slugify(form.specialInstruction || ""),
    };
  }, [form]);

  useEffect(() => {
    setPayloadJsonText(JSON.stringify(payload, null, 2));
  }, [payload]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({
          problemType: "",
          templateEn: "",
          templateBn: "",
          descriptionEn: "",
          descriptionBn: "",
          specialInstruction: "",
          inputs: [
            {
              key: "",
              labelEn: "",
              labelBn: "",
              type: "number",
              itemType: "number",
              minItems: "",
              maxItems: "",
              min: "",
              max: "",
              required: true,
            },
          ],
          sampleInputsJson: "",
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Failed to create problem:", error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyPayload() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error("Failed to copy payload:", error);
    }
  }

  function handlePayloadJsonChange(e) {
    setPayloadJsonText(e.target.value);
    setPayloadJsonError("");
  }

  function handleApplyPayload() {
    try {
      const parsed = JSON.parse(payloadJsonText);
      const inputs =
        Array.isArray(parsed.inputs) && parsed.inputs.length
          ? parsed.inputs.map((input) => ({
              key: input.key || "",
              labelEn: input.label_en || "",
              labelBn: input.label_bn || "",
              type: input.type || "number",
              itemType: input.item_type || "number",
              minItems:
                input.min_items !== undefined ? String(input.min_items) : "",
              maxItems:
                input.max_items !== undefined ? String(input.max_items) : "",
              min: input.min !== undefined ? String(input.min) : "",
              max: input.max !== undefined ? String(input.max) : "",
              required:
                input.required !== undefined ? Boolean(input.required) : true,
            }))
          : [
              {
                key: "",
                labelEn: "",
                labelBn: "",
                type: "number",
                itemType: "number",
                minItems: "",
                maxItems: "",
                min: "",
                max: "",
                required: true,
              },
            ];

      setForm({
        problemType: parsed.problem_type_id || "",
        templateEn: parsed.template_en || "",
        templateBn: parsed.template_bn || "",
        descriptionEn: parsed.description_en || "",
        descriptionBn: parsed.description_bn || "",
        specialInstruction: slugify(parsed.special_instruction || ""),
        inputs,
        sampleInputsJson: parsed.sample_inputs
          ? JSON.stringify(parsed.sample_inputs, null, 2)
          : "",
        isActive:
          parsed.isActive !== undefined ? Boolean(parsed.isActive) : true,
      });
      setPayloadJsonError("");
    } catch (error) {
      setPayloadJsonError("Invalid JSON. Please check the payload format.");
    }
  }

  return (
    <div>
      <Container maxWidth="xl" className="py-5">
        <main className={styles.main}>
          <section className="row g-4 align-items-stretch mb-4 mb-lg-5">
            <div className="col-12 col-lg-12">
              <Chip label="Admin Workspace" className={styles.badge} />
              <Typography
                variant="h3"
                component="h1"
                className={styles.heroTitle}
              >
                Problem Builder
              </Typography>
              <Typography variant="body1" className={styles.heroText}>
                Create new math problems with localized templates, input
                definitions, and sample data in one place.
              </Typography>
            </div>

            <div className="col-12 col-lg-6">
              <Card elevation={0} className={styles.card}>
                <CardContent className="p-4 p-md-5">
                  <Typography variant="h6" className={styles.cardHeading}>
                    Problem Details
                  </Typography>
                  <form
                    id="problem-form"
                    onSubmit={handleSubmit}
                    className="mt-4"
                  >
                    <div className="row g-3">
                      <div className="col-12">
                        <TextField
                          id="problemType"
                          name="problemType"
                          label="Problem Type"
                          value={form.problemType}
                          onChange={handleChange}
                          required
                          select
                          fullWidth
                          className={styles.textField}
                        >
                          <MenuItem value="">Select a problem type</MenuItem>
                          {problemTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.title || type.slug}
                            </MenuItem>
                          ))}
                        </TextField>
                        <Typography className={styles.helperText}>
                          {loadingTypes
                            ? "Loading problem types..."
                            : "Select a problem type for this problem."}
                        </Typography>
                      </div>
                      <div className="col-12 col-md-6">
                        <FormControlLabel
                          className={styles.switchLabel}
                          control={
                            <Switch
                              checked={form.isActive}
                              onChange={handleToggle("isActive")}
                            />
                          }
                          label="Active"
                        />
                      </div>
                      <div className="col-12">
                        <Typography className={styles.sectionTitle}>
                          Template
                        </Typography>
                      </div>
                      <div className="col-12">
                        <TextField
                          id="templateEn"
                          name="templateEn"
                          label="Template (English)"
                          placeholder="Find the LCM of {{numbers}}"
                          value={form.templateEn}
                          onChange={handleChange}
                          required
                          fullWidth
                          multiline
                          minRows={2}
                          className={styles.textField}
                        />
                      </div>
                      <div className="col-12">
                        <TextField
                          id="templateBn"
                          name="templateBn"
                          label="Template (Bengali)"
                          placeholder="নিচের সংখ্যাগুলোর লসাগু নির্ণয় কর: {{numbers}}"
                          value={form.templateBn}
                          onChange={handleChange}
                          required
                          fullWidth
                          multiline
                          minRows={2}
                          className={styles.textField}
                        />
                      </div>
                      <div className="col-12">
                        <Typography className={styles.sectionTitle}>
                          Description
                        </Typography>
                      </div>
                      <div className="col-12 col-md-6">
                        <TextField
                          id="descriptionEn"
                          name="descriptionEn"
                          label="Description (English)"
                          value={form.descriptionEn}
                          onChange={handleChange}
                          fullWidth
                          multiline
                          minRows={2}
                          className={styles.textField}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <TextField
                          id="descriptionBn"
                          name="descriptionBn"
                          label="Description (Bengali)"
                          value={form.descriptionBn}
                          onChange={handleChange}
                          fullWidth
                          multiline
                          minRows={2}
                          className={styles.textField}
                        />
                      </div>
                      <div className="col-12 col-md-12">
                        <TextField
                          id="specialInstruction"
                          name="specialInstruction"
                          label="Special Instruction"
                          placeholder="special-instruction"
                          value={form.specialInstruction}
                          onChange={handleSpecialInstructionChange}
                          fullWidth
                          className={styles.textField}
                        />
                      </div>
                      <div className="col-12">
                        <Box className={styles.inputsHeader}>
                          <Typography className={styles.sectionTitle}>
                            Inputs
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            className={styles.secondaryBtn}
                            onClick={handleAddInput}
                          >
                            Add Input
                          </Button>
                        </Box>
                      </div>
                      {form.inputs.map((input, index) => (
                        <div className="col-12" key={`input-${index}`}>
                          <Box className={styles.inputCard}>
                            <Box className={styles.inputHeader}>
                              <Typography className={styles.inputTitle}>
                                Input {index + 1}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                className={styles.secondaryBtn}
                                disabled={form.inputs.length === 1}
                                onClick={() => handleRemoveInput(index)}
                              >
                                Remove
                              </Button>
                            </Box>
                            <div className="row g-3">
                              <div className="col-12 col-md-4">
                                <TextField
                                  id={`input-key-${index}`}
                                  label="Key"
                                  value={input.key}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "key",
                                      event.target.value,
                                    )
                                  }
                                  required
                                  fullWidth
                                  className={styles.textField}
                                />
                              </div>
                              <div className="col-12 col-md-4">
                                <TextField
                                  id={`input-type-${index}`}
                                  label="Type"
                                  value={input.type}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "type",
                                      event.target.value,
                                    )
                                  }
                                  select
                                  fullWidth
                                  className={styles.textField}
                                >
                                  <MenuItem value="number">number</MenuItem>
                                  <MenuItem value="text">text</MenuItem>
                                  <MenuItem value="array">array</MenuItem>
                                </TextField>
                              </div>
                              <div className="col-12 col-md-4">
                                <TextField
                                  id={`input-itemType-${index}`}
                                  label="Item Type"
                                  value={input.itemType}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "itemType",
                                      event.target.value,
                                    )
                                  }
                                  select
                                  fullWidth
                                  disabled={input.type !== "array"}
                                  className={styles.textField}
                                >
                                  <MenuItem value="number">number</MenuItem>
                                  <MenuItem value="text">text</MenuItem>
                                </TextField>
                              </div>
                              <div className="col-12 col-md-6">
                                <TextField
                                  id={`input-labelEn-${index}`}
                                  label="Label (English)"
                                  value={input.labelEn}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "labelEn",
                                      event.target.value,
                                    )
                                  }
                                  required
                                  fullWidth
                                  className={styles.textField}
                                />
                              </div>
                              <div className="col-12 col-md-6">
                                <TextField
                                  id={`input-labelBn-${index}`}
                                  label="Label (Bengali)"
                                  value={input.labelBn}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "labelBn",
                                      event.target.value,
                                    )
                                  }
                                  required
                                  fullWidth
                                  className={styles.textField}
                                />
                              </div>
                              <div className="col-12 col-md-6">
                                <TextField
                                  id={`input-minItems-${index}`}
                                  label="Min Items"
                                  value={input.minItems}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "minItems",
                                      event.target.value,
                                    )
                                  }
                                  type="number"
                                  fullWidth
                                  disabled={input.type !== "array"}
                                  className={styles.textField}
                                />
                              </div>
                              <div className="col-12 col-md-6">
                                <TextField
                                  id={`input-maxItems-${index}`}
                                  label="Max Items"
                                  value={input.maxItems}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "maxItems",
                                      event.target.value,
                                    )
                                  }
                                  type="number"
                                  fullWidth
                                  disabled={input.type !== "array"}
                                  className={styles.textField}
                                />
                              </div>
                              <div className="col-12 col-md-6">
                                <TextField
                                  id={`input-min-${index}`}
                                  label="Min Value"
                                  value={input.min}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "min",
                                      event.target.value,
                                    )
                                  }
                                  type="number"
                                  fullWidth
                                  disabled={input.type !== "number"}
                                  className={styles.textField}
                                />
                              </div>
                              <div className="col-12 col-md-6">
                                <TextField
                                  id={`input-max-${index}`}
                                  label="Max Value"
                                  value={input.max}
                                  onChange={(event) =>
                                    handleInputChange(
                                      index,
                                      "max",
                                      event.target.value,
                                    )
                                  }
                                  type="number"
                                  fullWidth
                                  disabled={input.type !== "number"}
                                  className={styles.textField}
                                />
                              </div>
                              <div className="col-12 col-md-6">
                                <FormControlLabel
                                  className={styles.switchLabel}
                                  control={
                                    <Switch
                                      checked={input.required}
                                      onChange={handleInputToggle(
                                        index,
                                        "required",
                                      )}
                                    />
                                  }
                                  label="Required"
                                />
                              </div>
                            </div>
                          </Box>
                        </div>
                      ))}
                      <div className="col-12">
                        <Typography className={styles.sectionTitle}>
                          Sample Inputs (JSON)
                        </Typography>
                      </div>
                      <div className="col-12">
                        <TextField
                          id="sampleInputsJson"
                          name="sampleInputsJson"
                          label="Sample Inputs"
                          placeholder='{"numbers": [12, 15, 20]}'
                          value={form.sampleInputsJson}
                          onChange={handleChange}
                          fullWidth
                          multiline
                          minRows={3}
                          className={styles.textField}
                          helperText="Provide JSON that matches the input keys."
                        />
                      </div>
                    </div>
                  </form>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    className="mt-4"
                  >
                    <Button
                      variant="contained"
                      size="large"
                      className={styles.primaryBtn}
                      type="submit"
                      form="problem-form"
                      disabled={submitting}
                    >
                      {submitting ? "Creating..." : "Create Problem"}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      className={styles.secondaryBtn}
                      onClick={handleCopyPayload}
                    >
                      Copy Payload
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </div>

            <div className="col-6">
              <Card elevation={0} className={styles.card}>
                <CardContent className="p-4 p-md-5">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <Typography variant="h6" className={styles.cardHeading}>
                      Payload Preview
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      className={styles.secondaryBtn}
                      onClick={handleCopyPayload}
                    >
                      Copy JSON
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={styles.secondaryBtn}
                      onClick={handleApplyPayload}
                    >
                      Apply JSON
                    </Button>
                  </div>
                  <Box className="mt-4">
                    <TextField
                      label="Payload JSON"
                      value={payloadJsonText}
                      onChange={handlePayloadJsonChange}
                      fullWidth
                      multiline
                      minRows={10}
                      className={styles.textField}
                      helperText={
                        payloadJsonError || "Paste JSON to update the form."
                      }
                      error={Boolean(payloadJsonError)}
                    />
                  </Box>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </Container>
    </div>
  );
}
