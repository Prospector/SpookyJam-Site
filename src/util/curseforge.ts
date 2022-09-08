// TODO Maybe consider developing a TypeScript library for using the CF API?
export async function fetchMod(projectId: number, apiKey: string): Promise<ProjectData> {

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Accept', 'application/json');
    requestHeaders.set('x-api-key', apiKey);

    return await fetch(`https://api.curseforge.com/v1/mods/${projectId}`, {
        method: 'GET',
        headers: requestHeaders
    })

        // Convert to JSON
        .then(response => {

            if (!response.ok) {
                console.log(`Failed to get data from CurseForge for project ${projectId}. Trying again.`);
                return fetchMod(projectId, apiKey);
            }

            return response.json();
        })

        // Convert JSON to response type.
        .then(json => {
            return json as Promise<RawData<RawProject>>;
        })

        // Covert response type to our type.
        .then(rawData => {

            return mapToProjectData(rawData.data);
        });
}

export async function fetchMods(projectIds: number[], apiKey: string): Promise<ProjectData[]> {

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json')
    requestHeaders.set('Accept', 'application/json');
    requestHeaders.set('x-api-key', apiKey);

    return await fetch(`https://api.curseforge.com/v1/mods`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            modIds: projectIds
        })
    })

        // Convert to JSON
        .then(response => {

            if (!response.ok) {
                console.log(`Failed to get data from CurseForge for projects ${projectIds}. Trying again.`);
                return fetchMods(projectIds, apiKey);
            }

            return response.json();
        })

        // Convert JSON to response type.
        .then(rawJson => {

            return rawJson as Promise<RawData<RawProject[]>>;
        })

        // Convert response type to our type.
        .then(rawData => {

            return rawData.data.map(entry => mapToProjectData(entry)) as ProjectData[];
        });
}

function mapToProjectData(rawProject: RawProject): ProjectData {

    return <ProjectData>{
        id: rawProject.id,
        name: rawProject.name,
        slug: rawProject.slug,
        summary: rawProject.summary,
        downloads: rawProject.downloadCount,
        url: rawProject.links.websiteUrl,
        logo: rawProject.logo.thumbnailUrl,
        authors: rawProject.authors.map((rawAuthor: RawAuthor) => ({
            name: rawAuthor.name,
            profile: rawAuthor.url
        })) as Author[],
        pubDate: new Date(rawProject.dateReleased)
    };
}

export type Author = {

    name: string;
    profile: string;
}

export type ProjectData = {

    id: number;
    name: string;
    slug: string;
    summary: string;
    downloads: number;
    url: string;
    logo: string;
    authors: Author[];
    pubDate: Date;
}

interface RawData<T> {

    data: T
}

interface RawProject {

    id: number,
    name: string,
    slug: string,
    summary: string,
    downloadCount: number,
    links: RawLinks,
    logo: RawLogo,
    authors: RawAuthor[],
    dateReleased: Date,
    dateCreated: Date,
    allowModDistribution: boolean

}

interface RawAuthor {
    id: number,
    name: string,
    url: string
}

interface RawLogo {

    id: number,
    title: string,
    description: string,
    thumbnailUrl: string,
    url: string
}

interface RawLinks {

    websiteUrl: string,
    wikiUrl: string,
    issueUrl: string,
    sourceUrl: string
}