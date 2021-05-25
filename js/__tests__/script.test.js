const fs = require('fs');
const { domainToUnicode } = require('url');

// must load document here, or else import below will fail
const html = fs.readFileSync("./index.html");
window.document.documentElement.innerHTML = html;
gallery = require("../main/gallery");

beforeEach(() => {
    jest.resetModules();
    window.document.documentElement.innerHTML = html;
    gallery = require("../main/gallery");
});

afterEach(() => {

    window.document.documentElement.innerHTML = "";
});

describe('fetchProfile(username)', () => {

    const log = global.console.log; // save original console.log function

    beforeEach(() => {
        console.log = jest.fn();
        fetch.resetMocks();
        // fetchMock.doMock();
    });

    afterEach(() => {
        global.console.log = log; // restore original console.log after all tests
    })

    it('calls API and returns data', async () => {
        //  const gallery = new Gallery();
        fetch.mockResponseOnce(JSON.stringify({
            login: "octocat",
            id: 1,
            node_id: "MDQ6VXNlcjE=",
            avatar_url: "https://github.com/images/error/octocat_happy.gif",
            gravatar_id: "",
            url: "https://api.github.com/users/octocat",
            html_url: "https://github.com/octocat"
        }));

        const result = await gallery.fetchProfile("octocat");
        expect(result).toEqual({
            login: "octocat",
            id: 1,
            node_id: "MDQ6VXNlcjE=",
            avatar_url: "https://github.com/images/error/octocat_happy.gif",
            gravatar_id: "",
            url: "https://api.github.com/users/octocat",
            html_url: "https://github.com/octocat"
        });
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual(`https://api.github.com/users/octocat`);

    });

    it('logs to console when fetch fails', async () => {
        fetch.mockReject(new Error('Fetch failed'));
        // const gallery = new Gallery();
        await gallery.fetchProfile("octocat");
        expect(global.console.log.mock.calls[0][0]).toContain("Fetch failed in fetchProfile() method");

    });

});

describe('displayProfile(userData)', () => {
    it('creates figure with correct link inside overview element', () => {
        gallery.displayProfile({
            login: "octocat",
            avatar_url: "https://github.com/images/error/octocat_happy.gif",
            name: "monalisa octocat",
            location: "San Francisco",
            bio: "There once was...",
            public_repos: 2
        });
        const newImg = window.document.querySelector('.overview>div>figure>img');
        expect(newImg.src).toBe("https://github.com/images/error/octocat_happy.gif");


    });

    it('displays correct name inside overview element', () => {
        // const gallery = new Gallery();
        // note that fetchProfile calls displayProfile
        gallery.displayProfile({
            login: "octocat",
            avatar_url: "https://github.com/images/error/octocat_happy.gif",
            name: "monalisa octocat",
            location: "San Francisco",
            bio: "There once was...",
            public_repos: 2
        });
        const infoDiv = window.document.querySelector(".overview>div>div");
        expect(infoDiv.innerHTML).toContain("<p><strong>Name:</strong> monalisa octocat</p>");


    });


});
describe('fetchRepoList(username)', () => {

    const log = global.console.log; // save original console.log function

    beforeEach(() => {
        console.log = jest.fn();
        fetch.resetMocks();
    });

    afterEach(() => {
        global.console.log = log; // restore original console.log after all tests
    })

    it('calls API and returns data', async () => {
        // const gallery = new Gallery();
        fetch.mockResponseOnce(JSON.stringify([
            {
                "id": 369255294,
                "name": "github-repo-gallery",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "main"
            },
            {
                "id": 260126754,
                "name": "ezoo",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "master"
            }]));

        const result = await gallery.fetchRepoList("krzwier");
        expect(result).toEqual([
            {
                "id": 369255294,
                "name": "github-repo-gallery",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "main"
            },
            {
                "id": 260126754,
                "name": "ezoo",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "master"
            }]);
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual(`https://api.github.com/users/krzwier/repos?sort=updated&direction=ascending&per_page=100`);


    });

    it('logs to console when fetch fails', async () => {
        fetch.mockReject(new Error('Fetch failed'));
        // const gallery = new Gallery();
        const result = await gallery.fetchRepoList("krzwier");
        expect(global.console.log.mock.calls[0][0]).toContain("Fetch failed in fetchRepoList() method");
    });

});

