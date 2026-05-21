export async function formatClasses(classes, lang) {
    const formatted = [];
    for (const cls of classes) {
        formatted.push({
            id: cls._id,
            class_number: cls.class_number,
            class_name: cls.class_name?.[lang],
            description: cls.description?.[lang],
            slug: cls.slug,
        });
    }
    return formatted;
}
