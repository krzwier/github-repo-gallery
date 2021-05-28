const funkyTown = require("./funkyTown");

const overview = document.querySelector('.overview');

const repoListDiv = document.querySelector('.repo-list');

const repos = document.querySelector('.repos');

const repoData = document.querySelector('.repo-data');

const backToGallery = document.querySelector('.view-repos');

const filterInput = document.querySelector('.filter-repos');

const username = "krzwier";

let repoList = [];

const fetchProfile = async function (username) {
    try {
        const data = await fetch('https://api.github.com/users/' + username, {
            headers: {
                Accept: 'application/vnd.github.v3+json'
            }
        });
        const dataClone = data.clone();
        const userData = await dataClone.json();
        displayProfile(userData);
        return userData;
    } catch (e) {
        console.log(`Fetch failed in fetchProfile() method: ${e.message}`);
    }
}

const displayProfile = function (userData) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("user-info");
    newDiv.innerHTML =
        '<figure>' +
        '<img alt="user avatar" src="' + userData.avatar_url + '">' +
        '</figure>' +
        '<div>' +
        '<p><strong>Name:</strong> ' + userData.name + '</p>' +
        '<p><strong>Bio:</strong> ' + userData.bio + '</p>' +
        '<p><strong>Location:</strong> ' + userData.location + '</p>' +
        '<p><strong>Number of public repos:</strong> ' + userData.public_repos + '</p>' +
        '</div>';
    overview.innerHTML = newDiv.outerHTML;

}

const fetchRepoList = async function (username) {
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Accept': 'application/JSON',
            'Content-Type': 'application.JSON',
            'Authorization': 'token ' + funkyTown(mess(), str())
        },
        body: JSON.stringify({
            'query': 'query { ' +
                'repositoryOwner(login: "' + username + '") { ' +
                'repositories(orderBy: {field: CREATED_AT, direction: DESC}, first: 100, privacy: PUBLIC) {' +
                'nodes {' +
                'openGraphImageUrl,' +
                'name,' +
                'description,' +
                'languages(first: 10) {' +
                'edges {' +
                'node {' +
                'name' +
                '}' +
                '}' +
                '},' +
                'deployments {' +
                'totalCount' +
                '},' +
                'url' +
                '}' +
                '}' +
                '}' +
                '}'
        })
    });
    const resClone = res.clone();
    const repoListObject = await resClone.json();
    repoList = repoListObject.data.repositoryOwner.repositories.nodes;
    displayRepoList(repoList);
    return repoList;
}

const displayRepoList = function (repoList) {
    filterInput.classList.remove("hide");
    console.log(repoList);
    for (let repo of repoList) {
        // if (repo.na)
        const languages = document.createElement("ul");
        languages.classList.add("languages");
        for (let language of repo.languages.edges) {
            const item = document.createElement("li");
            item.textContent = language.node.name;
            languages.append(item);
        }
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML =
            '<img src="' + repo.openGraphImageUrl + '" alt="preview image">' +
            '<h3>' + repo.name + '</h3>' +
            '<p>' + repo.description + '</p>' +
            languages.outerHTML;
        repoListDiv.append(li);
    }

}

const mess = function () {
    return "U2F" +
        "sdGVkX1+djzTv+2R/SUPW6/" + "cyhJT3J0IUv6m" +
        "52MQAl3c29Y4" + "e0r1amKnmvPUAWIG0VcdbzIPbAxCBzX4" +
        "/ug==";
}

repoListDiv.addEventListener("click", async function (e) {
    element = e.target;
    while (!element.classList.contains("repo")) {
        console.log(element);
        element = element.parentElement;
    }
    const header = element.querySelector("h3");
    const repoName = header.textContent;
    const repoInfo = await getRepoInfo(repoName);
    await displayRepoInfo(repoInfo.repoName, repoInfo.readme, repoInfo.languages, repoInfo.picUrl, repoInfo.url, repoInfo.numDeployments);

})


const getRepoInfo = async function (repoName) {
    let picUrl = "";
    let url = "";
    let numDeployments = 0;
    const languages = [];
    for (let repo of repoList) {
        if (repo.name === repoName) {
            for (let language of repo.languages.edges) {
                languages.push(language.node.name);
            }
            picUrl = repo.openGraphImageUrl;
            url = repo.url;
            numDeployments = repo.deployments.totalCount;
            break;
        }
    }
    // fetch readme file
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Accept': 'application/JSON',
            'Content-Type': 'application.JSON',
            'Authorization': 'token ' + funkyTown(mess(), str())
        },
        body: JSON.stringify({
            'query': 'query { ' +
                'repository(owner: "' + username + '", name: "' + repoName + '") { ' +
                'object(expression: "HEAD:") {' +
                '... on Tree {' +
                'entries {' +
                'name,' +
                'object {' +
                '... on Blob {' +
                'text' +
                '}' +
                '}' +
                '}' +
                '}' +
                '}' +
                '}' +
                '}'
        })
    });
    const resClone = res.clone();
    const files = await resClone.json();
    let readme = "";
    for (let file of files.data.repository.object.entries) {
        console.log(file.name.toUpperCase());
        if (file.name.toUpperCase() === "README.MD") {
            readme = file.object.text;
            break;
        }
    }
    return { repoName, readme, languages, picUrl, url, numDeployments };

};

const displayRepoInfo = async function (repoName, rawReadme, languages, picUrl, url, numDeployments) {

    const res = await fetch("https://api.github.com/markdown", {
        method: "POST",
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            'text': rawReadme
        })
    })
    const resClone = res.clone();
    const readme = await resClone.text();

    repoData.innerHTML = "";
    const newDiv = document.createElement("div");
    console.log(readme);
    let htmlString =
        '<div><img src="' + picUrl + '" alt="preview image"></div>' +
        '<div class="readme">' +
        readme +
        '<div class="buttons"><a class="visit" href="' + url + '" target="_blank" rel="noreferrer noopener">View Repo on GitHub</a>';
    if (numDeployments >= 1) {
        htmlString = htmlString +
            '<a class="visit" href="https://' + username + '.github.io/' + repoName + '/" target="_blank" rel="noreferrer noopener">Live Version</a></div>';
    } else {
        htmlString = htmlString + '</div>';
    }
    htmlString = htmlString + '</div>';
    newDiv.innerHTML = htmlString;
    console.log(newDiv.innerHTML);
    repoData.append(newDiv);
    repoData.classList.remove("hide");
    repos.classList.add("hide");
    backToGallery.classList.remove("hide");
};

backToGallery.addEventListener("click", function () {
    repos.classList.remove("hide");
    repoData.classList.add("hide");
    backToGallery.classList.add("hide");

});

const str = function () {
    return "wG5MsUxQiia45xu5iUX" + "pgs" + "y4nGZ9W9jFNViWg" +
        "3BDHQaPnfxKnioaw7TW9JqrTbUt";
}

/* ---- EXPORT ONLY IF RUNNING TESTS ---- */
/* istanbul ignore next */
module.exports = {
    fetchProfile,
    displayProfile,
    fetchRepoList,
    displayRepoList,
    getRepoInfo
};
