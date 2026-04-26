import { NextResponse } from "next/server";
import Category from "@/server/models/Category";
import { genarateSlug } from "@/utils/helper/helper";
import { formateCategory } from "../services/CategoryServices";

export async function getCategories(req, res) {
    try {
        const language = req.headers.get("x-accept-language") || null;
        const categories = await Category.find().sort({ order: 1 });
        if (language) {
            const formattedCategories = await formateCategory(categories, language);
            console.log("Formatted Categories:", formattedCategories);
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