describe('displayRepoList(repoData)', () => {

    it('displays repos as list items inside repo list element', () => {
        const repoData = [
            {
                "id": 369255294,
                "name": "github-repo-gallery",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "main"
            },
            {
                "id": 260126754,
                "name": "ezoo",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "master"
            }];
        gallery.displayRepoList(repoData);
        const listItems = window.document.querySelectorAll(".repo-list>li");
        expect(listItems.length).toEqual(2);
    });

    it('displays correct name inside of repo list element', () => {
        const repoData = [
            {
                "id": 369255294,
                "name": "github-repo-gallery",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "main"
            }];
        gallery.displayRepoList(repoData);
        const listItem = window.document.querySelector(".repo-list>li");
        expect(listItem.textContent).toBe("github-repo-gallery");
    });
});


describe('fetchRepoInfo', () => {

    beforeEach(() => {
        fetch.resetMocks();
    });

    it('calls two API endpoints and returns correct data', async () => {
        fetch.mockResponses(
            [
                JSON.stringify({
                    "id": 1296269,
                    "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
                    "name": "Hello-World",
                    "default_branch": "master",
                    "languages_url": "https://api.github.com/repos/octocat/Hello-World-Template/languages",
                    "html_url": "https://github.com/octocat/Hello-World-Template"
                }),
                { status: 200 }
            ],
            [
                JSON.stringify({
                    "C": 78769,
                    "Python": 7769
                }),
                { status: 200 }
            ]
        );

        const returnedData = await gallery.fetchRepoInfo("Hello-World");
        expect(returnedData.repoInfo).toEqual({
            "id": 1296269,
            "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
            "name": "Hello-World",
            "default_branch": "master",
            "languages_url": "https://api.github.com/repos/octocat/Hello-World-Template/languages",
            "html_url": "https://github.com/octocat/Hello-World-Template"
        });
        expect(returnedData.languages).toEqual(["C", "Python"]);

    });

});

describe('Clicking on a repo', () => {

    it('unhides repo data and hides repo list', async () => {
        // arrange
        const repoList = [
            {
                "id": 369255294,
                "name": "github-repo-gallery",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "main"
            },
            {
                "id": 260126754,
                "name": "ezoo",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "master"
            }];
        gallery.displayRepoList(repoList);

        // act
        const repoTitle = document.querySelector(".repo-list>li>h3");
        repoTitle.click();

        // assert after waiting for click event to propagate
        setTimeout(() => {
            const repoData = document.querySelector(".repo-data");
            const repos = document.querySelector(".repos");
            expect(repoData.classList).not.toContain("hide");
            expect(repos.classList).toContain("hide");
        }, 1000);

    });

});

describe('Clicking on area in repo-list but outside repo', () => {

    it('does nothing', async () => {
        // arrange
        const repoList = [
            {
                "id": 369255294,
                "name": "github-repo-gallery",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "main"
            },
            {
                "id": 260126754,
                "name": "ezoo",
                "owner": {
                    "login": "krzwier",
                },
                "default_branch": "master"
            }];
        gallery.displayRepoList(repoList);

        // act
        const repoListUL = document.querySelector(".repo-list");
        repoListUL.click();

        // assert after waiting for click event to propagate
        setTimeout(() => {
            const repoData = document.querySelector(".repo-data");
            const repos = document.querySelector(".repos");
            expect(repoData.classList).toContain("hide");
            expect(repos.classList).not.toContain("hide");
        }, 1000);

    });


});

describe('clicking "Back to Repo Gallery" button', () => {

    it('hides repo info, unhides repo list, and hides itself', () => {
        const repos = document.querySelector('.repos');
        const repoData = document.querySelector('.repo-data');
        const backToGallery = document.querySelector('.view-repos');

        backToGallery.click();

        expect(repos.classList).not.toContain("hide");
        expect(repoData.classList).toContain("hide");
        expect(backToGallery.classList).toContain("hide");

    });

});

