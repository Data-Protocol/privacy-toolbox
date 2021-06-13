const { createFileMaps, createFiles, generateDefaultReadme } = require('./utilities');

const { objectMap, globalMap } = createFileMaps();

createFiles(objectMap);
createFiles(globalMap);
generateDefaultReadme();

/*

function createGlobalFiles(templateJson) {
  const globalTemplates = templateJson.templates.global;
  for (let t = 0; t < globalTemplates.length; t++) {
    const template = globalTemplates[t];
    const { templateFile, target } = getGlobalFiles(template);

    // const target = `./../DATA/${template}`;
    if (!fs.existsSync(target)) {
      // const templateFile = `./../templates/${template}`;
      const templateJson = require(templateFile);
      templateJson.completed = false;
      fs.writeFileSync(target, JSON.stringify(templateJson, null, 2));
      console.log(`${target} created`);
    }
  }
}

for (let i = 0; i < dataObjects.length; i++) {
  const dataObject = dataObjects[i];

  const name = dataObject.name.trim().replace(/ /g, '-');

  const typeTemplates = dataObject.type;
  for (let x = 0; x < typeTemplates.length; x++) {
    const type = typeTemplates[x];
    const { templateFile, target } = getObjectFiles(name, type);
    const templateJson = require(templateFile);
    createGlobalFiles(templateJson);
    //const target = `./../DATA/${type}-${name}.json`;
    if (!fs.existsSync(target)) {
      //const templateFile = `./../templates/${type}-data-object.json`;
      templateJson.name = dataObject.name;
      templateJson.completed = false;
      fs.writeFileSync(target, JSON.stringify(templateJson, null, 2));
      console.log(`${target} created`);
    }
  }
}
*/
