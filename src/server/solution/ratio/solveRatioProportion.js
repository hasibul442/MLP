import { generateCompleteHTML } from '../../html/RatioHtml.js';

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

        // Build step-by-step solution dynamically (following traditional Bengali math format)
        const steps = [
            {
                step: 1,
                description: {
                    en: `Given Information`,
                    bn: `প্রদত্ত আছে`
                },
                formula: null,
                explanation: {
                    en: `Ratio: ${ratio_part_1} : ${ratio_part_2}\n${inputLabels.ratio_part_2.en} = ${value_1}`,
                    bn: `অনুপাত = ${ratio_part_1} : ${ratio_part_2}\n${inputLabels.ratio_part_2.bn} = ${value_1} জন`
                },
                result: null
            },
            {
                step: 2,
                description: {
                    en: `What to Find`,
                    bn: `মান বাহির করতে হবে`
                },
                formula: null,
                explanation: {
                    en: `${inputLabels.ratio_part_1.en} = ?`,
                    bn: `${inputLabels.ratio_part_1.bn} = ?`
                },
                result: null
            },
            {
                step: 3,
                description: {
                    en: `Find the value of ${ratio_part_2} units`,
                    bn: `${ratio_part_2} অংশের মান`
                },
                formula: `${ratio_part_2} = ${value_1}`,
                calculation: null,
                explanation: {
                    en: `According to the ratio, ${ratio_part_2} parts equal ${value_1}`,
                    bn: `অনুপাত অনুযায়ী, ${ratio_part_2} অংশ = ${value_1}`
                },
                result: value_1
            },
            {
                step: 4,
                description: {
                    en: `Find the value of 1 unit`,
                    bn: `১ অংশের মান`
                },
                formula: `1 = ${value_1} ÷ ${ratio_part_2}`,
                calculation: `= ${value_1} / ${ratio_part_2}\n= ${oneUnit}`,
                explanation: {
                    en: `Divide by ${ratio_part_2} to find 1 part`,
                    bn: `${ratio_part_2} দ্বারা ভাগ করে ১ অংশ বের করি`
                },
                result: oneUnit
            },
            {
                step: 5,
                description: {
                    en: `Find the value of ${ratio_part_1} units`,
                    bn: `${ratio_part_1} অংশের মান`
                },
                formula: `${ratio_part_1} = ${ratio_part_1} × ${oneUnit}`,
                calculation: `= ${ratio_part_1} × ${oneUnit}\n= ${result}`,
                explanation: {
                    en: `Multiply 1 part by ${ratio_part_1} to find the answer`,
                    bn: `১ অংশকে ${ratio_part_1} দ্বারা গুণ করে উত্তর বের করি`
                },
                result: finalAnswer
            }
        ];

        // Add verification step
        steps.push({
            step: 6,
            description: {
                en: `Answer`,
                bn: `উত্তর`
            },
            formula: `${inputLabels.ratio_part_1.en} = ${finalAnswer}`,
            calculation: null,
            explanation: {
                en: `Therefore, ${inputLabels.ratio_part_1.en.toLowerCase()} = ${finalAnswer}`,
                bn: `সুতরাং ${inputLabels.ratio_part_1.bn} = ${finalAnswer} জন`
            },
            result: `${finalAnswer}`
        });

        // Generate HTML representation
        const htmlOutput = generateSolutionHTML(problem, payload.inputs, steps, finalAnswer, inputLabels);

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
                // steps: steps,
                summary: {
                    en: `The answer is ${finalAnswer}`,
                    bn: `উত্তর হলো ${finalAnswer}`
                },
                workingFormula: `(${ratio_part_1} × ${value_1}) ÷ ${ratio_part_2} = ${finalAnswer}`,
                html: htmlOutput
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
 * Generate HTML representation of the solution
 * @param {Object} problem - Problem object
 * @param {Object} inputs - Input values
 * @param {Array} steps - Solution steps
 * @param {number} finalAnswer - Final answer
 * @param {Object} inputLabels - Input labels in both languages
 * @returns {Object} - HTML output in both languages
 */
function generateSolutionHTML(problem, inputs, steps, finalAnswer, inputLabels) {
    return {
        en: generateEnglishHTML(problem, inputs, steps, finalAnswer, inputLabels),
        bn: generateBengaliHTML(problem, inputs, steps, finalAnswer, inputLabels)
    };
}

/**
 * Generate English HTML template
 * @param {Object} problem - Problem object
 * @param {Object} inputs - Input values
 * @param {Array} steps - Solution steps
 * @param {number} finalAnswer - Final answer
 * @param {Object} inputLabels - Input labels in both languages
 * @returns {string} - Complete HTML document in English
 */
