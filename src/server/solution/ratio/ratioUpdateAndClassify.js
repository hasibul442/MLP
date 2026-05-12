import { buildResponse } from '../ResponseBuilder.js';
import { getInputLabels, generateSolutionHTML } from './helpers.js';

/**
 * 
 * @param {Object} problem - Problem object from database
 * @param {Object} payload - Input payload with user inputs
 * @returns {Object} - Solution response
 */
export function solveRatioUpdateAndClassify(problem, payload) {
    const { variable_1, variable_2, variable_3, variable_4 } = payload.inputs;
    
    // Validate inputs
    if (!variable_1 || !variable_2 || !variable_3 || variable_4 === undefined) {
        throw new Error("Missing required inputs");
    }

    if (variable_1 <= 0 || variable_2 <= 0 || variable_3 <= 0 || variable_4 < 0) {
        throw new Error("Input values must be positive (variable_4 can be 0)");
    }

    const inputLabels = getInputLabels(problem.inputs);
    
    // Part 1: Calculate second item's value using cross multiplication
    // variable_1 : variable_2 = variable_3 : price_2
    // price_2 = (variable_2 × variable_3) / variable_1
    const price2 = (variable_2 * variable_3) / variable_1;
    
    // Format price_2
    const isWholePrice2 = Number.isInteger(price2);
    const finalPrice2 = isWholePrice2 ? price2 : Number.parseFloat(price2.toFixed(2));
    
    // Part 2: Calculate new price after increase
    const newPrice1 = variable_3 + variable_4;
    
    // Part 3: Calculate new ratio and simplify
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const ratioGcd = gcd(newPrice1, finalPrice2);
    const simplifiedNewRatio1 = newPrice1 / ratioGcd;
    const simplifiedNewRatio2 = finalPrice2 / ratioGcd;
    
    // Part 4: Classify ratio type
    let ratioType = {
        en: "",
        bn: ""
    };
    
    const ratioComparison = newPrice1 / finalPrice2;
    
    if (Math.abs(ratioComparison - 1) < 0.0001) {
        ratioType = {
            en: "Equal Ratio (1:1)",
            bn: "সমান অনুপাত (১:১)"
        };
    } else if (ratioComparison > 1) {
        ratioType = {
            en: "Greater Ratio (First > Second)",
            bn: "বৃহত্তর অনুপাত (প্রথম > দ্বিতীয়)"
        };
    } else {
        ratioType = {
            en: "Smaller Ratio (First < Second)",
            bn: "ক্ষুদ্রতর অনুপাত (প্রথম < দ্বিতীয়)"
        };
    }
    
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
                en: `Original Ratio = ${variable_1} : ${variable_2}\nFirst Item Price = ${variable_3}\nPrice Increase = ${variable_4}`,
                bn: `মূল অনুপাত = ${variable_1} : ${variable_2}\nপ্রথম আইটেমের দাম = ${variable_3}\nদাম বৃদ্ধি = ${variable_4}`
            },
            result: null
        },
        {
            step: 2,
            description: {
                en: `Find Second Item Price`,
                bn: `দ্বিতীয় আইটেমের দাম নির্ণয়`
            },
            formula: `${variable_1} : ${variable_2} = ${variable_3} : x`,
            calculation: `x = (${variable_2} × ${variable_3}) / ${variable_1}\n= ${variable_2 * variable_3} / ${variable_1}\n= ${finalPrice2}`,
            explanation: {
                en: `Use cross multiplication to find second price`,
                bn: `গুণোত্তর প্রয়োগ করে দ্বিতীয় দাম বের করি`
            },
            result: finalPrice2
        },
        {
            step: 3,
            description: {
                en: `Calculate New Price After Increase`,
                bn: `বৃদ্ধির পর নতুন দাম হিসাব`
            },
            formula: `নতুন প্রথম দাম = ${variable_3} + ${variable_4}`,
            calculation: `= ${newPrice1}`,
            explanation: {
                en: `Add price increase to original first price`,
                bn: `মূল প্রথম দামের সাথে বৃদ্ধি যোগ করি`
            },
            result: newPrice1
        },
        {
            step: 4,
            description: {
                en: `Find New Ratio`,
                bn: `নতুন অনুপাত নির্ণয়`
            },
            formula: `${newPrice1} : ${finalPrice2}`,
            calculation: `সরলীকৃত = ${simplifiedNewRatio1} : ${simplifiedNewRatio2}`,
            explanation: {
                en: `New ratio after price change`,
                bn: `দাম পরিবর্তনের পর নতুন অনুপাত`
            },
            result: `${simplifiedNewRatio1} : ${simplifiedNewRatio2}`
        },
        {
            step: 5,
            description: {
                en: `Classify Ratio Type`,
                bn: `অনুপাতের ধরন শ্রেণীবদ্ধকরণ`
            },
            formula: null,
            calculation: ratioComparison === 1 
                ? `${newPrice1} = ${finalPrice2}` 
                : ratioComparison > 1 
                    ? `${newPrice1} > ${finalPrice2}` 
                    : `${newPrice1} < ${finalPrice2}`,
            explanation: {
                en: `Compare the two values to determine ratio type`,
                bn: `দুটি মান তুলনা করে অনুপাতের ধরন নির্ণয় করি`
            },
            result: ratioType.bn
        },
        {
            step: 6,
            description: {
                en: `Final Answer`,
                bn: `চূড়ান্ত উত্তর`
            },
            formula: null,
            calculation: null,
            explanation: {
                en: `Second Item Price = ${finalPrice2}\nNew Ratio Type = ${ratioType.en}`,
                bn: `দ্বিতীয় আইটেমের দাম = ${finalPrice2}\nনতুন অনুপাতের ধরন = ${ratioType.bn}`
            },
            result: `${finalPrice2}, ${ratioType.bn}`
        }
    ];
    
    const htmlOutput = generateSolutionHTML(
        problem, 
        payload.inputs, 
        steps, 
        `দ্বিতীয় দাম: ${finalPrice2}, অনুপাতের ধরন: ${ratioType.bn}`, 
        inputLabels
    );
    
    const inputsData = {
        variable_1,
        variable_2,
        variable_3,
        variable_4,
        labels: inputLabels
    };
    
    const workingFormula = `(${variable_2} × ${variable_3}) / ${variable_1} = ${finalPrice2}; New Ratio: ${simplifiedNewRatio1}:${simplifiedNewRatio2}`;
    const finalAnswer = { 
        secondPrice: finalPrice2,
        newPrice1: newPrice1,
        newRatio: `${simplifiedNewRatio1}:${simplifiedNewRatio2}`,
        ratioType: ratioType.bn,
        ratioTypeEn: ratioType.en
    };
    
    return buildResponse(problem, inputsData, finalAnswer, workingFormula, htmlOutput, "solveRatioUpdateAndClassify");
}
