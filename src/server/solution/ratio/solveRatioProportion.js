import { solveBasicRatioProportion } from './solveBasicRatioProportion.js';
import { solveTotalAmountRatio } from './solveTotalAmountRatio.js';
import { solveFindMissingProporation } from './findMissingProporation.js';
import { solveDivideTotalByRatio } from './divideTotalByRatio.js';
import { solveRatioUpdateAndClassify } from './ratioUpdateAndClassify.js';
import { solveDivideTotalByMultipleRatios } from './divideTotalByMultipleRatios.js';

/**
 * Main router function for ratio and proportion problems
 * Routes to appropriate solver based on specialInstruction field
 * 
 * @param {Object} problem - Problem object with metadata
 * @param {string} type - Problem type
 * @param {Object} payload - Input payload with user values
 * @returns {Object} - Solution response
 */
export function solveRatioProportion(problem, payload) {
    try {
        // Route to appropriate solver based on specialInstruction
        const specialInstruction = problem.specialInstruction;
        
        switch (specialInstruction) {
            case 'find-missing-proportion':
                return solveFindMissingProporation(problem, payload);

            case 'divide-total-by-ratio':
                return solveDivideTotalByRatio(problem, payload);
            
            case 'ratio-update-and-classify':
                return solveRatioUpdateAndClassify(problem, payload);
            
            case 'divide-total-by-multiple-ratios':
                return solveDivideTotalByMultipleRatios(problem, payload);
            
            case 'total-amount-ratio':
                return solveTotalAmountRatio(problem, payload);
            
            default:
                // Default behavior for backward compatibility
                // return solveBasicRatioProportion(problem, payload);
        }
    } catch (error) {
        return {
            success: false,
            error: {
                message: error.message,
                code: "SOLUTION_ERROR",
            }
        };
    }
}


