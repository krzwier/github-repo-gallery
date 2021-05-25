const funkyTown = require("./funkyTown");

const overview = document.querySelector('.overview');

const repoList = document.querySelector('.repo-list');

const repos = document.querySelector('.repos');

const repoData = document.querySelector('.repo-data');

const backToGallery = document.querySelector('.view-repos');

const filterInput = document.querySelector('.filter-repos');

const username = "krzwier";

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
    try {
        const data = await fetch('https://api.github.com/users/' + username + '/repos?sort=updated&direction=ascending&per_page=100', {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const dataClone = data.clone();
        const repoData = await dataClone.json();
        displayRepoList(repoData);
        return repoData;
    } catch (e) {
        console.log(`Fetch failed in fetchRepoList() method: ${e.message}`);
    }
}

const displayRepoList = function (repoData) {
    filterInput.classList.remove("hide");
    for (let repo of repoData) {
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3>${repo.name}</h3>`
        repoList.append(li);
    }

}

const mess = function () {
    return "U2F" +
    "sdGVkX1+djzTv+2R/SUPW6/" + "cyhJT3J0IUv6m" +
    "52MQAl3c29Y4" + "e0r1amKnmvPUAWIG0VcdbzIPbAxCBzX4" + 
    "/ug==";
}

repoList.addEventListener("click", async function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.textContent;
        await fetchRepoInfo(repoName);
    }
})

const fetchRepoInfo = async function (repoName) {
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
                    'openGraphImageUrl,' +
                    'languages(first: 10) {' +
                        'edges {' +
                            'node {' +
                                'name' +
                            '}' +
                        '}' +
                    '}' +
                '}' +

            '}'
        })
    });
    const resClone = res.clone();
    const data = await resClone.json();
    const languagesInfo = data.data.repository.languages.edges;
    const languages = [];
    for (let language of languagesInfo) {
        languages.push(language.node.name);
    }
    const picUrl = data.data.repository.openGraphImageUrl;

    const fetchReadme = await fetch('https://api.github.com/repos/' + username + '/' + repoName + '/contents/README.md', {
        headers: {
            Accept: 'application/vnd.github.VERSION.html'
        }
    });
    readme = await fetchReadme.text();
    displayRepoInfo(readme, languages, picUrl);
    return { readme, languages, picUrl };
};

const displayRepoInfo = function (readme, languages, picUrl) {
    repoData.innerHTML = "";
    const newDiv = document.createElement("div");
    newDiv.innerHTML = 
        '<div><img src="' + picUrl + '" alt="preview image"></div>' +
        '<div class="readme">' +
            readme +
        '</div>';
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
    return "wG5MsUxQiia45xu5iUX"+ "pgs" + "y4nGZ9W9jFNViWg" +
    "3BDHQaPnfxKnioaw7TW9JqrTbUt";
}

/* ---- EXPORT ONLY IF RUNNING TESTS ---- */
/* istanbul ignore next */
module.exports = {
    fetchProfile,
    displayProfile,
    fetchRepoList,
    displayRepoList,
    fetchRepoInfo
};
