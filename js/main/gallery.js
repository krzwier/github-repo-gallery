const overview = document.querySelector('.overview');

const repoList = document.querySelector('.repo-list');

const username = "krzwier";

const fetchProfile = async function (username) {
    try {
        const data = await fetch(`https://api.github.com/users/${username}`, {
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
        const data = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=ascending&per_page=100`, {
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


// fetchProfile(username);
// fetchRepoList(username);


/* ---- EXPORT ONLY IF RUNNING TESTS ---- */
/* istanbul ignore next */
module.exports = {
    fetchProfile,
    displayProfile,
    fetchRepoList,
    displayRepoList
};
