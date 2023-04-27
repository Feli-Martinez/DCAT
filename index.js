const express = require('express');
const app = express();
const fs = require('fs');
const { unzipFile } = require('./util/unzipFile');

const log = require('./data/log.json');
const localization = require('./data/localization.json');

app.use(express.json({ limit: '40mb' }));
app.use('/', express.static('./frontend'));
app.use(express.static('public'));

app.post('/datauri', (req, res) => {
	let toSend = {};
	// let path = req.body.path;

	let pngPath = `public/files/extracted/${req.body.name.replace(/"/g, '')}.zip/${req.body.name.replace(/"/g, '')}.png`;
	if(fs.existsSync(pngPath)){
		let pngFileStats = fs.statSync(pngPath);

		let secondsDiff = Math.trunc(
			Math.abs(
				new Date(Math.trunc(pngFileStats.birthtimeMs)) - Date.now()
			) / 1000
		);

		if(secondsDiff >= 6){
			const skelBitmap = getDataURI(`public/files/extracted/${req.body.name.replace(/"/g, '')}.zip/${req.body.name.replace(/"/g, '')}.skel`);
			const atlasBitmap = getDataURI(`public/files/extracted/${req.body.name.replace(/"/g, '')}.zip/${req.body.name.replace(/"/g, '')}.atlas`);
			const pngBitmap = getDataURI(pngPath);

			log.push(req.body.name.replace(/"/g, ''));
			fs.writeFileSync('data/log.json', JSON.stringify(log, null, 3));
		
			toSend = {
				pngExists: true,
				[`${req.body.name.replace(/"/g, '')}.skel`]: 'data:application/octet-stream;base64,' + skelBitmap,
				[`${req.body.name.replace(/"/g, '')}.atlas`]: 'data:application/octet-stream;base64,' + atlasBitmap,
				[`${req.body.name.replace(/"/g, '')}.png`]: 'data:image/png;base64,' + pngBitmap
			}
		}
		else{
			toSend = {
				pngExists: false
			}
		}
	}
	else{
		toSend = {
			pngExists: false
		}
	}

	res.status(200).send(toSend);
});

app.post('/pngexists', (req, res) => {
	let pngPath = `public/files/extracted/${req.body.name.replace(/"/g, '')}.zip/${req.body.name.replace(/"/g, '')}.png`;

	if(fs.existsSync(pngPath)){
		let pngFileStats = fs.statSync(pngPath);

		let secondsDiff = Math.trunc(
			Math.abs(
				new Date(Math.trunc(pngFileStats.birthtimeMs)) - Date.now()
			) / 1000
		);

		if(secondsDiff >= 6){
			res.status(200).send({ pngExists: true });
		}
		else{
			res.status(200).send({ pngExists: false });
		}
	}
	else{
		res.status(200).send({ pngExists: false });
	}
});

app.post('/copytopublic', (req, res) => {
	let OGPath = req.body.path;
	let filename = req.body.filename;
	let type = req.body.type;

	// console.log('copying from ' + OGPath);

	fs.copyFileSync(OGPath, `public/files/${type}/${filename}`);

	res.status(200).json({ newPath: `public/files/${type}/${filename}` });
});

setInterval(() => {
	let extractedDir = fs.readdirSync('public/files/extracted');
	let zipsDir = fs.readdirSync('public/files/zip');
	let backgroundsDir = fs.readdirSync('public/files/backgrounds');

	if(backgroundsDir.length > 0){
		backgroundsDir.forEach(backgroundPath => {
			let stats = fs.statSync(`public/files/backgrounds/${backgroundPath}`);

			let secondsSinceCreation = Math.trunc(
				Math.abs(
					new Date(Math.trunc(stats.birthtimeMs)) - Date.now()
				) / 1000
			);

			if(secondsSinceCreation > 25){
				fs.rmSync(`public/files/backgrounds/${backgroundPath}`, { recursive: true, force: true });
			}
		})
	}
	if(zipsDir.length > 0){
		zipsDir.forEach(zipPath => {
			let stats = fs.statSync(`public/files/zip/${zipPath}`);

			let secondsSinceCreation = Math.trunc(
				Math.abs(
					new Date(Math.trunc(stats.birthtimeMs)) - Date.now()
				) / 1000
			);

			if(secondsSinceCreation > 25){
				fs.rmSync(`public/files/zip/${zipPath}`, { recursive: true, force: true });
			}
		});
	}
	if(extractedDir.length > 0){
		extractedDir.forEach(dirPath => {
			let stats = fs.statSync(`public/files/extracted/${dirPath}/${dirPath.replace('.zip', '.dds')}`);

			let secondsSinceCreation = Math.trunc(
				Math.abs(
					new Date(Math.trunc(stats.birthtimeMs)) - Date.now()
				) / 1000
			);

			if(secondsSinceCreation > 25){
				fs.rmSync(`public/files/extracted/${dirPath}`, { recursive: true, force: true });
			}
		});
	}
},  480000);

app.post('/bg', (req, res) => {
    let copy = JSON.stringify(req.body.data).split(';base64,')[1];

	const buffer = Buffer.from(copy, 'base64');
	fs.writeFileSync(`public/files/backgrounds/${req.body.filename}`, buffer);

	res.status(200).send({ message: 'OK' });
});

app.post('/file', (req, res) => {
    let copy = JSON.stringify(req.body.data).split(';base64,')[1];

	const buffer = Buffer.from(copy, 'base64');
	fs.writeFileSync(`public/files/zip/${req.body.filename.replace(' ', '')}`, buffer);

	unzipFile(req.body.filename.replace(' ', ''));

	res.status(200).send({ message: 'Extracting/Converting files and loading player, please wait...' });
});

app.post('/extractfile', (req, res) => {
	unzipFile(req.body.filename);

	res.status(200).send({ message: 'Extracting/Converting files and loading player, please wait...' });
});

app.get('/listzips', (req, res) => {
	let zips = fs.readdirSync('public/files/list-zips');
	let displayNames = [];

	localization.push(
		{
			"tid_unit_2821_name": "Flaming Rock Dragon"
		},
		{
			"tid_unit_3139_name": "Deus Pet Dragon"
		},
		{
			"tid_unit_3140_name": "Sea Dragon"
		}
	);

	zips.forEach(zip => {
		try{
			if(zip.includes('vortex')){
				let vortexName = zip.split('_vortex')[0].split('basic_')[1];

				displayNames.push(
					{
						zip: zip,
						displayName: `${vortexName} Vortex`
					}
				)
			}
			else if(zip.startsWith('basic_2901_dragon_highcorruptedtime_b_')){
				let form = zip.includes('_1_') ? 'Baby form' : 'Adult form';

				displayNames.push(
					{
						zip: zip,
						displayName: `High Corrupted Time Dragon (${form}, black aura)`
					}
				)
			}
			else if(zip.includes('_dragon')){
				let ID = zip.split('basic_')[1].split('_dragon')[0];
				let dragonName = localization.find(entry => Object.keys(entry)[0] == `tid_unit_${ID}_name`);
				let form = zip.includes('_3_HD') ? '(Adult form)' : 
				zip.includes('_2_HD') ? '(Young form)' : '(Baby form)';

				if(zip.includes('skin')){
					let dragonSkinName = localization.find(entry => Object.keys(entry)[0] == `tid_unit_${ID}_${zip.split('_')[4]}_name`)

					displayNames.push(
						{
							zip: zip,
							displayName: `${dragonName[Object.keys(dragonName)[0]]} ("${dragonSkinName[Object.keys(dragonSkinName)[0]]}" Skin, ${form.replace(/[\(\)]/g, '')})`
						}
					);
				}
				else{
					displayNames.push(
						{
							zip: zip,
							displayName: `${dragonName[Object.keys(dragonName)[0]]} ${form}`
						}
					);
				}
			}
			else if(zip.includes('fatality')){
				// basic_fx_3110_fatality_effect_HD_spine-3-8-59_dxt5.zip
				let ID = zip.split('_fx_')[1].split('_fatality')[0];
				let dragonName = localization.find(entry => Object.keys(entry)[0] == `tid_unit_${ID}_name`);

				displayNames.push(
					{
						zip: zip,
						displayName: `${dragonName[Object.keys(dragonName)[0]]}'s fatality skill`
					}
				);
			}
			else{
				displayNames.push(
					{
						zip: zip,
						displayName: zip
					}
				)
			}
		}
		catch{}
	});

	res.status(200).send({ displayNames });
});

const getDataURI = (path) => {
	let thing = fs.readFileSync(path, { encoding: 'base64' })
	return thing;
}

app.listen(7272, () => {
    console.log('Server started');
});

module.exports = app;