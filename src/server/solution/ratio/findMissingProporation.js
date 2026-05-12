import { buildResponse } from '../ResponseBuilder.js';
import { getInputLabels, generateSolutionHTML } from './helpers.js';

/**
 * 
 * @param {Object} problem - Problem object from database
 * @param {Object} payload - Input payload with user inputs
 * @returns {Object} - Solution response
 */
export function solveFindMissingProporation(problem, payload) {
    const { ratio_part_1, ratio_part_2, value_1 } = payload.inputs;
    
    // Validate inputs
    if (!ratio_part_1 || !ratio_part_2 || !value_1) {
        throw new Error("Missing required inputs");
    }

    if (ratio_part_1 <= 0 || ratio_part_2 <= 0 || value_1 <= 0) {
        throw new Error("All input values must be positive");
    }

    const inputLabels = getInputLabels(problem.inputs);
    
    // Calculate missing part using cross multiplication
    // ratio_part_1 : ratio_part_2 = unknown : value_1
    // unknown = (ratio_part_1 × value_1) / ratio_part_2
    const result = (ratio_part_1 * value_1) / ratio_part_2;
    
    // Format result
    const isWholeNumber = Number.isInteger(result);
    const finalResult = isWholeNumber ? result : Number.parseFloat(result.toFixed(2));
    
    // Build steps
    const steps = [
        {
            step: 1,
            description: {
                en: `Given Information`,
                bn: `প্রদত্ত তথ্য`
            },
            formula: null,
            explanation: {
                en: `Ratio = ${ratio_part_1} : ${ratio_part_2}\n${inputLabels.ratio_part_2?.en || 'Second part'} = ${value_1}`,
                bn: `অনুপাত = ${ratio_part_1} : ${ratio_part_2}\n${inputLabels.ratio_part_2?.bn || 'দ্বিতীয় অংশ'} = ${value_1}`
            },
            result: null
        },
        {
            step: 2,
            description: {
                en: `Set up the Proportion`,
                bn: `সমানুপাত স্থাপন`
            },
            formula: `${ratio_part_1} : ${ratio_part_2} = x : ${value_1}`,
            calculation: null,
            explanation: {
                en: `Set up proportion to find the missing value`,
                bn: `অজানা মান বের করার জন্য সমানুপাত স্থাপন করি`
            },
            result: null
        },
        {
            step: 3,
            description: {
                en: `Apply Cross Multiplication`,
                bn: `গুণোত্তর প্রয়োগ`
            },
            formula: `x = (${ratio_part_1} × ${value_1}) ÷ ${ratio_part_2}`,
            calculation: `= (${ratio_part_1} × ${value_1}) / ${ratio_part_2}\n= ${ratio_part_1 * value_1} / ${ratio_part_2}\n= ${finalResult}`,
            explanation: {
                en: `Cross multiply and divide to find the missing term`,
                bn: `গুণোত্তর প্রয়োগ করে অজানা মান বের করি`
            },
            result: finalResult
        },
        {
            step: 4,
            description: {
                en: `Answer`,
                bn: `উত্তর`
            },
            formula: null,
            calculation: null,
            explanation: {
                en: `${inputLabels.ratio_part_1?.en || 'First part'} = ${finalResult}`,
                bn: `${inputLabels.ratio_part_1?.bn || 'প্রথম অংশ'} = ${finalResult}`
            },
            result: finalResult
        }
    ];
    
    const htmlOutput = generateSolutionHTML(problem, payload.inputs, steps, finalResult, inputLabels);
    
    const inputsData = {
        ratio_part_1,
        ratio_part_2,
        value_1,
        labels: inputLabels
    };
    
    const workingFormula = `(${ratio_part_1} × ${value_1}) / ${ratio_part_2} = ${finalResult}`;
    const finalAnswer = { value: finalResult };
    
    return buildResponse(problem, inputsData, finalAnswer, workingFormula, htmlOutput, "solveFindMissingProporation");
}
