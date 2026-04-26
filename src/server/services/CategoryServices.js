export async function formateCategory(categories, lang) {
    const formatted = [];
    for (const category of categories) {
        formatted.push({
            id: category._id,
            title: category.title?.[lang],
            description: category.description?.[lang],
            slug: category.slug,
            icon: category.icon,
            order: category.order,
        });
    }
    return formatted;
}