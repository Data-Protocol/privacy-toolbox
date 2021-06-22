const fs = require('fs');
const path = require('path');
const Confirm = require('prompt-confirm');
const { generateDefaultReadme } = require('./utilities');

const DATA_DIR = './../DATA/';
const REPORT_DIR = './../COMPLIANCE/';

function confirmDelete(files) {
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    console.log(file);
  });

  const prompt = new Confirm('Delete all files?');

  prompt.ask(function (answer) {
    console.log(answer);
    if (answer) {
      for (const file of files) {
        fs.unlink(file, (err) => {
          if (err) throw err;
          console.log(`${file} deleted`);
        });
      }
      console.log('Files deleted');
      generateDefaultReadme();
    } else {
      console.log('Action cancelled');
    }
  });
}

fs.readdir(DATA_DIR, function (err, dfiles) {
  //handling error
  if (err) {
    console.error('Unable to scan directory: ' + err);
  }
  dfiles = dfiles.map((file) => path.join(DATA_DIR, file));

  fs.readdir(REPORT_DIR, function (err, rfiles) {
    //handling error
    if (err) {
      console.error('Unable to scan directory: ' + err);
    }
    rfiles = rfiles.map((file) => path.join(REPORT_DIR, file));
    confirmDelete(dfiles.concat(rfiles));
  });
});
