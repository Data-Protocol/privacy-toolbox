const fs = require('fs');

const LIFECYCLE = [
  'general',
  'collection',
  'maintenance',
  'storage',
  'usage',
  'publication',
  'archive',
  'erasure',
];

const FileTypeEnum = Object.freeze({
  dataTemplate: 'dataTemplate',
  data: 'data',
  report: 'report',
  reportTemplate: 'reportTemplate',
});

function createFiles(map) {
  map.forEach((json) => {
    const fileType = json.system.source;
    const { dataTemplate, data } = json.system.files;

    if (fileType === FileTypeEnum.data) {
      console.log(`${data} found`);
    } else if (fileType === FileTypeEnum.dataTemplate) {
      if (!fs.existsSync(data)) {
        json.completed = false;
        fs.writeFileSync(data, JSON.stringify(json, null, 2));
        console.log(`${data} created`);
      }
    } else {
      throw Error(`Missing template file: ${dataTemplate}`);
    }
  });
}

function createFileMaps() {
  const objectMap = new Map();
  const globalMap = new Map();
  const coreMap = new Map();

  function getCoreFiles(name) {
    const data = `./../DATA/${name}.json`;
    const dataTemplate = `./../templates/${name}.json`;
    const report = `./../COMPLIANCE/${name}.md`;
    const reportTemplate = `./../templates/${name}.mustache`;

    return { dataTemplate, data, reportTemplate, report };
  }

  function getObjectFiles(name, type) {
    const data = `./../DATA/${type}-${name}.json`;
    const dataTemplate = `./../templates/${type}-data-object.json`;
    const report = `./../COMPLIANCE/${type}-${name}.md`;
    const reportTemplate = `./../templates/data-objects-report.mustache`;

    return { dataTemplate, data, reportTemplate, report };
  }

  function getGlobalFiles(name) {
    const data = `./../DATA/${name}.json`;
    const dataTemplate = `./../templates/${name}.json`;
    const report = `./../COMPLIANCE/${name}.md`;
    const reportTemplate = `./../templates/${name}.mustache`;

    return { dataTemplate, data, reportTemplate, report };
  }

  function findJson(fileTuple) {
    let fileType = null;
    let json = null;

    if (fs.existsSync(fileTuple.data)) {
      json = require(fileTuple.data);
      fileType = FileTypeEnum.data;
    } else if (fs.existsSync(fileTuple.dataTemplate)) {
      json = require(fileTuple.dataTemplate);
      fileType = FileTypeEnum.dataTemplate;
    } else {
      fileType = null;
    }

    const system = {
      files: fileTuple,
      source: fileType,
    };

    if (json) {
      json['system'] = system;
    } else {
      json = system;
    }
    return json;
  }

  function createCoreMap() {
    ['data-model', 'PBD-workbook'].forEach((name) => {
      const fileTuple = getCoreFiles(name);
      const json = findJson(fileTuple);
      coreMap.set(name, json);
    });
  }

  function createGlobalMap(objectJson) {
    const globalTemplates = objectJson.templates.global;
    for (let t = 0; t < globalTemplates.length; t++) {
      const name = globalTemplates[t];
      const fileTuple = getGlobalFiles(name);
      const json = findJson(fileTuple);
      globalMap.set(name, json);
    }
  }

  createCoreMap();
  createFiles(coreMap);

  const dataObjects = require('../DATA/data-model.json').dataObjects;

  for (let i = 0; i < dataObjects.length; i++) {
    const dataObject = dataObjects[i];

    const name = dataObject.name.trim().replace(/ /g, '-');

    const typeTemplates = dataObject.type;
    for (let x = 0; x < typeTemplates.length; x++) {
      const type = typeTemplates[x];

      const fileTuple = getObjectFiles(name, type);
      const json = findJson(fileTuple);
      createGlobalMap(json);

      objectMap.set(`${type}-${name}`, json);
    }
  }
  return {
    coreMap,
    objectMap,
    globalMap,
  };
}

function generateDefaultReadme() {
  const source = './../templates/blank-report.md';
  const target = './../COMPLIANCE/README.md';
  fs.copyFile(source, target, (err) => {
    if (err) throw err;
    console.log('Resetting COMPLIANCE/README.md report to blank');
    console.log('To regenerate run "npm run report" ');
  });
}

module.exports = { LIFECYCLE, FileTypeEnum, createFileMaps, createFiles, generateDefaultReadme };
