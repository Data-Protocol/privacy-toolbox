const fs = require('fs');
const Mustache = require('mustache');
const { LIFECYCLE, FileTypeEnum, createFileMaps } = require('./utilities');

const { objectMap, globalMap, coreMap } = createFileMaps();

function generateReportData() {
  const readMeData = {
    missing: [],
    statements: 0,
    totalCompleted: 'TRUE',
    completed: 0,
    open: 0,
    percentage: 0,
    objects: [],
    globals: [],
    cores: [],
  };

  objectMap.forEach((json) => {
    const fileType = json.system.source;
    const { data, report } = json.system.files;
    const name = report.split('/').pop();

    if (fileType === FileTypeEnum.data) {
      if (json.completed) {
        json.completed = 'True';
      } else {
        json.completed = 'False';
        readMeData.totalCompleted = 'FALSE';
      }
      let statements = 0;
      let completed = 0;
      let open = 0;
      for (let i = 0; i < LIFECYCLE.length; i++) {
        let stage = LIFECYCLE[i];
        let stageData = json[stage];
        if (stageData) {
          for (let j = 0; j < stageData.length; j++) {
            let statement = stageData[j];
            statements += 1;
            switch (statement.compliance) {
              case true:
                completed += 1;
                statement.compliance = 'x';
                break;
              default:
                open += 1;
                statement.compliance = ' ';
            }
          }
        }
      }

      let percentage = ((completed / (completed + open)) * 100).toFixed(2);
      const totals = {
        statements,
        completed,
        open,
        percentage,
      };
      json['totals'] = totals;
      readMeData.objects.push({
        name,
        file: report,
        ...totals,
        json,
      });
      readMeData.statements += statements;
      readMeData.completed += completed;
      readMeData.open += open;
    } else {
      // file missing
      readMeData.missing.push({
        name,
        file: data,
      });
    }
  });

  readMeData.percentage = (
    (readMeData.completed / (readMeData.completed + readMeData.open)) *
    100
  ).toFixed(2);

  globalMap.forEach((json) => {
    const fileType = json.system.source;
    const { data, report } = json.system.files;
    const name = report.split('/').pop();

    if (fileType === FileTypeEnum.data) {
      if (json.completed) {
        json.completed = 'True';
      } else {
        json.completed = 'False';
        readMeData.totalCompleted = 'FALSE';
      }
      readMeData.globals.push({
        name,
        file: report,
        json,
      });
    } else {
      // file missing
      readMeData.missing.push({
        name,
        file: data,
      });
    }
  });

  coreMap.forEach((json) => {
    const fileType = json.system.source;
    const { data, report } = json.system.files;
    const name = report.split('/').pop();

    if (fileType === FileTypeEnum.data) {
      if (json.completed) {
        json.completed = 'True';
      } else {
        json.completed = 'False';
        readMeData.totalCompleted = 'FALSE';
      }
      readMeData.cores.push({
        name,
        file: report,
        json,
      });
    } else {
      // file missing
      readMeData.missing.push({
        name,
        file: data,
      });
    }
  });

  if (readMeData.missing.length > 0) {
    readMeData.totalCompleted = 'FALSE';
  }

  return readMeData;
}

function generateSubReports(map) {
  // Iterate through generating data object files

  map.forEach((json) => {
    const fileType = json.system.source;
    const { reportTemplate, report } = json.system.files;

    if (fileType === FileTypeEnum.data) {
      fs.readFile(reportTemplate, (err, container) => {
        if (err) throw err;
        console.log(report + ' = ' + json);
        const output = Mustache.render(container.toString(), json);
        fs.writeFileSync(report, output);
      });
    }
  });
}

function generateReadMe(reportData) {
  // Iterate through generating data object files
  const complianceTemplate = './../templates/compliance.mustache';
  fs.readFile(complianceTemplate, (err, container) => {
    if (err) throw err;
    console.log('Generate README.md');
    const output = Mustache.render(container.toString(), reportData);
    fs.writeFileSync('./../COMPLIANCE/README.md', output);
  });
}

const reportData = generateReportData();
generateSubReports(objectMap);
generateSubReports(globalMap);
generateSubReports(coreMap);
generateReadMe(reportData);
