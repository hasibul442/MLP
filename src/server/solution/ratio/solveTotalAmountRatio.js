import { buildResponse } from '../ResponseBuilder.js';
import { getInputLabels, generateSolutionHTML } from './helpers.js';


export function solveTotalAmountRatio(problem,  payload) {
    
    const { total_amount, ratio_1_part1, ratio_1_part2, ratio_2_part1, ratio_2_part2 } = payload.inputs;

    const hasSecondRatio = ratio_2_part1 !== undefined
        && ratio_2_part1 !== null
        && ratio_2_part1 !== ''
        && ratio_2_part2 !== undefined
        && ratio_2_part2 !== null
        && ratio_2_part2 !== '';

    const totalAmount = Number(total_amount);
    const ratio1Part1 = Number(ratio_1_part1);
    const ratio1Part2 = Number(ratio_1_part2);
    const ratio2Part1 = hasSecondRatio ? Number(ratio_2_part1) : null;
    const ratio2Part2 = hasSecondRatio ? Number(ratio_2_part2) : null;

    // Validate inputs
    const numericInputs = [totalAmount, ratio1Part1, ratio1Part2];
    if (numericInputs.some((value) => !Number.isFinite(value))) {
        throw new Error("Missing or invalid inputs");
    }

    if (numericInputs.some((value) => value <= 0)) {
        throw new Error("All input values must be positive");
    }

    if (hasSecondRatio) {
        const ratio2Inputs = [ratio2Part1, ratio2Part2];
        if (ratio2Inputs.some((value) => !Number.isFinite(value))) {
            throw new Error("Missing or invalid inputs");
        }

        if (ratio2Inputs.some((value) => value <= 0)) {
            throw new Error("All input values must be positive");
        }
    }

    const inputLabels = getInputLabels(problem.inputs);

    const roundValue = (value) => (Number.isInteger(value) ? value : Number.parseFloat(value.toFixed(2)));

    const adjustSharesToTotal = (shares, total) => {
        const roundedTotal = roundValue(total);
        const roundedShares = shares.map((value) => roundValue(value));
        const roundedSum = roundValue(roundedShares.reduce((sum, value) => sum + value, 0));

        if (Math.abs(roundedSum - roundedTotal) >= 0.01) {
            const sumExceptLast = roundedShares.slice(0, -1).reduce((sum, value) => sum + value, 0);
            roundedShares[roundedShares.length - 1] = roundValue(roundedTotal - sumExceptLast);
            if (Object.is(roundedShares[roundedShares.length - 1], -0)) {
                roundedShares[roundedShares.length - 1] = 0;
            }
        }

        const finalTotal = roundValue(roundedShares.reduce((sum, value) => sum + value, 0));
        return { roundedShares, finalTotal };
    };

    if (!hasSecondRatio) {
        const totalParts = ratio1Part1 + ratio1Part2;
        const onePartValue = totalAmount / totalParts;
        const amountA = ratio1Part1 * onePartValue;
        const amountB = ratio1Part2 * onePartValue;
        const { roundedShares, finalTotal } = adjustSharesToTotal([amountA, amountB], totalAmount);
        const [finalA, finalB] = roundedShares;

        const steps = [
            {
                step: 1,
                description: {
                    en: `Given Information`,
                    bn: `প্রদত্ত আছে`
                },
                formula: null,
                explanation: {
                    en: `Total Amount = ${totalAmount} Taka\nRatio = ${ratio1Part1} : ${ratio1Part2}`,
                    bn: `মোট টাকা = ${totalAmount} টাকা\nঅনুপাত = ${ratio1Part1} : ${ratio1Part2}`
                },
                result: null
            },
            {
                step: 2,
                description: {
                    en: `Find Total Parts`,
                    bn: `মোট অংশ নির্ণয়`
                },
                formula: `${ratio1Part1} + ${ratio1Part2} = ${totalParts}`,
                calculation: null,
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
                formula: `1 অংশ = ${totalAmount} ÷ ${totalParts}`,
                calculation: `= ${totalAmount} / ${totalParts}\n= ${onePartValue}`,
                explanation: {
                    en: `Divide total amount by total parts`,
                    bn: `মোট টাকাকে মোট অংশ দিয়ে ভাগ করি`
                },
                result: onePartValue
            },
            {
                step: 4,
                description: {
                    en: `Calculate First Share`,
                    bn: `প্রথম অংশের পরিমাণ`
                },
                formula: `A = ${ratio1Part1} × ${onePartValue}`,
                calculation: `= ${ratio1Part1} × ${onePartValue}\n= ${finalA}`,
                explanation: {
                    en: `First share (A)`,
                    bn: `প্রথম অংশ (ক)`
                },
                result: `${finalA} টাকা`
            },
            {
                step: 5,
                description: {
                    en: `Calculate Second Share`,
                    bn: `দ্বিতীয় অংশের পরিমাণ`
                },
                formula: `B = ${ratio1Part2} × ${onePartValue}`,
                calculation: `= ${ratio1Part2} × ${onePartValue}\n= ${finalB}`,
                explanation: {
                    en: `Second share (B)`,
                    bn: `দ্বিতীয় অংশ (খ)`
                },
                result: `${finalB} টাকা`
            },
            {
                step: 6,
                description: {
                    en: `Answer`,
                    bn: `উত্তর`
                },
                formula: null,
                calculation: null,
                explanation: {
                    en: `Two shares are:\nA = ${finalA} Taka\nB = ${finalB} Taka\nTotal = ${finalTotal} Taka`,
                    bn: `দুইটি অংশ হলো:\nক = ${finalA} টাকা\nখ = ${finalB} টাকা\nমোট = ${finalTotal} টাকা`
                },
                result: `${finalA}, ${finalB} টাকা`
            }
        ];

        const htmlOutput = generateSolutionHTML(problem, payload.inputs, steps, `${finalA}, ${finalB} টাকা`, inputLabels);

        const inputsData = {
            total_amount: totalAmount,
            ratio_1_part1: ratio1Part1,
            ratio_1_part2: ratio1Part2,
            labels: inputLabels
        };

        const workingFormula = `A:B = ${ratio1Part1}:${ratio1Part2}; A=${finalA}, B=${finalB}`;
        const finalAnswer = {
            partA: finalA,
            partB: finalB,
            combinedRatio: `${ratio1Part1}:${ratio1Part2}`
        };

        return buildResponse(problem, inputsData, finalAnswer, workingFormula, htmlOutput, "solveRatioProportion");
    }

    // Find LCM to combine ratios
    // A:B = ratio_1_part1:ratio_1_part2
    // B:C = ratio_2_part1:ratio_2_part2
    // We need to make B equal in both ratios
    
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    
    const lcmValue = lcm(ratio1Part2, ratio2Part1);
    
    // Adjust ratios to have common middle term
    const multiplier1 = lcmValue / ratio1Part2; // For first ratio
    const multiplier2 = lcmValue / ratio2Part1; // For second ratio
    
    const partA = ratio1Part1 * multiplier1;
    const partB = lcmValue; // Common term
    const partC = ratio2Part2 * multiplier2;
    
    // Calculate combined ratio A:B:C
    const totalParts = partA + partB + partC;
    const onePartValue = totalAmount / totalParts;
    
    // Calculate actual amounts
    const amountA = partA * onePartValue;
    const amountB = partB * onePartValue;
    const amountC = partC * onePartValue;
    
    const { roundedShares, finalTotal } = adjustSharesToTotal([amountA, amountB, amountC], totalAmount);
    const [finalA, finalB, finalC] = roundedShares;
    
    // Build solution steps
    const steps = [
        {
            step: 1,
            description: {
                en: `Given Information`,
                bn: `প্রদত্ত আছে`
            },
            formula: null,
            explanation: {
                en: `Total Amount = ${totalAmount} Taka\nFirst Ratio = ${ratio1Part1} : ${ratio1Part2}\nSecond Ratio = ${ratio2Part1} : ${ratio2Part2}`,
                bn: `মোট টাকা = ${totalAmount} টাকা\nপ্রথম অনুপাত = ${ratio1Part1} : ${ratio1Part2}\nদ্বিতীয় অনুপাত = ${ratio2Part1} : ${ratio2Part2}`
            },
            result: null
        },
        {
            step: 2,
            description: {
                en: `Understanding the Problem`,
                bn: `সমস্যা বুঝি`
            },
            formula: null,
            explanation: {
                en: `We need to divide ${totalAmount} into three parts (A, B, C)\nWhere A:B = ${ratio1Part1}:${ratio1Part2} and B:C = ${ratio2Part1}:${ratio2Part2}`,
                bn: `${totalAmount} টাকাকে তিনটি অংশে (ক, খ, গ) ভাগ করতে হবে\nযেখানে ক:খ = ${ratio1Part1}:${ratio1Part2} এবং খ:গ = ${ratio2Part1}:${ratio2Part2}`
            },
            result: null
        },
        {
            step: 3,
            description: {
                en: `Find LCM of Middle Terms`,
                bn: `মধ্যম পদের ল.সা.গু নির্ণয়`
            },
            formula: `LCM(${ratio1Part2}, ${ratio2Part1}) = ${lcmValue}`,
            calculation: null,
            explanation: {
                en: `The middle term B appears as ${ratio1Part2} in first ratio and ${ratio2Part1} in second ratio\nWe need to make them equal using LCM`,
                bn: `মধ্যম পদ খ প্রথম অনুপাতে ${ratio1Part2} এবং দ্বিতীয় অনুপাতে ${ratio2Part1}\nল.সা.গু ব্যবহার করে সমান করতে হবে`
            },
            result: lcmValue
        },
        {
            step: 4,
            description: {
                en: `Adjust First Ratio`,
                bn: `প্রথম অনুপাত সমন্বয়`
            },
            formula: `${ratio1Part1}:${ratio1Part2} = ${partA}:${partB}`,
            calculation: `Multiply by ${multiplier1}\n= ${ratio1Part1}×${multiplier1} : ${ratio1Part2}×${multiplier1}\n= ${partA}:${partB}`,
            explanation: {
                en: `Multiply both terms by ${multiplier1} to make B = ${lcmValue}`,
                bn: `উভয় পদকে ${multiplier1} দিয়ে গুণ করে খ = ${lcmValue} করি`
            },
            result: `${partA}:${partB}`
        },
        {
            step: 5,
            description: {
                en: `Adjust Second Ratio`,
                bn: `দ্বিতীয় অনুপাত সমন্বয়`
            },
            formula: `${ratio2Part1}:${ratio2Part2} = ${partB}:${partC}`,
            calculation: `Multiply by ${multiplier2}\n= ${ratio2Part1}×${multiplier2} : ${ratio2Part2}×${multiplier2}\n= ${partB}:${partC}`,
            explanation: {
                en: `Multiply both terms by ${multiplier2} to make B = ${lcmValue}`,
                bn: `উভয় পদকে ${multiplier2} দিয়ে গুণ করে খ = ${lcmValue} করি`
            },
            result: `${partB}:${partC}`
        },
        {
            step: 6,
            description: {
                en: `Combined Ratio`,
                bn: `যুক্ত অনুপাত`
            },
            formula: `A:B:C = ${partA}:${partB}:${partC}`,
            calculation: null,
            explanation: {
                en: `Now we have the complete ratio A:B:C`,
                bn: `এখন আমাদের কাছে সম্পূর্ণ অনুপাত ক:খ:গ আছে`
            },
            result: `${partA}:${partB}:${partC}`
        },
        {
            step: 7,
            description: {
                en: `Find Total Parts`,
                bn: `মোট অংশ নির্ণয়`
            },
            formula: `${partA} + ${partB} + ${partC} = ${totalParts}`,
            calculation: null,
            explanation: {
                en: `Add all ratio parts together`,
                bn: `সকল অনুপাত অংশ যোগ করি`
            },
            result: totalParts
        },
        {
            step: 8,
            description: {
                en: `Find Value of 1 Part`,
                bn: `১ অংশের মান`
            },
            formula: `1 অংশ = ${totalAmount} ÷ ${totalParts}`,
            calculation: `= ${totalAmount} / ${totalParts}\n= ${onePartValue}`,
            explanation: {
                en: `Divide total amount by total parts`,
                bn: `মোট টাকাকে মোট অংশ দিয়ে ভাগ করি`
            },
            result: onePartValue
        },
        {
            step: 9,
            description: {
                en: `Calculate Amount A`,
                bn: `ক এর পরিমাণ হিসাব`
            },
            formula: `A = ${partA} × ${onePartValue}`,
            calculation: `= ${partA} × ${onePartValue}\n= ${finalA}`,
            explanation: {
                en: `First share (A)`,
                bn: `প্রথম অংশ (ক)`
            },
            result: `${finalA} টাকা`
        },
        {
            step: 10,
            description: {
                en: `Calculate Amount B`,
                bn: `খ এর পরিমাণ হিসাব`
            },
            formula: `B = ${partB} × ${onePartValue}`,
            calculation: `= ${partB} × ${onePartValue}\n= ${finalB}`,
            explanation: {
                en: `Second share (B)`,
                bn: `দ্বিতীয় অংশ (খ)`
            },
            result: `${finalB} টাকা`
        },
        {
            step: 11,
            description: {
                en: `Calculate Amount C`,
                bn: `গ এর পরিমাণ হিসাব`
            },
            formula: `C = ${partC} × ${onePartValue}`,
            calculation: `= ${partC} × ${onePartValue}\n= ${finalC}`,
            explanation: {
                en: `Third share (C)`,
                bn: `তৃতীয় অংশ (গ)`
            },
            result: `${finalC} টাকা`
        },
        {
            step: 12,
            description: {
                en: `Answer`,
                bn: `উত্তর`
            },
            formula: null,
            calculation: null,
            explanation: {
                en: `Three shares are:\nA = ${finalA} Taka\nB = ${finalB} Taka\nC = ${finalC} Taka\nTotal = ${finalTotal} Taka`,
                bn: `তিনটি অংশ হলো:\nক = ${finalA} টাকা\nখ = ${finalB} টাকা\nগ = ${finalC} টাকা\nমোট = ${finalTotal} টাকা`
            },
            result: `${finalA}, ${finalB}, ${finalC} টাকা`
        }
    ];

    const htmlOutput = generateSolutionHTML(problem, payload.inputs, steps, `${finalA}, ${finalB}, ${finalC} টাকা`, inputLabels);

    const inputsData = {
        total_amount: totalAmount,
        ratio_1_part1: ratio1Part1,
        ratio_1_part2: ratio1Part2,
        ratio_2_part1: ratio2Part1,
        ratio_2_part2: ratio2Part2,
        labels: inputLabels
    };

    const workingFormula = `A:B:C = ${partA}:${partB}:${partC}; A=${finalA}, B=${finalB}, C=${finalC}`;
    const finalAnswer = {
        partA: finalA,
        partB: finalB,
        partC: finalC,
        combinedRatio: `${partA}:${partB}:${partC}`
    };

    return buildResponse(problem, inputsData, finalAnswer, workingFormula, htmlOutput, "solveRatioProportion");
}