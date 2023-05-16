(async () => {
  const express = require('express');
  const bodyParser = require('body-parser')
  const Store = require('./store.js');

  const server = express();
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.use(express.static('www'));

  server.post('/badcompany', async (req, res, next) => {
    await Store.saveBadCompany(req.body.company);
    return res.json({ success: true, message: `Added filter for ${req.body.company}` });
  });

  server.get('/jobs', async (req, res, next) => {
    const jobs = Store.getJobs()
    const jobs_by_company = jobs.reduce( (groups, result) => {
      groups[result.company] = groups[result.company] || [];
      groups[result.company].push(result);
      return groups;
    }, Object.create(null));
    return res.json(jobs_by_company);
  });

  await Store.init();
  console.log('Server listening on port 3000...')
  server.listen(3000);
})();
