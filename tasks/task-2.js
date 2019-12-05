import fs from 'fs';
import stream from 'stream';
import path from 'path';
import csv from 'csvtojson';

const fsPromise = fs.promises;

const distPath = path.join(__dirname, '../dist');

const readStream = fs.createReadStream(path.join(__dirname, '../csv/t1_2.csv'), {
    encoding: 'utf8'
});

async function main() {
    try {
        await fsPromise.access(distPath, fs.constants.F_OK);
    } catch(err) {
        await fsPromise.mkdir(distPath);
    }
    
    const writeStream = fs.createWriteStream(path.join(distPath, 't1_2.txt'));
    
    const csvStream = csv();
    
    stream.pipeline(
      readStream,
      csvStream,
      writeStream,
      (err) => {
          if (err) {
              console.error(err);
          }
      }
    );
}

try {
    main();
} catch(err) {
    console.error(err);
}
