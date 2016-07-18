const readline = require('readline');
const fs = require('fs');
var BirthRateYear=[];
var DeathRateYear=[];
for(var j=0;j<56;j++){
	BirthRateYear[j]=0;
	DeathRateYear[j]=0;
}
var jsonData=[];
var tempData={};

const rl = readline.createInterface({
	input: fs.createReadStream('Indicators.csv')
});

rl.on('line',function(line)
{
	var lineRecords=line.trim().split(',');

		
			if(lineRecords[0]=='India')
			{	

				if((lineRecords[2]+","+lineRecords[3]+","+lineRecords[4])=='"Birth rate, crude (per 1,000 people)"')
				{					
					BirthRateYear[parseInt(lineRecords[6],10)-1960] = parseFloat(lineRecords[7],10);
				}
				else if((lineRecords[2]+","+lineRecords[3]+","+lineRecords[4])=='"Death rate, crude (per 1,000 people)"')
				{
					DeathRateYear[parseInt(lineRecords[6],10)-1960] = parseFloat(lineRecords[7],10);
				}

			}
		

});

rl.on('close',function()
{
	for(var l=0;l<54;l++)
	{

		tempData={};
		tempData["Year"]=(1960+l).toString();
		tempData["BirthRateCrudePer1000People)"]=BirthRateYear[l].toString();
		tempData["DeathRateCrudePer1000People)"]=DeathRateYear[l].toString();

		jsonData.push(tempData);
	
	}
	
	fs.writeFileSync("data2.json",JSON.stringify(jsonData),encoding="utf8");
	
});