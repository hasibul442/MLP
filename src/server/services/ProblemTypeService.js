export async function formateProblemType(problemTypes, lang) {
    const formatted = [];
    for (const problemType of problemTypes) {
        formatted.push({
            id: problemType._id,
            title: problemType.title?.[lang],
            description: problemType.description?.[lang],
            slug: problemType.slug,
            categoryId: problemType.categoryId,
            solverKey: problemType.solverKey,
            explanationKey: problemType.explanationKey,
            storyKey: problemType.storyKey,
            visualKey: problemType.visualKey,
            difficulty: problemType.difficulty,
            classRange: problemType.classRange,
        });
    }
    return formatted;
}