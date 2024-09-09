export const PROJECT_CACHE: Map<number, Promise<ProjectData>> = new Map()
const delay = (ms = 1) => new Promise(r => setTimeout(r, ms));

export async function fetchMod(projectId: number): Promise<ProjectData> {1
    if (PROJECT_CACHE.has(projectId)) {
        return PROJECT_CACHE.get(projectId) as Promise<ProjectData>
    }
    const request: Promise<ProjectData> = fetchRecursive(projectId)
    PROJECT_CACHE.set(projectId, request)
    return request;
}

async function fetchRecursive(projectId: number): Promise<ProjectData> {
    return await fetch(`https://api.cfwidget.com/${projectId}`)
        .then(res => res.json())
        .then(json => json as ProjectData)
        .catch(reason => {
            console.log(`Failed to get data from CurseForge for project ${projectId}: ${reason}. Trying again.`);
            return fetchRecursive(projectId);
        })
}

export async function fetchMods(projectIds: number[]): Promise<ProjectData[]> {
    const requests: Array<ProjectData> = [];
    for (const project of projectIds) {
        await delay()
        requests.push(await fetchMod(project));
    }
    return Promise.all(requests);
}

export interface ProjectData {
    id: number
    title: string
    summary: string
    description: string
    game: string
    type: string
    urls: Urls
    thumbnail: string
    created_at: string
    downloads: Downloads
    license: string
    donate: string
    categories: string[]
    members: Member[]
    links: any[]
    files: File[]
    download: Download
}

export interface Urls {
    curseforge: string
    project: string
}

export interface Downloads {
    monthly: number
    total: number
}

export interface Member {
    title: string
    username: string
    id: number
}

export interface File {
    id: number
    url: string
    display: string
    name: string
    type: string
    version: string
    filesize: number
    versions: string[]
    downloads: number
    uploaded_at: string
}

export interface Download {
    id: number
    url: string
    display: string
    name: string
    type: string
    version: string
    filesize: number
    versions: string[]
    downloads: number
    uploaded_at: string
}