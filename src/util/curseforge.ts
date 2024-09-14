export const PROJECT_CACHE: Map<number, Promise<Submission>> = new Map()
const delay = (ms = 1) => new Promise(r => setTimeout(r, ms));
const nameOverrides: Map<number, string> = new Map();
nameOverrides.set(920504, 'Cannibal Conundrum')
nameOverrides.set(538660, 'Phasmophobia')

const descriptionOverrides: Map<number, string> = new Map();
descriptionOverrides.set(931423, 'A magic mod revolving around witchery, autumn and the moon!')
descriptionOverrides.set(931255, 'Adds spooky structures, scrolls, and rituals.')
descriptionOverrides.set(930056, 'Be careful around flowers at night.. they might transform into monsters!')
descriptionOverrides.set(915336, 'Adds many bats with unique loot for spooky season.')
descriptionOverrides.set(930771, 'Become a Witch! Perform rituals, bound familiars and gain power.')
descriptionOverrides.set(928406, 'Adds a friendly pumpkin.')
descriptionOverrides.set(689943, "Help out the Pumpkillager! With custom encounters, rewards and a boss fight you'll get immersed in the story.")
descriptionOverrides.set(684453, "A mod which adds different things related to Curses.")
descriptionOverrides.set(690188, "A mod that adds your favorite screaming plant to Minecraft.")
descriptionOverrides.set(689392, "Adds crypts across your world!")
descriptionOverrides.set(535373, "In the midst of the journey of our life, I found myself in a dark wood without paths.")
descriptionOverrides.set(535636, "Spooky Halloween candy with fun effects!")
descriptionOverrides.set(534968, "Putting the 'trick' back into trick or treat™")
descriptionOverrides.set(411203, "Brew complex potions in a Pumpkin.")
descriptionOverrides.set(534412, "Makes weird, random occurrences happen occasionally when no one is watching.")
descriptionOverrides.set(532846, "Dark rituals at the cost of your mental health.")
descriptionOverrides.set(414324, "A minecraft mod which revolves around witches in undercover.")
descriptionOverrides.set(414159, "Adds a spooky autumn forest biome.")
descriptionOverrides.set(349597, "Adds spooky forest creatures like wisps, moths, the Zotzpyre, the Hidebehind, and the Hirschgeist.")
descriptionOverrides.set(304719, "Creepy eyes that stare at you from the darkness.")
descriptionOverrides.set(304170, "A mod that adds my own take on witchery's vampirism.")
descriptionOverrides.set(304036, "Scary monsters from the abyss.")
descriptionOverrides.set(280003, "A bundle of spooky biomes.")
descriptionOverrides.set(279200, "Costumes, Candy, and killing villagers.")
descriptionOverrides.set(279120, "Adds new Skeletal mobs and other scary features to make a better Halloween experience.")
descriptionOverrides.set(929025, "A spooky Voodoo-themed mod.")

export async function fetchMod(projectId: number): Promise<Submission> {
    1
    if (PROJECT_CACHE.has(projectId)) {
        return PROJECT_CACHE.get(projectId) as Promise<Submission>
    }
    const request: Promise<Submission> = fetchRecursive(projectId)
    PROJECT_CACHE.set(projectId, request)
    return request;
}

export async function fetchMods(projectIds: number[]): Promise<Submission[]> {
    const requests: Array<Submission> = [];
    for (const project of projectIds) {
        await delay()
        requests.push(await fetchMod(project));
    }
    return Promise.all(requests);
}

async function fetchRecursive(projectId: number): Promise<Submission> {
    return await fetch(`https://api.cfwidget.com/${projectId}`)
        .then(res => res.json())
        .then(json => json as ProjectData)
        .then(data => fromProject(data))
        .catch(reason => {
            console.log(`Failed to get data from CurseForge for project ${projectId}: ${reason}. Trying again.`);
            return fetchRecursive(projectId);
        })
}

const validLoaderTags = ['Fabric', 'Forge', 'NeoForge', 'Quilt']
function fromProject(project: ProjectData): Submission {
    const loaderTags: Set<string> = new Set()
    project.files.forEach(file => {
        validLoaderTags.forEach(tag => {
            if (file.versions.includes(tag)) {
                loaderTags.add(tag)
            }
        })
    })
    console.log(loaderTags.size)

    return {
        id: project.id,
        title: nameOverrides.get(project.id) ?? project.title,
        summary: descriptionOverrides.get(project.id) ?? project.summary,
        url: project.urls.curseforge,
        logo: project.thumbnail,
        created_at: project.created_at,
        downloads: project.downloads.total,
        members: project.members.map(m => m.username),
        loaders: Array.from(loaderTags)
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
    loaders: string[]
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