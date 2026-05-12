import { buildResponse } from '../ResponseBuilder.js';
import { getInputLabels, generateSolutionHTML } from './helpers.js';

/**
 * 
 * @param {Object} problem - Problem object from database
 * @param {Object} payload - Input payload with user inputs
 * @returns {Object} - Solution response
 */
export function solveDivideTotalByRatio(problem, payload) {
    const { value_1, ratio_part_1, ratio_part_2 } = payload.inputs;
    
    // Validate inputs
    if (!value_1 || !ratio_part_1 || !ratio_part_2) {
        throw new Error("Missing required inputs");
    }

    if (value_1 <= 0 || ratio_part_1 <= 0 || ratio_part_2 <= 0) {
        throw new Error("All input values must be positive");
    }

    const inputLabels = getInputLabels(problem.inputs);
    
    // Calculate total parts and individual values
    const totalParts = ratio_part_1 + ratio_part_2;
    const onePartValue = value_1 / totalParts;
    const part1Value = ratio_part_1 * onePartValue;
    const part2Value = ratio_part_2 * onePartValue;
    
    // Format results
    const isWholePart1 = Number.isInteger(part1Value);
    const isWholePart2 = Number.isInteger(part2Value);
    const isWholeOnePart = Number.isInteger(onePartValue);
    
    const finalPart1 = isWholePart1 ? part1Value : Number.parseFloat(part1Value.toFixed(2));
    const finalPart2 = isWholePart2 ? part2Value : Number.parseFloat(part2Value.toFixed(2));
    const finalOnePart = isWholeOnePart ? onePartValue : Number.parseFloat(onePartValue.toFixed(2));
    
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
                en: `Total = ${value_1}\nRatio = ${ratio_part_1} : ${ratio_part_2}`,
                bn: `মোট = ${value_1}\nঅনুপাত = ${ratio_part_1} : ${ratio_part_2}`
            },
            result: null
        },
        {
            step: 2,
            description: {
                en: `Find Total Parts`,
                bn: `মোট অংশ নির্ণয়`
            },
            formula: `${ratio_part_1} + ${ratio_part_2} = ${totalParts}`,
            calculation: `মোট অংশ = ${totalParts}`,
            explanation: {
                en: `Add the ratio parts together`,
                bn: `অনুপাতের অংশগুলো যোগ করি`
            },
            result: totalParts
        },
        {
            step: 3,
            description: {
                en: `Find Value of 1 Part`,
                bn: `১ অংশের মান`
            },
            formula: `১ অংশ = ${value_1} ÷ ${totalParts}`,
            calculation: `= ${value_1} / ${totalParts}\n= ${finalOnePart}`,
            explanation: {
                en: `Divide total by total parts`,
                bn: `মোটকে মোট অংশ দিয়ে ভাগ করি`
            },
            result: finalOnePart
        },
        {
            step: 4,
            description: {
                en: `Find ${inputLabels.ratio_part_1?.en || 'First Part'}`,
                bn: `${inputLabels.ratio_part_1?.bn || 'প্রথম অংশ'} নির্ণয়`
            },
            formula: `${ratio_part_1} অংশ = ${ratio_part_1} × ${finalOnePart}`,
            calculation: `= ${ratio_part_1} × ${finalOnePart}\n= ${finalPart1}`,
            explanation: {
                en: `Multiply 1 part value by ${ratio_part_1}`,
                bn: `১ অংশের মানকে ${ratio_part_1} দিয়ে গুণ করি`
            },
            result: finalPart1
        },
        {
            step: 5,
            description: {
                en: `Find ${inputLabels.ratio_part_2?.en || 'Second Part'}`,
                bn: `${inputLabels.ratio_part_2?.bn || 'দ্বিতীয় অংশ'} নির্ণয়`
            },
            formula: `${ratio_part_2} অংশ = ${ratio_part_2} × ${finalOnePart}`,
            calculation: `= ${ratio_part_2} × ${finalOnePart}\n= ${finalPart2}`,
            explanation: {
                en: `Multiply 1 part value by ${ratio_part_2}`,
                bn: `১ অংশের মানকে ${ratio_part_2} দিয়ে গুণ করি`
            },
            result: finalPart2
        },
        {
            step: 6,
            description: {
                en: `Verify Answer`,
                bn: `যাচাইকরণ`
            },
            formula: `${finalPart1} + ${finalPart2} = ${value_1}`,
            calculation: null,
            explanation: {
                en: `${inputLabels.ratio_part_1?.en || 'First part'} + ${inputLabels.ratio_part_2?.en || 'Second part'} = Total`,
                bn: `${inputLabels.ratio_part_1?.bn || 'প্রথম অংশ'} + ${inputLabels.ratio_part_2?.bn || 'দ্বিতীয় অংশ'} = মোট`
            },
            result: `✓ ${finalPart1 + finalPart2} = ${value_1}`
        },
        {
            step: 7,
            description: {
                en: `Final Answer`,
                bn: `চূড়ান্ত উত্তর`
            },
            formula: null,
            calculation: null,
            explanation: {
                en: `${inputLabels.ratio_part_1?.en || 'First part'} = ${finalPart1}\n${inputLabels.ratio_part_2?.en || 'Second part'} = ${finalPart2}`,
                bn: `${inputLabels.ratio_part_1?.bn || 'প্রথম অংশ'} = ${finalPart1}\n${inputLabels.ratio_part_2?.bn || 'দ্বিতীয় অংশ'} = ${finalPart2}`
            },
            result: `${finalPart1}, ${finalPart2}`
        }
    ];
    
    const htmlOutput = generateSolutionHTML(problem, payload.inputs, steps, `${finalPart1}, ${finalPart2}`, inputLabels);
    
    const inputsData = {
        value_1,
        ratio_part_1,
        ratio_part_2,
        labels: inputLabels
    };
    
    const workingFormula = `${ratio_part_1}/${totalParts} × ${value_1} = ${finalPart1}, ${ratio_part_2}/${totalParts} × ${value_1} = ${finalPart2}`;
    const finalAnswer = { 
        part1: finalPart1, 
        part2: finalPart2,
        total: finalPart1 + finalPart2
    };
    
    return buildResponse(problem, inputsData, finalAnswer, workingFormula, htmlOutput, "solveDivideTotalByRatio");
}
