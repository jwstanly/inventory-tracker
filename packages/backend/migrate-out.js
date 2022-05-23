const execSync = require('child_process').execSync;

mv = execSync('mv ./out/backend/lib/* out/lib/');
mv = execSync('mv ./out/backend/* out/');
