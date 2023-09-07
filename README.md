# SpookyJam Site
This repo contains the source code for the official SpookyJam website. The site can be viewed in production 
[here](spooky-jam.com).

## Technical Information
This project is built with [AstroJS](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/). The website is 
static and we try to avoid shipping JavaScript when possible. We also use the 
[CurseForge Eternal API](https://docs.curseforge.com) which will require an API key to build the project. The CurseForge
 API key can be speciefied by setting `CURSEFORGE_API_KEY` in your `.env` file.