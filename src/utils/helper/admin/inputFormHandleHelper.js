export function handleInputNumberChange(problem, index, field, value) {
	if (!problem) return problem;

	const inputs = [...(problem.inputs || [])];
	const nextValue = value === "" ? "" : Number(value);
	inputs[index] = {
		...inputs[index],
		[field]: Number.isNaN(nextValue) ? "" : nextValue,
	};
	return { ...problem, inputs };
}

export function handleArrayLengthChange(problem, inputKey, value) {
	if (!problem) return problem;

	const count = Math.max(0, Number(value) || 0);
	const sampleInputs = { ...(problem.sampleInputs || {}) };
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
	return { ...problem, sampleInputs };
}

export function handleArrayItemChange(problem, inputKey, itemIndex, itemType, value) {
	if (!problem) return problem;

	const sampleInputs = { ...(problem.sampleInputs || {}) };
	const current = Array.isArray(sampleInputs[inputKey])
		? [...sampleInputs[inputKey]]
		: [];

	const nextValue =
		itemType === "number" ? (value === "" ? "" : Number(value)) : value;
	current[itemIndex] = Number.isNaN(nextValue) ? "" : nextValue;
	sampleInputs[inputKey] = current;
	return { ...problem, sampleInputs };
}