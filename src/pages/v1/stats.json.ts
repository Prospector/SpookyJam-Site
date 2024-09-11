import type {APIContext} from "astro";
import {fetchMods, type Submission} from "../../util/curseforge.js";
import {SUBMISSIONS} from "../../config.js";

export async function GET(context: APIContext) {
    const projectData: Map<String, StatsJson> = new Map()
    for (const year of SUBMISSIONS.keys()) {
        const submissions: Submission[] = await fetchMods(SUBMISSIONS.get(year) ?? []);
        const allAuthors = new Set();
        submissions.forEach((project) => project.members.forEach((author) => allAuthors.add(author)));
        const downloadSum = submissions.reduce((downloads, project) => downloads + project.downloads, 0);
        projectData.set(year, {
            submissions: submissions.length,
            participants: allAuthors.size,
            downloads: downloadSum
        })
    }
    return Response.json(Object.fromEntries(projectData))
}

export interface StatsJson {
    submissions: number
    participants: number
    downloads: number
}
