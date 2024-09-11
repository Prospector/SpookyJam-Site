# SpookyJam Site
This repo contains the source code for the official SpookyJam website. The site can be viewed in production 
[here](https://spooky-jam.com).

## Technical Information
This project is built with [AstroJS](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/). The website is 
static and we try to avoid shipping JavaScript when possible. We also use the [CFWidget](https://cfwidget.com/) API to 
pull project data.

## Site API
We now have an experimental API that will allow you to pull in JSON data about the event and our participating projects.
This API is statically generated and statistics like download counts will only update periodically.

### Data Types

#### Submission
| Property   | Type     | Description                                                     |
|------------|----------|-----------------------------------------------------------------|
| id         | number   | A unique ID for the project on CurseForge.                      |
| title      | string   | The display name of the project.                                |
| summary    | string   | A short description of the project.                             |
| url        | string   | A URL that points to the project on CurseForge.                 |
| logo       | string   | A URL that points to the project logo on CurseForge.            |
| created_at | string   | A timestamp of when the CurseForge project was created.         |
| downloads  | number   | The amount of downloads the project has received on CurseForge. |
| members    | string[] | Usernames of the authors on CurseForge.                         |

#### StatsJson
| Property     | Type   | Description                                     |
|--------------|--------|-------------------------------------------------|
| submissions  | number | The number of unique submissions received.      |
| participants | number | The number of unique participants.              |
| downloads    | number | The sum of downloads all submissions received.  |

### Endpoints

#### `/v1/submissions.json`
Returns a map of submissions received each year. The key is the name of the year and the value is an array of submission
objects.

#### `/v1/submissions/[year].json`
Returns an array of submissions that were received for the specified year.

#### `/v1/stats.json`
Returns a map of stats for each year. The key is the name of the year and the value is a StatsJson object.
