// index.js
const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const DATA_DIR = './checklists-data/';
const REPORT_DIR = './docs/';

function generateReports(jsonFiles) {
  const checklistTemplate = `./templates/checklist.mustache`;
  let reportList = [];

  fs.readFile(checklistTemplate, (err, template) => {
    if (err) throw err;

    for (let i = 0; i < jsonFiles.length; i++) {
      //      const jsonData = require (path.join(DATA_DIR, jsonFiles[i]));
      fs.readFile(path.join(DATA_DIR, jsonFiles[i]), (err, jsonString) => {
        if (err) throw err;
        const jsonData = JSON.parse(jsonString);
        jsonData.src = `./../checklist-data/${jsonFiles[i]}`;
        const checklistItems = jsonData['checklist-items'];
        for (let cnt = 0; cnt < checklistItems.length; cnt++) {
          checklistItems[cnt].checklistID = cnt + 1;
        }

        const output = Mustache.render(template.toString(), jsonData);
        fs.writeFileSync(`${path.join(REPORT_DIR, jsonFiles[i])}.md`, output);
        reportList.push({
          title: jsonData.title,
          description: jsonData.description,
          categories: jsonData.categories,
          url: `${REPORT_DIR + jsonFiles[i]}.md`,
        });
        if (i === jsonFiles.length - 1) {
          generateREADME({ checklists: reportList });
        }
      });
    }
  });
}

function generateREADME(jsonReportList) {
  const readmeTemplate = `./templates/README.mustache`;
  const README_FILE = './README.md';

  fs.readFile(readmeTemplate, (err, template) => {
    if (err) throw err;
    const output = Mustache.render(template.toString(), jsonReportList);
    fs.writeFileSync(README_FILE, output);
  });
}

fs.readdir(DATA_DIR, function (err, files) {
  //handling error
  if (err) {
    console.error('Unable to scan directory: ' + err);
  }
  const jsonFiles = files
    .filter((file) => {
      return file.endsWith('.json') && file !== 'categories.json';
    })
    .sort();

  generateReports(jsonFiles);
});
