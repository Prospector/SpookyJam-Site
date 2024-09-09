import type {APIContext} from "astro";
import {fetchMods, type ProjectData,} from "../../util/curseforge.js";
import {SUBMISSIONS} from "../../config.js";

export async function GET(context: APIContext) {
    const projectData: Map<String, Submission[]> = new Map()
    for (const year of SUBMISSIONS.keys()) {
        const projects = await fetchMods(SUBMISSIONS.get(year) ?? [])
        projectData.set(year, projects.map(p => fromProject(p)))
    }
    return new Response(JSON.stringify(Object.fromEntries(projectData)))
}

function fromProject(project: ProjectData): Submission {
    return {
        id: project.id,
        title: project.title,
        summary: project.summary,
        url: project.urls.curseforge,
        logo: project.thumbnail,
        created_at: project.created_at,
        downloads: project.downloads.total,
        members: project.members.map(m => m.username)
    }
}

export interface Submission {
    id: number
    title: string
    summary: string
    url: string
    logo: string
    created_at: string
    downloads: number
    members: string[]
}