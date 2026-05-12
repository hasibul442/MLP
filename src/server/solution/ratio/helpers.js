import { interpolateTemplate } from '@/utils/helper/admin/helper.js';
import { generateCompleteHTML } from '../../html/RatioHtml.js';

/**
 * Extract input labels from problem definition
 * @param {Array} inputs - Array of input definitions from problem
 * @returns {Object} - Object with input labels in both languages
 */
export function getInputLabels(inputs) {
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
export function generateSolutionHTML(problem, inputs, steps, finalAnswer, inputLabels) {
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
    const isEnglish = lang === 'en';
    const problemText = isEnglish
        ? interpolateTemplate(problem.template?.en, inputs)
        : interpolateTemplate(problem.template?.bn, inputs);
    
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
                    <p class="text-muted mt-3 mb-0">${steps.at(-1).explanation[lang]}</p>
                </div>
            </div>
        </div>
    </main>`;
}
