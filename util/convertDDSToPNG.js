const axios = require('axios');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { apiKeys } = require('../data/apiKeys.json');
const apiKeysLastUse = require('../data/apiKeysLastUse.json');
const apiKeyIndexToUse = require('../data/apiKeyIndexToUse.json');

const filePath = 'public/files/extracted';

const startConversionLink = "http://api.convertio.co/convert";

let apiKeyIndexTU = apiKeyIndexToUse.apiKeyIndexToUse;

const baseReq = {
    "apikey": apiKeys[apiKeyIndexTU],
    "input": "base64",
    "file": "",
    "filename": "",
    "outputformat": "png"
};

apiKeys.forEach(key => {
    apiKeysLastUse[key] = apiKeysLastUse[key] || 0;
});

const convert = (fl) => {
    const fixedFL = fl.replace('.zip', '');

    // start conversion and get id
    axios.post(startConversionLink, {...baseReq, file: getBase64Data(fixedFL), filename: `${fixedFL.split('/')[1]}`}).then(res => {
        console.log(`USING API KEY [${apiKeyIndexTU}]`);
        console.log(`minutes left in this key: ${res.data.data.minutes}`);

        if((parseInt(res.data.data.minutes) - 1) <= 2) {
            apiKeyIndexTU++;

            console.log(`RESTARTING CONVERSION BECAUSE OF 3 OR LESS CONVERSION MINUTES LEFT ON API KEY [${apiKeyIndexTU - 1}]`);
            console.log('CHANGING TO API KEY [' + apiKeyIndexTU + ']')

            fs.writeFileSync("data/apiKeysLastUse.json", JSON.stringify(apiKeysLastUse, null, 3));
            fs.writeFileSync("data/apiKeyIndexToUse.json", JSON.stringify({ apiKeyIndexToUse: apiKeyIndexTU }, null, 3));

            return convert(fl);
        }

        if(res.data.status == 'ok'){
            apiKeysLastUse[apiKeys[apiKeyIndexTU]] = Date.now();

            let diff = Math.trunc(
                Math.abs(apiKeysLastUse[apiKeys[0]] - Date.now()) / 36e5
            );

            if(diff >= 25) apiKeyIndexTU = 0;

            fs.writeFileSync("data/apiKeysLastUse.json", JSON.stringify(apiKeysLastUse, null, 3));
            fs.writeFileSync("data/apiKeyIndexToUse.json", JSON.stringify({ apiKeyIndexToUse: apiKeyIndexTU }, null, 3));

            setTimeout(() => {
                // get the conversion status and try to save the file
                fetchFileWithID(startConversionLink, res.data.data.id);
            }, 3850);
        }
    });
}

const fetchFileWithID = (startConversionLink, id) => {
    axios.get(`${startConversionLink}/${id}/status`).then(rsp => {
        if(rsp.data.data.step_percent == 100){
            fetchFile(rsp.data.data.output.url, `public/files/extracted/${fixedFL.replace('dxt5/', 'dxt5.zip/').replace('.dds', '.png')}`);
        }
        else{
            setTimeout(() => { fetchFileWithID(startConversionLink, id)}, 1000);
        }
    });
};

const getBase64Data = (fl) => {
    const bitmap = fs.readFileSync(`${filePath}/${fl.replace('dxt5/', 'dxt5.zip/')}`, { encoding: 'base64' });
    return bitmap;
}

const fetchFile = (async (url, path) => {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);

    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
    });
});

module.exports = { convert };