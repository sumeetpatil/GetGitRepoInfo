# GitRepositoryInfo
Get Github Repository Information like stars, watchers, open issues, forks, last pushed date and license information too

This is a nodejs commandline tool which reads Github Repositories from the excel file [git_repos.xlsx](./git_repos.xlsx) and creates a file [output.xlsx](./output.xlsx) with Github Repository Information for each Repository like stars, watchers, open issues, forks, last pushed date and license information too


### Installation
1. Install node js
2. run npm install

### Help
```sh
node index.js git_repo_xlsx_filename gitUserName(optional) gitPassword(optional)
```

### Example commands

This example will limit the Git Repos to 50
```sh
node index.js git_repos.xlsx
```

This example will limit the Git Repos to 5000
```sh
node index.js git_repos.xlsx gitUsername gitPassword
```
