(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const overview = document.querySelector('.overview');

const repoList = document.querySelector('.repo-list');

const repos = document.querySelector('.repos');

const repoData = document.querySelector('.repo-data');

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
    for (let repo of repoData) {
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3>${repo.name}</h3>`
        repoList.append(li);
    }

}

repoList.addEventListener("click", async function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.textContent;
        await fetchRepoInfo(repoName);
    }
})

const fetchRepoInfo = async function (repoName) {
    const data = await fetch('https://api.github.com/repos/' + username + '/' + repoName, {
        headers: {
            Accept: 'application/vnd.github.v3+json'
        }
    });
    const dataClone = data.clone();
    const repoInfo = await dataClone.json();
    const fetchLanguages = await fetch(repoInfo.        languages_url, {
        Accept: 'application/vnd.github.v3+json'
    });
    const languagesClone = fetchLanguages.clone();
    const languagesInfo = await languagesClone.json();
    const languages = [];
    for (let language in languagesInfo) {
        languages.push(language);
    }
    displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    const newDiv = document.createElement("div");
    newDiv.innerHTML = 
        '<h3>Name: ' + repoInfo.name + '</h3>' +
            '<p>Description: ' + repoInfo.description + '</p>' +
            '<p>Default Branch: ' + repoInfo.default_branch + '</p>' +
            '<p>Languages: ' + languages.join(", ") + '</p>' +
            '<a class="visit" href="' + repoInfo.html_url + '" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>';
    repoData.append(newDiv);
    repoData.classList.remove("hide");
    repos.classList.add("hide");
};


/* ---- EXPORT ONLY IF RUNNING TESTS ---- */
/* istanbul ignore next */
module.exports = {
    fetchProfile,
    displayProfile,
    fetchRepoList,
    displayRepoList
};

},{}],2:[function(require,module,exports){
gallery = require("./gallery");

const username = "krzwier";

gallery.fetchProfile(username);
gallery.fetchRepoList(username);
},{"./gallery":1}]},{},[2]);
