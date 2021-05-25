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
    const picRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Accept': 'application/JSON',
            'Content-Type': 'application.JSON',
            'Authorization': 'token ' + funkyTown(mess(), str())
        },
        body: JSON.stringify({
            'query': 'query { ' +
                'repository(owner: "' + username + '", name: "' + repoName + '") { ' +
                    'openGraphImageUrl' +
              '} }'
        })
    });
    const picResClone = picRes.clone();
    const pic = await picResClone.json();
    const picUrl = pic.data.repository.openGraphImageUrl;
    const data = await fetch('https://api.github.com/repos/' + username + '/' + repoName, {
        headers: {
            Accept: 'application/vnd.github.v3+json'
        }
    });
    const dataClone = data.clone();
    const repoInfo = await dataClone.json();
    const fetchLanguages = await fetch(repoInfo.languages_url, {
        Accept: 'application/vnd.github.v3+json'
    });
    const languagesClone = fetchLanguages.clone();
    const languagesInfo = await languagesClone.json();
    const languages = [];
    for (let language in languagesInfo) {
        languages.push(language);
    }
    displayRepoInfo(repoInfo, languages, picUrl);
    return { repoInfo, languages, picUrl };
};

const displayRepoInfo = function (repoInfo, languages, picUrl) {
    repoData.innerHTML = "";
    const newDiv = document.createElement("div");
    newDiv.innerHTML = 
        '<div><img src="' + picUrl + '" alt="preview image"></div>' +
        '<div class="info">' +
            '<h3>Name: ' + repoInfo.name + '</h3>' +
            '<p>Description: ' + repoInfo.description + '</p>' +
            '<p>Default Branch: ' + repoInfo.default_branch + '</p>' +
            '<p>Languages: ' + languages.join(", ") + '</p>' +
            '<a class="visit" href="' + repoInfo.html_url + '" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>' +
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
