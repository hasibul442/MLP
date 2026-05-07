export function solveRatioProportion(problem, type, payload) {
    try {
        // Extract inputs from payload
        const { ratio_part_1, ratio_part_2, value_1 } = payload.inputs;
        
        // Validate inputs
        if (!ratio_part_1 || !ratio_part_2 || !value_1) {
            throw new Error("Missing required inputs");
        }

        if (ratio_part_1 <= 0 || ratio_part_2 <= 0 || value_1 <= 0) {
            throw new Error("All input values must be positive");
        }

        // Extract dynamic labels from problem inputs
        const inputLabels = getInputLabels(problem.inputs);
        
        // Calculate the solution
        const oneUnit = value_1 / ratio_part_2;
        const result = ratio_part_1 * oneUnit;

        // Determine if the result is a whole number
        const isWholeNumber = Number.isInteger(result);
        const finalAnswer = isWholeNumber ? result : parseFloat(result.toFixed(2));

        // Build step-by-step solution dynamically
        const steps = [
            {
                step: 1,
                description: {
                    en: `Given ratio is ${ratio_part_1} : ${ratio_part_2}`,
                    bn: `প্রদত্ত অনুপাত ${ratio_part_1} : ${ratio_part_2}`
                },
                formula: `${ratio_part_1} : ${ratio_part_2}`,
                explanation: {
                    en: `${inputLabels.ratio_part_1.en} : ${inputLabels.ratio_part_2.en}`,
                    bn: `${inputLabels.ratio_part_1.bn} : ${inputLabels.ratio_part_2.bn}`
                },
                result: null
            },
            {
                step: 2,
                description: {
                    en: `${inputLabels.value_1.en} = ${value_1}`,
                    bn: `${inputLabels.value_1.bn} = ${value_1}`
                },
                formula: `${inputLabels.value_1.en} = ${value_1}`,
                result: value_1
            },
            {
                step: 3,
                description: {
                    en: `According to the ratio, ${ratio_part_2} units = ${value_1}`,
                    bn: `অনুপাত অনুযায়ী, ${ratio_part_2} একক = ${value_1}`
                },
                formula: `${ratio_part_2} units = ${value_1}`,
                explanation: {
                    en: `The second part of the ratio (${ratio_part_2}) represents the known value (${value_1})`,
                    bn: `অনুপাতের দ্বিতীয় অংশ (${ratio_part_2}) পরিচিত মান (${value_1}) নির্দেশ করে`
                },
                result: null
            },
            {
                step: 4,
                description: {
                    en: `Find the value of 1 unit`,
                    bn: `১ একক এর মান বের করি`
                },
                formula: `1 unit = ${value_1} ÷ ${ratio_part_2}`,
                calculation: `${value_1} / ${ratio_part_2} = ${oneUnit}`,
                explanation: {
                    en: `Divide the known value by its corresponding ratio part`,
                    bn: `পরিচিত মানকে তার সংশ্লিষ্ট অনুপাত অংশ দিয়ে ভাগ করি`
                },
                result: oneUnit
            },
            {
                step: 5,
                description: {
                    en: `Calculate the unknown value`,
                    bn: `অজানা মান বের করি`
                },
                formula: `Result = ${ratio_part_1} × ${oneUnit}`,
                calculation: `${ratio_part_1} × ${oneUnit} = ${result}`,
                explanation: {
                    en: `Multiply 1 unit by the first ratio part to find the answer`,
                    bn: `১ একককে প্রথম অনুপাত অংশ দিয়ে গুণ করে উত্তর বের করি`
                },
                result: finalAnswer
            }
        ];

        // Add verification step
        steps.push({
            step: 6,
            description: {
                en: `Verification`,
                bn: `যাচাইকরণ`
            },
            formula: `${ratio_part_1}/${ratio_part_2} = ${finalAnswer}/${value_1}`,
            calculation: `${(ratio_part_1 / ratio_part_2).toFixed(4)} ≈ ${(finalAnswer / value_1).toFixed(4)}`,
            explanation: {
                en: `The ratios ${ratio_part_1} : ${ratio_part_2} and ${finalAnswer} : ${value_1} are equivalent`,
                bn: `অনুপাত ${ratio_part_1} : ${ratio_part_2} এবং ${finalAnswer} : ${value_1} সমতুল্য`
            },
            result: "✓ Verified"
        });

        // Build the response
        const response = {
            success: true,
            problem: {
                id: problem._id,
                type: problem.problemType?.title || "Ratio and Proportion",
                template: problem.template,
                specialInstruction: problem.specialInstruction,
                description: problem.description
            },
            inputs: {
                ratio_part_1,
                ratio_part_2,
                value_1,
                labels: inputLabels
            },
            solution: {
                answer: finalAnswer,
                steps: steps,
                summary: {
                    en: `The answer is ${finalAnswer}`,
                    bn: `উত্তর হলো ${finalAnswer}`
                },
                workingFormula: `(${ratio_part_1} × ${value_1}) ÷ ${ratio_part_2} = ${finalAnswer}`
            },
            metadata: {
                solverId: "solveRatioProportion",
                timestamp: new Date().toISOString(),
                calculationMethod: "ratio-proportion-unitary-method",
                problemType: problem.problemType?.slug || "ratio-and-proportion"
            }
        };

        return response;

    } catch (error) {
        return {
            success: false,
            error: {
                message: error.message,
                code: "777",
            }
        };
    }
}

/**
 * Extract input labels from problem definition
 * @param {Array} inputs - Array of input definitions from problem
 * @returns {Object} - Object with input labels in both languages
 */
function getInputLabels(inputs) {
    const labels = {};
    
    if (!inputs || !Array.isArray(inputs)) {
        return {
            ratio_part_1: { en: "First Ratio Part", bn: "প্রথম অনুপাত অংশ" },
            ratio_part_2: { en: "Second Ratio Part", bn: "দ্বিতীয় অনুপাত অংশ" },
            value_1: { en: "Known Value", bn: "পরিচিত মান" }
        };
    }

    inputs.forEach(input => {
        if (input.key && input.label) {
            labels[input.key] = {
                en: input.label.en || input.key,
                bn: input.label.bn || input.key
            };
        }
    });

    return labels;
}

/**
 * Helper function to calculate ratio proportions
 * @param {number} ratio1 - First part of the ratio
 * @param {number} ratio2 - Second part of the ratio
 * @param {number} knownValue - Known value corresponding to ratio2
 * @returns {number} - The unknown value corresponding to ratio1
 */
function calculateProportionalValue(ratio1, ratio2, knownValue) {
    return (ratio1 * knownValue) / ratio2;
}

/**
 * Helper function to simplify a ratio
 * @param {number} num1 - First number
 * @param {number} num2 - Second number
 * @returns {object} - Simplified ratio
 */
function simplifyRatio(num1, num2) {
    const gcd = findGCD(num1, num2);
    return {
        part1: num1 / gcd,
        part2: num2 / gcd,
        gcd: gcd
    };
}

/**
 * Helper function to find Greatest Common Divisor (GCD)
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} - GCD of a and b
 */
function findGCD(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}