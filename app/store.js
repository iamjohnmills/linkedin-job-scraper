const fs = require('fs');

class Store {
  constructor(){
    this.path_jobs = './data/jobs.json';
    this.path_badcompanies = './data/badcompanies.txt';
  }
  init(){
    this.createStoreFile(this.path_jobs,'[]');
    this.createStoreFile(this.path_badcompanies,'');
  }
  eraseJobs(){
    return fs.writeFileSync(this.path_jobs, '[]');
  }
  createStoreFile(path,default_value){
    if(!fs.existsSync(path)) fs.writeFileSync(path, default_value);
  }
  getJobs(){
    const data = fs.readFileSync(this.path_jobs, 'utf8');
    return JSON.parse(data);
  }
  getBadCompanies(){
    const data = fs.readFileSync(this.path_badcompanies, 'utf8');
    return data.split('\n');
  }
  async saveBadCompany(company){
    fs.appendFileSync(this.path_badcompanies, `\n${company}`, 'utf8');
    await this.saveJobs();
  }
  async saveJobs(jobs){
    const current_jobs = await this.getJobs();
    const bad_companies = await this.getBadCompanies();
    const updated_jobs = current_jobs
      .concat(jobs)
      .filter(job => !!job)
      .filter((v,i,a)=>a.findIndex(v2=>(v2.title===v.title && v2.company===v.company))===i)
      .filter(job => !bad_companies.includes(job.company));
    return fs.writeFileSync(this.path_jobs, JSON.stringify(updated_jobs) );
  }
}

module.exports = new Store();
