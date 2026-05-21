import { NextResponse } from "next/server";
import Classes from "@/server/models/Classes";
import { formatClasses } from "../services/ClassServices";
import { genarateSlug } from "@/utils/helper/helper";

export async function getClassList(req) {
    try{
        const lang = req.headers.get("x-accept-language") || null;
        const classes = await Classes.find().sort({ slug: 1 });
        if (lang) {
            const formattedClasses = await formatClasses(classes, lang);
            return NextResponse.json(formattedClasses, { status: 200 });
        } else {
            return NextResponse.json(classes, { status: 200 });
        }
    } catch (error) {
            console.error("Error fetching class list:", error);
            return NextResponse.json({ error: "Failed to fetch class list" }, { status: 500 });
        }
}

export async function createClass(req) {
    try {
        const payload = await req.json();
        const dataFormat = {
            class_number: payload.class_number,
            class_name: {
                en: payload.class_name_en,
                bn: payload.class_name_bn,
            },
            description: {
                en: payload.description_en,
                bn: payload.description_bn,
            },
            slug: await genarateSlug(payload.class_name_en),
        };

        const newClass = new Classes(dataFormat);
        await newClass.save();
        return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
        console.error("Error creating class:", error);
        return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
    }
}
