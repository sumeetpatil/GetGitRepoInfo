const Excel = require('exceljs')
if(process.argv.length<5){
	console.log("Format: node index.js filename [gitusername(optional)] gitpassword(optional)");
	console.log("If git username and passowrd is not specified then only 50 requests will be considered");
}

if(process.argv.length<3){
	return;
}


const workbookReader = new Excel.stream.xlsx.WorkbookReader(process.argv[2]);
const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet("get_git_repo_info", {});

workbookReader.read();
let repo = ["Repo"];
let api = [];
let stars = ["Stars"];
let watchers = ["Watchers"];
let forks = ["Forks"];
let open_issues = ["Open Issues"];
let last_updated = ["Last Updated"];
let license = ["License"]

workbookReader.on('worksheet', worksheet => {
  worksheet.on('row', row => {
	const repoURL = row.getCell(1).value;
	if(repoURL && repoURL!=""){
		repo.push(repoURL);	
		if(repoURL.search("github")>=0){
			let apiURL = null;
			if(repoURL.endsWith(".git")){
				apiURL = "https://api.github.com/repos"+repoURL.replace("https://github.com","").replace(".git","");	
			}else{
				apiURL = "https://api.github.com/repos"+repoURL.replace("https://github.com","");
				if(apiURL.endsWith("/")){
                               		apiURL = apiURL.slice(0, -1);
                        	}
				
			}
			api.push(apiURL);
		}else{
			api.push(null);
		}
			
	}
  });
});


workbookReader.on('end', () => {
	var urls = api;
	var responses = [];
	var completed_requests = 0;
	var request = require('sync-request');
	var headers = {};
	if(process.argv.length>4){
		var auth = 'Basic ' + Buffer.from( process.argv[3]+ ':' + process.argv[4]).toString('base64');
		headers = {'user-agent':'node.js', 'Authorization':auth};

	}else{
		headers = {'user-agent':'node.js'};
	}
	//API Calls
	for (i in urls) {
	    if(urls[i]!=null){
		console.log("API CALL - "+ urls[i] + " number " + i);
		try{
			var res = request('GET', urls[i], {
			  headers: headers,
			});
			var json = JSON.parse(res.getBody().toString('utf8'));
			stars.push(json.stargazers_count);
			forks.push(json.forks_count);
			watchers.push(json.subscribers_count);
			open_issues.push(json.open_issues_count);
			last_updated.push(json.pushed_at);
			license.push(json.license!=null?json.license.spdx_id:null);
		}catch(err){
			console.log(err);
			stars.push(null);
			forks.push(null);
			watchers.push(null);
			open_issues.push(null);
			last_updated.push(null);
			license.push(null);
		}
	    }else{
	        stars.push(null);
                forks.push(null);
                watchers.push(null);
                open_issues.push(null);
                last_updated.push(null);
                license.push(null);
	    }
	}

	worksheet.getColumn(1).values = repo;
	worksheet.getColumn(2).values = stars;
	worksheet.getColumn(3).values = watchers;
	worksheet.getColumn(4).values = forks;
	worksheet.getColumn(5).values = open_issues;
	worksheet.getColumn(6).values = last_updated;
	worksheet.getColumn(7).values = license;
	workbook.xlsx
	    .writeFile("output.xlsx")
	    .then(
		() => {
		    console.log("workbook saved!");
		}
	    )
	    .catch(
		(error) => {
		    console.log("something went wrong!");
		    console.log(error.message);
		}
	    );
});


workbookReader.on('error', (err) => {
	console.log(err);
});
