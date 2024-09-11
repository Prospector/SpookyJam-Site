import type {APIContext, APIRoute} from 'astro';
import {fetchMods, type Submission} from "../../../util/curseforge.js";
import {SUBMISSIONS} from "../../../config.js";

export async function GET(context: APIContext) {
    const yearName = context.params.year ?? ""
    return Response.json({ submissions: await fetchMods(SUBMISSIONS.get(yearName) ?? [])})
}

export function getStaticPaths() {
    return Array.from(SUBMISSIONS.keys()).map(yearName => {
        return {params: {year: `${yearName}`}}
    })
}