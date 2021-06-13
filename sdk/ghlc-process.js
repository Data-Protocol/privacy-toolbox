// index.js
const Mustache = require('mustache');
const fs = require('fs');
const checklistData = require('./checklist-data.json');

const LIFECYCLE = [
  'general',
  'collection',
  'maintenence',
  'storage',
  'usage',
  'publication',
  'archival',
  'erasure',
];

function sortData(importData) {
  let sortedData = {};

  for (let i = 0; i < LIFECYCLE.length; i++) {
    let stage = LIFECYCLE[i];
    let stageData = importData[stage];
    let idea = [];
    let test = [];
    let production = [];
    for (let j = 0; j < stageData.length; j++) {
      let entry = stageData[j];
      switch (entry.when) {
        case 'Idea':
          idea.push(entry);
          break;
        case 'Test':
          test.push(entry);
          break;
        case 'Production':
          production.push(entry);
          break;
        default:
          console.error('Unknown design state (when): ' + entry);
      }
    }
    sortedData[stage] = {
      idea,
      test,
      production,
    };
  }
  return sortedData;
}

const sortedData = sortData(checklistData);

for (let i = 0; i < LIFECYCLE.length; i++) {
  let template = `${LIFECYCLE[i]}.mustache`;
  fs.readFile(template, (err, container) => {
    if (err) throw err;
    let stageData = { checklist: sortedData[LIFECYCLE[i]] };
    const output = Mustache.render(container.toString(), stageData);
    fs.writeFileSync(`${LIFECYCLE[i]}.md`, output);
  });
}
