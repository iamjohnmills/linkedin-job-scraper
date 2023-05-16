(async () => {
  // Load env variables...
  require('dotenv').config();

  // Set search parameters...
  const options = {
    keywords: 'frontend software engineer',
    location: 'United States',
    sortBy: 'DD',
    f_TPR: 'r2592000', //r2592000 // r604800
    f_WT: '2',
    f_JT: 'F',
  }

  // Initialize browser...
  console.log('Initializing browser...');
  const LinkedinBrowser = require('./app/LinkedinBrowser');
  await LinkedinBrowser.init(process.env.MODE,process.env.LI_AT_COOKIE);

  // Get first page and total pages...
  console.log(`Searching...`)
  let start = 0;
  await LinkedinBrowser.request(start,options);

  // Get total pages...
  let total_pages = await LinkedinBrowser.totalPages();
  if(!total_pages){
    console.log(`No results found...`);
    return;
  }
  console.log(`Found ${total_pages} pages...`);

  // Initialize Store Files...
  const Store = require('./app/store.js');
  await Store.init();
  await Store.eraseJobs();

  // Scrape first page results...
  let job_listings = await LinkedinBrowser.parseJobs();
  await Store.saveJobs(job_listings);
  console.log(`Saved ${job_listings.length} jobs.`);
  
  // Scrape the rest...
  for(let i = 2; i<total_pages + 1;i++){
    console.log(`Getting page ${i}...`)
    start = start + 25;
    await LinkedinBrowser.request(start,options);
    job_listings = await LinkedinBrowser.parseJobs();
    await Store.saveJobs(job_listings);
    console.log(`Saved ${job_listings.length} jobs.`)
  }

  // Close browser...
  console.log(`Done.`);
  LinkedinBrowser.close();

})();