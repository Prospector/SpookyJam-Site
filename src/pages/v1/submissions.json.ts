import type {APIContext} from "astro";
import {fetchMods, type Submission} from "../../util/curseforge.js";
import {SUBMISSIONS} from "../../config.js";

export async function GET(context: APIContext) {
    const projectData: Map<String, Submission[]> = new Map()
    for (const year of SUBMISSIONS.keys()) {
        projectData.set(year, await fetchMods(SUBMISSIONS.get(year) ?? []))
    }
    return Response.json(Object.fromEntries(projectData))
}