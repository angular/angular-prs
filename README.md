# AngularJS PR TimeSeries Graph

This project collects and displays chart to show how well we are doing on
dealing with Pull Requests in the AngularJS project.

## Usage

```bash
git clone https://github.com/angular/angular-prs
cd angular-prs
npm install
bower install
grunt build
grunt server
```

## Fetching new data

You will need a GitHub API client_id and client_secret to run the fetch script

```bash
cd app/data
./fetch.sh CLIENT_ID CLIENT_SECRET
grunt build
```

## Publishing

Once you have fetched a new set of data you can publish it to the GitHub pages:

```bash
cd angular-prs
./deploy.sh
```