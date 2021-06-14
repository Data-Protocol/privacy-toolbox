// index.js
const Mustache = require('mustache');
const fs = require('fs');

const DATA_DIR = './../checklists-data/';
const REPORT_DIR = './../checklists/';

function generateReports(dataFiles) {
  for (let i = 0; i < dataFiles.length; i++) {
    let checklistTemplate = `./../templates/checklist.mustache`;
    fs.readFile(checklistTemplate, (err, container) => {
      if (err) throw err;
      const output = Mustache.render(container.toString(), stageData);
      fs.writeFileSync(`${LIFECYCLE[i]}.md`, output);
    });
  }
}

fs.readdir(DATA_DIR, function (err, files) {
  //handling error
  if (err) {
    console.error('Unable to scan directory: ' + err);
  }
  const jsonFiles = files
    .filter((file) => file.endsWith('.json') && file !== 'example-checklist.json')
    .files.map((file) => path.join(DATA_DIR, file));

  generateReports(jsonFiles);
});
