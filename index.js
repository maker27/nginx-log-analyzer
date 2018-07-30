"use strict";

const argv = require('minimist')(process.argv.slice(2),{ alias: {
		'client': 'c',
		'url': 'u',
		'extended': 'e'
	} }),
	cmdHint= '\n Используйте команду в формате:\n\n node index pathToLogFile [--client] [--url] [--extended]',
	logfile = argv._[0];

if(!logfile){
	console.error('Не указан путь к log-файлу.'+cmdHint);
	process.exit(0);
}

const lineReader = require('readline').createInterface({
	input: require('fs').createReadStream(logfile)
}),
	data = [],
	ipReg = /client: ([0-9.]+),/,
	urlReg = /request: "([^"]+)",/;

function objToArray(obj,simple){
	const commonArr = [];
	for(let i in obj) if(obj.hasOwnProperty(i)){
		commonArr.push(
			simple
				?[obj[i],i]
				:[obj[i].count,i,objToArray(obj[i].info,true).reduce((s,v)=>s+'\n\t'+v[0]+' - '+v[1],'')]);
	}
	commonArr.sort((a, b) => a[0] - b[0]);
	return commonArr;
}

function collectObj(data,[first,second]){
	const obj = {};

	data.forEach(function(line){
		const r1 = line.match(first);
		if(r1){
			const p1 = r1[1],
				r2 = line.match(second) || [];
			if(!obj[p1]) obj[p1] = {count:0,info:{}};
			obj[p1].count++;
			if(r2[1]){
				if(!obj[p1].info[r2[1]]) obj[p1].info[r2[1]] = 0;
				obj[p1].info[r2[1]]++;
			}
		}
	});
	objToArray(obj).forEach(function(v){
		console.log('\n'+v[0]+': '+v[1]+(argv.extended?v[2]:'') );
	});
}

lineReader
	.on('line', function (line) {
		data.push(line);
	})
	.on('close', () => {

		if(argv.client){
			collectObj(data,[ipReg,urlReg])
		}else if(argv.url){
			collectObj(data,[urlReg,ipReg])
		}else{
			console.error('Не указан параметр для сортировки'+cmdHint);
		}

	});