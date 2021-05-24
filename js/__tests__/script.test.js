const fs = require('fs');

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