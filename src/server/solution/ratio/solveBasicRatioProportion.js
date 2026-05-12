import { buildResponse } from '../ResponseBuilder.js';
import { getInputLabels, generateSolutionHTML } from './helpers.js';

/**
 * Solve basic ratio proportion problems (original functionality)
 * Example: "If ratio is 4:5 and second value is 100, find first value"
 * 
 * @param {Object} problem - Problem object
 * @param {string} type - Problem type
 * @param {Object} payload - Input payload
 * @returns {Object} - Solution response
 */
export function solveBasicRatioProportion(problem, payload) {
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
    const finalAnswer = isWholeNumber ? result : Number.parseFloat(result.toFixed(2));

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
                en: `Ratio: ${ratio_part_1} : ${ratio_part_2}\n${inputLabels.ratio_part_2?.en || 'Second value'} = ${value_1}`,
                bn: `অনুপাত = ${ratio_part_1} : ${ratio_part_2}\n${inputLabels.ratio_part_2?.bn || 'দ্বিতীয় মান'} = ${value_1}`
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
                en: `${inputLabels.ratio_part_1?.en || 'First value'} = ?`,
                bn: `${inputLabels.ratio_part_1?.bn || 'প্রথম মান'} = ?`
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
        },
        {
            step: 6,
            description: {
                en: `Answer`,
                bn: `উত্তর`
            },
            formula: `${inputLabels.ratio_part_1?.en || 'First value'} = ${finalAnswer}`,
            calculation: null,
            explanation: {
                en: `Therefore, ${inputLabels.ratio_part_1?.en?.toLowerCase() || 'first value'} = ${finalAnswer}`,
                bn: `সুতরাং ${inputLabels.ratio_part_1?.bn || 'প্রথম মান'} = ${finalAnswer}`
            },
            result: `${finalAnswer}`
        }
    ];

    // Generate HTML representation
    const htmlOutput = generateSolutionHTML(problem, payload.inputs, steps, finalAnswer, inputLabels);

    // Build the response
    const inputsData = {
        ratio_part_1,
        ratio_part_2,
        value_1,
        labels: inputLabels
    };
    const workingFormula = `${ratio_part_1} × (${value_1} ÷ ${ratio_part_2}) = ${finalAnswer}`;
    const response = buildResponse(problem, inputsData, finalAnswer, workingFormula, htmlOutput, "solveRatioProportion");

    return response;
}
