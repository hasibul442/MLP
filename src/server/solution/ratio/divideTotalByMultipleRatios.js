import { buildResponse } from '../ResponseBuilder.js';
import { getInputLabels, generateSolutionHTML } from './helpers.js';

/**
 * Solve problems where total needs to be divided by TWO different ratios separately
 * Example: "550 টাকাকে 5:6 ও 4:7 অনুপাতে ভাগ কর"
 * This means: Divide 550 by 5:6 (get 2 parts) AND divide 550 by 4:7 (get 2 parts)
 * Total: 4 results (2 from each ratio)
 * 
 * @param {Object} problem - Problem object from database
 * @param {Object} payload - Input payload with user inputs
 * @returns {Object} - Solution response
 */
export function solveDivideTotalByMultipleRatios(problem, payload) {
    const { total_amount, ratio_1_part1, ratio_1_part2, ratio_2_part1, ratio_2_part2 } = payload.inputs;
    
    // Validate inputs
    if (!total_amount || !ratio_1_part1 || !ratio_1_part2 || !ratio_2_part1 || !ratio_2_part2) {
        throw new Error("Missing required inputs");
    }

    if (total_amount <= 0 || ratio_1_part1 <= 0 || ratio_1_part2 <= 0 || ratio_2_part1 <= 0 || ratio_2_part2 <= 0) {
        throw new Error("All input values must be positive");
    }

    const inputLabels = getInputLabels(problem.inputs);
    
    // Division 1: By ratio_1_part1 : ratio_1_part2
    const totalParts1 = ratio_1_part1 + ratio_1_part2;
    const onePart1 = total_amount / totalParts1;
    const share1_1 = ratio_1_part1 * onePart1;
    const share1_2 = ratio_1_part2 * onePart1;
    
    // Division 2: By ratio_2_part1 : ratio_2_part2
    const totalParts2 = ratio_2_part1 + ratio_2_part2;
    const onePart2 = total_amount / totalParts2;
    const share2_1 = ratio_2_part1 * onePart2;
    const share2_2 = ratio_2_part2 * onePart2;
    
    // Format results
    const finalShare1_1 = Number.isInteger(share1_1) ? share1_1 : Number.parseFloat(share1_1.toFixed(2));
    const finalShare1_2 = Number.isInteger(share1_2) ? share1_2 : Number.parseFloat(share1_2.toFixed(2));
    const finalShare2_1 = Number.isInteger(share2_1) ? share2_1 : Number.parseFloat(share2_1.toFixed(2));
    const finalShare2_2 = Number.isInteger(share2_2) ? share2_2 : Number.parseFloat(share2_2.toFixed(2));
    const finalOnePart1 = Number.isInteger(onePart1) ? onePart1 : Number.parseFloat(onePart1.toFixed(4));
    const finalOnePart2 = Number.isInteger(onePart2) ? onePart2 : Number.parseFloat(onePart2.toFixed(4));
    
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
                en: `Total Amount = ${total_amount}\nFirst Ratio = ${ratio_1_part1} : ${ratio_1_part2}\nSecond Ratio = ${ratio_2_part1} : ${ratio_2_part2}`,
                bn: `মোট টাকা = ${total_amount}\nপ্রথম অনুপাত = ${ratio_1_part1} : ${ratio_1_part2}\nদ্বিতীয় অনুপাত = ${ratio_2_part1} : ${ratio_2_part2}`
            },
            result: null
        },
        {
            step: 2,
            description: {
                en: `Division 1: ${ratio_1_part1}:${ratio_1_part2} Ratio`,
                bn: `১ম ভাগ: ${ratio_1_part1}:${ratio_1_part2} অনুপাতে`
            },
            formula: `মোট অংশ = ${ratio_1_part1} + ${ratio_1_part2} = ${totalParts1}`,
            calculation: null,
            explanation: {
                en: `Find total parts in first ratio`,
                bn: `প্রথম অনুপাতের মোট অংশ`
            },
            result: totalParts1
        },
        {
            step: 3,
            description: {
                en: `Value of 1 Part (First Ratio)`,
                bn: `১ অংশের মান (প্রথম অনুপাত)`
            },
            formula: `১ অংশ = ${total_amount} ÷ ${totalParts1}`,
            calculation: `= ${total_amount} / ${totalParts1}\n= ${finalOnePart1}`,
            explanation: {
                en: `Divide total by total parts`,
                bn: `মোটকে মোট অংশ দিয়ে ভাগ করি`
            },
            result: finalOnePart1
        },
        {
            step: 4,
            description: {
                en: `First Part (${ratio_1_part1}:${ratio_1_part2})`,
                bn: `প্রথম অংশ (${ratio_1_part1}:${ratio_1_part2})`
            },
            formula: `${total_amount} × ${ratio_1_part1}/${totalParts1}`,
            calculation: `= ${ratio_1_part1} × ${finalOnePart1}\n= ${finalShare1_1}`,
            explanation: {
                en: `Calculate first share`,
                bn: `প্রথম ভাগ হিসাব করি`
            },
            result: `${finalShare1_1} টাকা`
        },
        {
            step: 5,
            description: {
                en: `Second Part (${ratio_1_part1}:${ratio_1_part2})`,
                bn: `দ্বিতীয় অংশ (${ratio_1_part1}:${ratio_1_part2})`
            },
            formula: `${total_amount} × ${ratio_1_part2}/${totalParts1}`,
            calculation: `= ${ratio_1_part2} × ${finalOnePart1}\n= ${finalShare1_2}`,
            explanation: {
                en: `Calculate second share`,
                bn: `দ্বিতীয় ভাগ হিসাব করি`
            },
            result: `${finalShare1_2} টাকা`
        },
        {
            step: 6,
            description: {
                en: `Division 2: ${ratio_2_part1}:${ratio_2_part2} Ratio`,
                bn: `২য় ভাগ: ${ratio_2_part1}:${ratio_2_part2} অনুপাতে`
            },
            formula: `মোট অংশ = ${ratio_2_part1} + ${ratio_2_part2} = ${totalParts2}`,
            calculation: null,
            explanation: {
                en: `Find total parts in second ratio`,
                bn: `দ্বিতীয় অনুপাতের মোট অংশ`
            },
            result: totalParts2
        },
        {
            step: 7,
            description: {
                en: `Value of 1 Part (Second Ratio)`,
                bn: `১ অংশের মান (দ্বিতীয় অনুপাত)`
            },
            formula: `১ অংশ = ${total_amount} ÷ ${totalParts2}`,
            calculation: `= ${total_amount} / ${totalParts2}\n= ${finalOnePart2}`,
            explanation: {
                en: `Divide total by total parts`,
                bn: `মোটকে মোট অংশ দিয়ে ভাগ করি`
            },
            result: finalOnePart2
        },
        {
            step: 8,
            description: {
                en: `First Part (${ratio_2_part1}:${ratio_2_part2})`,
                bn: `প্রথম অংশ (${ratio_2_part1}:${ratio_2_part2})`
            },
            formula: `${total_amount} × ${ratio_2_part1}/${totalParts2}`,
            calculation: `= ${ratio_2_part1} × ${finalOnePart2}\n= ${finalShare2_1}`,
            explanation: {
                en: `Calculate first share`,
                bn: `প্রথম ভাগ হিসাব করি`
            },
            result: `${finalShare2_1} টাকা`
        },
        {
            step: 9,
            description: {
                en: `Second Part (${ratio_2_part1}:${ratio_2_part2})`,
                bn: `দ্বিতীয় অংশ (${ratio_2_part1}:${ratio_2_part2})`
            },
            formula: `${total_amount} × ${ratio_2_part2}/${totalParts2}`,
            calculation: `= ${ratio_2_part2} × ${finalOnePart2}\n= ${finalShare2_2}`,
            explanation: {
                en: `Calculate second share`,
                bn: `দ্বিতীয় ভাগ হিসাব করি`
            },
            result: `${finalShare2_2} টাকা`
        },
        {
            step: 10,
            description: {
                en: `Final Answer`,
                bn: `চূড়ান্ত উত্তর`
            },
            formula: null,
            calculation: null,
            explanation: {
                en: `${ratio_1_part1}:${ratio_1_part2} ratio → ${finalShare1_1} and ${finalShare1_2}\n${ratio_2_part1}:${ratio_2_part2} ratio → ${finalShare2_1} and ${finalShare2_2}`,
                bn: `${ratio_1_part1}:${ratio_1_part2} অনুপাতে ${finalShare1_1} ও ${finalShare1_2} টাকা\n${ratio_2_part1}:${ratio_2_part2} অনুপাতে ${finalShare2_1} ও ${finalShare2_2} টাকা`
            },
            result: `${ratio_1_part1}:${ratio_1_part2} → ${finalShare1_1}, ${finalShare1_2}; ${ratio_2_part1}:${ratio_2_part2} → ${finalShare2_1}, ${finalShare2_2}`
        }
    ];
    
    const htmlOutput = generateSolutionHTML(
        problem, 
        payload.inputs, 
        steps, 
        `${ratio_1_part1}:${ratio_1_part2} অনুপাতে ${finalShare1_1} ও ${finalShare1_2} টাকা; ${ratio_2_part1}:${ratio_2_part2} অনুপাতে ${finalShare2_1} ও ${finalShare2_2} টাকা`, 
        inputLabels
    );
    
    const inputsData = {
        total_amount,
        ratio_1_part1,
        ratio_1_part2,
        ratio_2_part1,
        ratio_2_part2,
        labels: inputLabels
    };
    
    const workingFormula = `${ratio_1_part1}:${ratio_1_part2} → ${finalShare1_1}, ${finalShare1_2}; ${ratio_2_part1}:${ratio_2_part2} → ${finalShare2_1}, ${finalShare2_2}`;
    const finalAnswer = { 
        division1: {
            ratio: `${ratio_1_part1}:${ratio_1_part2}`,
            part1: finalShare1_1,
            part2: finalShare1_2
        },
        division2: {
            ratio: `${ratio_2_part1}:${ratio_2_part2}`,
            part1: finalShare2_1,
            part2: finalShare2_2
        }
    };
    
    return buildResponse(problem, inputsData, finalAnswer, workingFormula, htmlOutput, "solveDivideTotalByMultipleRatios");
}
