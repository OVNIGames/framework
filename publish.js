const glob = require('glob');
const child_process = require('child_process');
const semver = require('semver');

glob(__dirname + '/dist/ovni-games/ovnigames-framework-*.tgz', {}, (err, list) => {
  list.sort((a, b) => {
    if (a === b) {
      return 0;
    }

    a = a.split('ovnigames-framework-')[1];
    b = b.split('ovnigames-framework-')[1];
    a = a.substr(0, a.length - 4);
    b = b.substr(0, b.length - 4);

    return semver.lt(a, b) ? 1 : -1;
  });

  child_process.execSync('npm publish', [list[0]]);
});