function generateEnglishHTML(problem, inputs, steps, finalAnswer, inputLabels) {
    const bodyContent = generateBodyContent('en', problem, inputs, steps, finalAnswer, inputLabels);
    return generateCompleteHTML('en', problem, bodyContent);
}

/**
 * Generate Bengali HTML template
 * @param {Object} problem - Problem object
 * @param {Object} inputs - Input values
 * @param {Array} steps - Solution steps
 * @param {number} finalAnswer - Final answer
 * @param {Object} inputLabels - Input labels in both languages
 * @returns {string} - Complete HTML document in Bengali
 */
function generateBengaliHTML(problem, inputs, steps, finalAnswer, inputLabels) {
    const bodyContent = generateBodyContent('bn', problem, inputs, steps, finalAnswer, inputLabels);
    return generateCompleteHTML('bn', problem, bodyContent);
}

/**
 * Generate body content (problem-specific)
 * @param {string} lang - Language code ('en' or 'bn')
 * @param {Object} problem - Problem object
 * @param {Object} inputs - Input values
 * @param {Array} steps - Solution steps
 * @param {number} finalAnswer - Final answer
 * @param {Object} inputLabels - Input labels
 * @returns {string} - HTML for body content
 */
function generateBodyContent(lang, problem, inputs, steps, finalAnswer, inputLabels) {
    const { ratio_part_1, ratio_part_2, value_1 } = inputs;
    const isEnglish = lang === 'en';
    
    const problemText = isEnglish
        ? (problem.template?.en?.replace(/\{\{ratio_part_1\}\}/g, ratio_part_1)
                                .replace(/\{\{ratio_part_2\}\}/g, ratio_part_2)
                                .replace(/\{\{value_1\}\}/g, value_1) || 'Solve the problem')
        : (problem.template?.bn?.replace(/\{\{ratio_part_1\}\}/g, ratio_part_1)
                                .replace(/\{\{ratio_part_2\}\}/g, ratio_part_2)
                                .replace(/\{\{value_1\}\}/g, value_1) || 'সমস্যা সমাধান করুন');
    
    const problemLabel = isEnglish ? 'Problem' : 'সমস্যা';
    const solutionLabel = isEnglish ? 'Solution' : 'সমাধান';
    const answerLabel = isEnglish ? 'Final Answer' : 'চূড়ান্ত উত্তর';
    const resultLabel = isEnglish ? 'Result' : 'ফলাফল';
    
    return `
    <main class="main-content pb-5">
        <div class="container">
            <!-- Problem Statement -->
            <div class="card mb-4 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title text-uppercase text-muted small fw-semibold mb-3">${problemLabel}</h5>
                    <p class="fs-5 mb-0 lh-base">${problemText}</p>
                </div>
            </div>

            <!-- Solution Steps -->
            <div class="card mb-4 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title text-uppercase text-muted small fw-semibold mb-4">${solutionLabel}</h5>
                    ${steps.map((step, index) => `
                        <div class="${index < steps.length - 1 ? 'mb-4 pb-4 border-bottom' : ''}">
                            <div class="d-flex align-items-start">
                                <div class="step-number bg-dark text-white rounded-circle me-3 fw-semibold small">${step.step}</div>
                                <div class="flex-grow-1">
                                    <h6 class="fw-semibold mb-3">${step.description[lang]}</h6>
                                    ${step.explanation ? `<div class="mb-2 text-dark" style="white-space: pre-line;">${step.explanation[lang]}</div>` : ''}
                                    ${step.formula ? `<div class="bg-light p-3 rounded border-start border-dark border-3 mt-2 font-monospace">${step.formula}</div>` : ''}
                                    ${step.calculation ? `<div class="bg-light p-3 rounded border-start border-secondary border-3 mt-2 font-monospace" style="white-space: pre-line;">${step.calculation}</div>` : ''}
                                    ${step.result !== null && step.result !== undefined && step.step < steps.length ? `<div class="mt-3 p-2 bg-white border border-secondary rounded"><strong>${resultLabel}:</strong> <span class="fs-5 fw-semibold text-primary">${step.result}</span></div>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Final Answer -->
            <div class="card shadow-sm border-primary border-2 bg-light">
                <div class="card-body text-center py-5">
                    <h5 class="card-title text-uppercase text-primary small fw-semibold mb-3">${answerLabel}</h5>
                    <div class="display-3 fw-bold text-primary">${finalAnswer}</div>
                    <p class="text-muted mt-3 mb-0">${steps[steps.length - 1].explanation[lang]}</p>
                </div>
            </div>
        </div>
    </main>`;
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