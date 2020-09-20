# GetGitRepoInfo
Get Git Repo Info like stars, watchers, open issues and forks

This nodejs commandline tool reads git repos from the excel file (git_repos.xlsx)[./git_repos.xlsx] and creates a file (output.xlsx)[./output.xlsx] with git info for each repo like stars, watchers, open issues and forks.

Example -

This example will limit the Git Repos to 50
```sh
node index.js git_repos.xlsx
```

This example will limit the Git Repos to 5000
```sh
node index.js git_repos.xlsx gitUsername gitPassword
```
