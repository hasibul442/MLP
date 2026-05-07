import { NextResponse } from "next/server";
import Category from "@/server/models/Category";
import { genarateSlug } from "@/utils/helper/helper";
import { formateCategory } from "../services/CategoryServices";
import ProblemType from "../models/ProblemType";

export async function getCategories(req, res) {
    try {
        const language = req.headers.get("x-accept-language") || null;
        const categories = await Category.find().sort({ order: 1 });
        if (language) {
            const formattedCategories = await formateCategory(categories, language);
            return NextResponse.json(formattedCategories, { status: 200 });
        } else {
            return NextResponse.json(categories, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function createCategory(req) {
    try {
        const payload = await req.json();
        const dataFormat = {
            title: {
                en: payload.title_en,
                bn: payload.title_bn,
            },
            description: {
                en: payload.description_en,
                bn: payload.description_bn,
            },
            slug: await genarateSlug(payload.title_en),
            icon: payload.icon,
            order: payload.order,
        };
        
        const newCategory = new Category(dataFormat);
        await newCategory.save();
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function getCategoryById(id, req) {
    try {
        const language = req.headers.get("x-accept-language") || null;
        let category = await Category.findById(id).lean();
        const subcat = await ProblemType.find({ categoryId: id }).lean();
        
        if (language) {
            const formattedCategory = await formateCategory([category], language);
            const formattedSubcat = await formateCategory(subcat, language);
            formattedCategory[0].problem_types = formattedSubcat;
            return formattedCategory[0];
        } else {
            category.problem_types = subcat;
            return category;
        }
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        throw new Error("Failed to fetch category");
    }
}