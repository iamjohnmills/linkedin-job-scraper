const puppeteer = require('puppeteer');

class LinkedinBrowser {
  constructor(){
    this.mode = 'reccommended';
    this.url_search = 'https://www.linkedin.com/jobs/search';
    this.url_reccommended = 'https://www.linkedin.com/jobs/collections/recommended/';
    this.browser = null;
    this.page = null;
  }
  async init(mode,cookie){
    this.mode = mode;
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome',
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ]
    });
    this.page = await this.browser.newPage();
    await this.page.setCookie({ name: 'li_at', value: cookie, domain: '.www.linkedin.com' });    
  }
  wait(milleseconds){
    return new Promise(resolve => setTimeout(resolve, milleseconds))
  }
  async request(start=0,options){
    let base_url = this.mode === 'search' ? this.url_search : this.url_reccommended;
    let params = {
      ...(this.mode === 'search' && { ...options }),
      start: start
    }
    const url = `${base_url}?${new URLSearchParams(params).toString()}`;
    await this.page.goto(url, { waitUntil: 'load', timeout: 0 });
    await this.wait(2000);
    await this.scroll();
    return true;
  }
  totalPages(){
    return this.page.evaluate(async () => {
      const pagination_els = await document.querySelectorAll('.jobs-search-results-list__pagination li');
      const page_numbers = Array.from(pagination_els).map(o => Math.floor(o.getAttribute('data-test-pagination-page-btn')));
      if(!Array.from(pagination_els).length) return false;
      return Math.max(...page_numbers);
    });  
  }
  async scroll(){
    let scroll_amount = 0;
    return new Promise(async resolve => {
      let scrolling = true;
      scroll_amount = 0;
      while(scrolling){
        console.log(`Scrolling...`)
        await this.wait(400);
        if(scroll_amount === 10) scrolling = false;
        scroll_amount++;
        scrolling = await this.page.evaluate(async () => {
          const has_hidden = document.querySelectorAll('.jobs-search-results__job-card-search--generic-occludable-area');
          if(has_hidden.length){
            const job_list = document.querySelector('.jobs-search-results-list');
            await job_list.scrollTo(0, job_list.scrollTop + 500);
            return true;
          } else {
            return false;
          }
        });
      }
      if(!scrolling){
        await this.wait(1200);
        resolve(true);
      }
    });
  }
  async parseJobs(){
    return this.page.evaluate(async () => {
      const rows = Array.from(document.querySelectorAll('li.jobs-search-results__list-item'));
      return rows.map(row => {
        const title = row.querySelector('.job-card-list__title');
        const company = row.querySelector('.job-card-container__primary-description');
        const location = row.querySelector('.job-card-container__metadata-item');
        const link = row.querySelector('.job-card-list__title');
        return {
          title: title ? title.textContent.trim() : 'No Title',
          company: company ? company.textContent.trim() : 'No Company',
          location: location ? location.textContent.trim() : 'No Location',
          link: link ? `https://www.linkedin.com${link.getAttribute('href')}` : ``,
        }
      });
    });
  }
  async close(){
    await this.page.close();
    await this.browser.close();
  }
}

module.exports = new LinkedinBrowser();
