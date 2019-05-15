const fs = require('fs');
const packageConfig = require(__dirname + '/package.json');
const file = __dirname + '/projects/ovni-games/package.json';

fs.writeFileSync(file, fs.readFileSync(file).toString().replace(/("version": ")([^"]+)(",)/, (all, name, version, end) => {
  return name + packageConfig.version + end;
}));
