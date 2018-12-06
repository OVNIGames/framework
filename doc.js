const fs = require('fs');
const express = require('express');
const proxy = require('express-http-proxy');
const open = require('opn');
const glob = require('glob');
const app = express();
const port = 1139;

app.get('/api', (request, response) => {
  glob('projects/**/examples/**.html', (error, files) => {
    response.send({
      error: (error || '') + '',
      files,
    });
  });
});

app.get('/file/:file', (request, response) => {
  const file = '/' + request.params.file.replace(/^\/+/, '').replace(/--/g, '/');
  if (/^\/([a-zA-Z0-9_-]+\/)+[a-zA-Z0-9_-]+\.html$/.test(file)) {
    fs.readFile(__dirname + file, (error, template) => {
      if (error) {
        response.status(404);
        response.send('File not found');

        return;
      }

      response.send({
        template: template.toString(),
      });
    });

    return;
  }
  response.status(404);
  response.send('File not found');
});

app.use('/', proxy('http://localhost:1138'));

app.listen(port, () => {
  console.log(`Documentation running on port ${port}!`);
  open('http://localhost:1139/doc');
});
