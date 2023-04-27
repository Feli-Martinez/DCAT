const AdmZip = require('adm-zip');
const fs = require('fs');
const { convert } = require('./convertDDSToPNG');
const axios = require('axios');

const unzipFile = (filename) => {
	if(!filename.endsWith('.zip')){
		return 'File doesnt exist';
	}

    try{
        let zip = new AdmZip(`public/files/zip/${filename}`);
        // fs.mkdirSync(`files/extracted/${filename}`);
        zip.extractAllTo(`public/files/extracted/${filename}/`, true);
    
        let atlasContents = fs.readFileSync(`public/files/extracted/${filename}/${filename.replace('.zip', '.atlas')}`, 'utf-8');
        fs.writeFileSync(`public/files/extracted/${filename}/${filename.replace('.zip', '.atlas')}`, atlasContents.replace('.dds', '.png'));

        axios.post('http://localhost:7272/pngexists', { name: filename.replace('.zip', '') }).then(res => {
            if(res.data.pngExists) return;
            else{
                convert(`${filename}/${filename.replace('.zip', '')}.dds`);
            }
        });
    }
    catch{}
};

module.exports = { unzipFile };