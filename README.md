# LinkedIn Job Scraper
This project includes 1) A web scraper for Linkedin that retrieves job postings, 2) an API server to get postings and companies from store files, and 3) a front-end to view postings and remove companies.

The intention of this project is allow a job seeker more control over viewing job postings that are not relevant by allowing selected companies to be filtered out from results. It is not intended as means of data mining or harvesting.

## Commands
Action | Command
:--- | :---
Install | `npm install`
Start Front-end and API Server | `npm run server`
Linkedin Search | `npm run search`
Linkedin Reccommended | `npm run reccommended`

## Env File
To get started, you will need to create an `.env` file in the root of the project with a special authorization cookie from Linkedin. After logging into Linkedin, open Chrome Developer tools -> Click `Application` Tab -> Expand `Cookies` section -> Select `https://www.linkedin.com` -> Select `li_at` -> Copy the value and enter it into the `.env` file.
```.env
LI_AT_COOKIE=MYCOOKIE
```

## Search Keywords
Edit `index.js ` to customize search keywords and other parameters.

## How to
Open Terminal and navigate to the project root. Install the project with `npm install`. Then, start the API and Front-end server with `npm run server`. In a new terminal window/tab, perform a search using `npm run search` to get results based on keywords and other parameters defined in `index.js`. Or run `npm run reccommended` to get jobs reccommended for you.

While searching, console messages will display current progress. After each page of results, they will be visible from the front-end at http://localhost:3000. 

On the front-end, you can click `Remove` to add a company to a list to prevent viewing postings from them in the future.
