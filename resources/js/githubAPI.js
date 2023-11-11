import { Octokit } from "octokit";
import lookup from 'country-code-lookup';

export async function init(username, repoName) {
    //init octokit for github api
    const octokit = new Octokit({ 
        auth: import.meta.env.VITE_GITHUB_TOKEN,
    });

    if(username === undefined || username == '') return;

    const userData = await getUser(username, octokit);
    const allRepoData = await getAllRepos(username, octokit);
    const userContributions = await getUserContributions(username, octokit);

    // const repoData = await getRepo(username, repoName, octokit);
    // const pushStats = await getPushStats(username, repoName, octokit);

    return { userData, allRepoData, userContributions };
}

//fetch a user by username and return the user object
async function getUser(username, octokit) {
    const { data } = await octokit.request("GET /users/{username}", {
        username: username,
    });

    return data;
}

async function getAllRepos(username, octokit) {
    const { data } = await octokit.request('GET /users/{owner}/repos', {
        owner: username,
    });

    return data;
}

async function getRepo(username, repoName, octokit) {
    const { data } = await octokit.request('GET /users/{owner}/{repo}', {
        owner: username,
        repo: repoName
    });

    return data;
}

async function getPushStats(username, repoName, octokit) {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/stats/contributors', {
        owner: username,
        repo: repoName
    });

    return data;
}

async function getUserContributions(username, octokit) {
    const { data } = await octokit.request('GET /users/{username}/events/public', {
        username: username,
    });

    //get all push events
    let pushEvents = data.filter(event => event.type == 'PushEvent');
    
    const groupedData = groupByDate(pushEvents);
    
    return groupedData;
}

    
function groupByDate(pushEvents) {
    return pushEvents.reduce((r, a) => {
        r[dateFormatter(a.created_at)] = [...r[dateFormatter(a.created_at)] || [], a];
        return r;
    }, {});
}

function dateFormatter(date){
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getCountryCode(code){
    if(code == 'England') code = 'United Kingdom';
    if(code == 'Scotland') code = 'United Kingdom';
    if(code == 'Wales') code = 'United Kingdom';
    if(code == 'Northern Ireland') code = 'United Kingdom';
    
    let country = lookup.byCountry(code);
    return country ? country.iso2 : 'US';
}
