const fs = require('fs');
const { domainToUnicode } = require('url');
const mockConsole = require('jest-mock-console');

// must load document here, or else import below will fail
const html = fs.readFileSync("./index.html");
window.document.documentElement.innerHTML = html;
gallery = require("../main/gallery");

// Global declarations to be used in tests
const profileObject = {
    login: "octocat",
    avatar_url: "https://github.com/images/error/octocat_happy.gif",
    name: "monalisa octocat",
    location: "San Francisco",
    bio: "There once was...",
    public_repos: 2
};

const repoListResponse = {
    "data": {
        "repositoryOwner": {
            "repositories": {
                "nodes": [
                    {
                        "openGraphImageUrl": "https://repository-images.githubusercontent.com/369255294/8f03c100-be6e-11eb-9f71-4b844142645a",
                        "name": "github-repo-gallery",
                        "description": null,
                        "languages": {
                            "edges": [
                                {
                                    "node": {
                                        "name": "HTML"
                                    }
                                },
                                {
                                    "node": {
                                        "name": "CSS"
                                    }
                                },
                                {
                                    "node": {
                                        "name": "JavaScript"
                                    }
                                }
                            ]
                        },
                        "deployments": {
                            "totalCount": 0
                        },
                        "url": "https://github.com/krzwier/github-repo-gallery"
                    },
                    {
                        "openGraphImageUrl": "https://repository-images.githubusercontent.com/364132052/def35400-bcc5-11eb-977c-9b0c6bf7726b",
                        "name": "guess-the-word",
                        "description": "Web app where user inputs letters to guess a word randomly pulled from an API. (Racially sensitive version of a game known by another name.) ",
                        "languages": {
                            "edges": [
                                {
                                    "node": {
                                        "name": "HTML"
                                    }
                                },
                                {
                                    "node": {
                                        "name": "CSS"
                                    }
                                },
                                {
                                    "node": {
                                        "name": "JavaScript"
                                    }
                                }
                            ]
                        },
                        "deployments": {
                            "totalCount": 1
                        },
                        "url": "https://github.com/krzwier/guess-the-word"
                    }
                ]
            }
        }
    }
};

const repoListArray = [
    {
        "openGraphImageUrl": "https://repository-images.githubusercontent.com/369255294/8f03c100-be6e-11eb-9f71-4b844142645a",
        "name": "github-repo-gallery",
        "description": null,
        "languages": {
            "edges": [
                {
                    "node": {
                        "name": "HTML"
                    }
                },
                {
                    "node": {
                        "name": "CSS"
                    }
                },
                {
                    "node": {
                        "name": "JavaScript"
                    }
                }
            ]
        },
        "deployments": {
            "totalCount": 0
        },
        "url": "https://github.com/krzwier/github-repo-gallery"
    },
    {
        "openGraphImageUrl": "https://repository-images.githubusercontent.com/364132052/def35400-bcc5-11eb-977c-9b0c6bf7726b",
        "name": "guess-the-word",
        "description": "Web app where user inputs letters to guess a word randomly pulled from an API. (Racially sensitive version of a game known by another name.) ",
        "languages": {
            "edges": [
                {
                    "node": {
                        "name": "HTML"
                    }
                },
                {
                    "node": {
                        "name": "CSS"
                    }
                },
                {
                    "node": {
                        "name": "JavaScript"
                    }
                }
            ]
        },
        "deployments": {
            "totalCount": 1
        },
        "url": "https://github.com/krzwier/guess-the-word"
    }

];

const fileListResponse = {
    "data": {
        "repository": {
            "object": {
                "entries": [
                    {
                        "name": ".gitignore",
                        "object": {
                            "text": ".DS_Store\nthumbs.db\n.vscode\n.eslintrc.json\n\nTODO\n\nnode_modules/\npackage-lock.json\ncoverage/"
                        }
                    },
                    {
                        "name": "README.md",
                        "object": {
                            "text": "# guess-the-word\n\nProject created in Javascript course in the [Skillcrush](https://skillcrush.com/) [Break Into Tech](https://skillcrush.com/break-into-tech-blueprint) program.\n\nPracticed TDD in working on this project.  Test coverage is 100%, including both UI and logic.  Tests written in Jest.  Also experimented with Mocha but did not end up using it in main (see mocha branch).\n\nDemo here: https://krzwier.github.io/guess-the-word\n"
                        }
                    },
                    {
                        "name": "css",
                        "object": {}
                    },
                    {
                        "name": "img",
                        "object": {}
                    },
                    {
                        "name": "index.html",
                        "object": {
                            "text": "<!DOCTYPE html>\n<html lang=\"en\">\n\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Guess the Word</title>\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" />\n    <link href=\"https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&family=Unlock&display=swap\"\n      rel=\"stylesheet\" />\n    <link rel=\"stylesheet\" href=\"css/normalize.css\" />\n    <link rel=\"stylesheet\" href=\"css/styles.css\" />\n    <script src=\"js/main/script.js\" defer></script>\n  </head>\n\n  <body>\n    <div class=\"container\">\n      <h1>\n        <img class=\"logo\" src=\"img/logo.png\" alt=\"Guess The Word\" />\n        </a>\n      </h1>\n      <p class=\"message\"></p>\n      <p class=\"word-in-progress\"></p>\n      <p class=\"remaining\">You have <span>8 guesses</span> remaining.</p>\n      <ul class=\"guessed-letters\"></ul>\n      <div class=\"guess-form\">\n        <label for=\"letter\">Type one letter:</label>\n        <input type=\"text\" name=\"letter\" class=\"letter\" />\n        <div class=\"form-element button-element\">\n          <button class=\"guess\">Guess!</button>\n        </div>\n      </div>\n      <button class=\"play-again hide\">Play Again!</button>\n    </div>\n  </body>\n\n</html>"
                        }
                    },
                    {
                        "name": "js",
                        "object": {}
                    },
                    {
                        "name": "package.json",
                        "object": {
                            "text": "{\n    \"name\": \"guess-the-word\",\n    \"type\": \"module\",\n    \"description\": \"\",\n    \"main\": \"js/main/script.js\",\n    \"keywords\": [],\n    \"author\": \"\",\n    \"license\": \"ISC\",\n    \"scripts\": {\n        \"test\": \"jest --verbose --coverage\",\n        \"debug\": \"node --debug-brk --inspect node_modules/.bin/jest\"\n    },\n    \"jest\": {\n        \"automock\": false,\n        \"setupFilesAfterEnv\": [\n            \"<rootDir>/setupJest.js\"\n        ]\n    },\n    \"devDependencies\": {\n        \"@testing-library/jest-dom\": \"^5.12.0\",\n        \"jest\": \"^26.5.0\",\n        \"jest-fetch-mock\": \"^3.0.3\"\n    }\n}\n"
                        }
                    },
                    {
                        "name": "setupJest.js",
                        "object": {
                            "text": "require('jest-fetch-mock').enableMocks();\n// global.fetch = require('@testing-library/jest-dom/extend-expect');\n// global.fetch = jest.fn(() =>\n//   Promise.resolve({\n//     json: () => Promise.resolve({ rates: { CAD: 1.42 } }),\n//   })\n// );"
                        }
                    }
                ]
            }
        }
    }
};

const readmeHTML =
    '<h1><a id="user-content-guess-the-word" class="anchor" href="#guess-the-word" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>guess-the-word</h1>' +
    '<p>Project created in Javascript course in the <a href="https://skillcrush.com/" rel="nofollow">Skillcrush</a> <a href="https://skillcrush.com/break-into-tech-blueprint" rel="nofollow">Break Into Tech</a> program.</p>' +
    '<p>Practiced TDD in working on this project.  Test coverage is 100%, including both UI and logic.  Tests written in Jest.  Also experimented with Mocha but did not end up using it in main (see mocha branch).</p>' +
    '<p>Demo here: <a href="https://krzwier.github.io/guess-the-word" rel="nofollow">https://krzwier.github.io/guess-the-word</a></p>';


beforeEach(() => {
    jest.resetModules();
    fetch.resetMocks();
    window.document.documentElement.innerHTML = html;
    gallery = require("../main/gallery");
});

afterEach(() => {

    window.document.documentElement.innerHTML = "";
});

describe('fetchProfile(username)', () => {

    it('calls API and returns data', async () => {
        fetch.mockResponseOnce(JSON.stringify(profileObject), { status: 200 });
        const result = await gallery.fetchProfile("octocat");
        expect(result).toEqual(profileObject);
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual(`https://api.github.com/users/octocat`);

    });

    it('prints error to console when fetch is rejected', async () => {
        const restoreConsole = mockConsole();
        fetch.mockReject(() => Promise.reject("API is down"));
        const result = await gallery.fetchProfile("octocat");
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/users/octocat');
        expect(console.error.mock.calls.length).toEqual(2);
        expect(console.error.mock.calls[0][0]).toContain('API call');
        expect(console.error.mock.calls[1][0]).toContain('Failed conversion to JSON');
        restoreConsole();
    });

});

describe('displayProfile(userData)', () => {
    it('creates figure with correct link inside overview element', () => {
        gallery.displayProfile(profileObject);
        const newImg = window.document.querySelector('.overview>div>figure>img');
        expect(newImg.src).toBe("https://github.com/images/error/octocat_happy.gif");
    });

    it('displays correct name inside overview element', () => {
        gallery.displayProfile(profileObject);
        const infoDiv = window.document.querySelector(".overview>div>div");
        expect(infoDiv.innerHTML).toContain("<p><strong>Name:</strong> monalisa octocat</p>");
    });
});

describe('fetchRepoList(username)', () => {

    it('calls API and returns data', async () => {
        fetch.mockResponseOnce(JSON.stringify(repoListResponse));
        const result = await gallery.fetchRepoList("krzwier");
        expect(result).toEqual(repoListArray);
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual(`https://api.github.com/graphql`);
    });

    it('prints error to console when fetch is rejected', async () => {
        const restoreConsole = mockConsole();
        fetch.mockReject(() => Promise.reject("API is down"));
        await gallery.fetchRepoList("octocat");
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/graphql');
        expect(console.error.mock.calls.length).toEqual(2);
        expect(console.error.mock.calls[0][0]).toContain('API call');
        expect(console.error.mock.calls[1][0]).toContain('Failed conversion to JSON');
        restoreConsole();
    });

});

describe('displayRepoList(repoData)', () => {

    it('displays repos as list items inside repo-list element', () => {
        const repoData = repoListArray;
        gallery.displayRepoList(repoData);
        const listItems = window.document.querySelectorAll(".repo-list>li");
        expect(listItems.length).toEqual(2);
    });

    it('displays correct name inside of repo list element', () => {
        gallery.displayRepoList(repoListArray);
        const listItemTitle = window.document.querySelector(".repo-list>li>h3");
        expect(listItemTitle.textContent).toBe("github-repo-gallery");
    });
});


describe('getRepoInfo(repoName)', () => {

    it('retrieves info from array, fetches readme text, and returns correct data', async () => {
        fetch.mockResponses(
            [
                JSON.stringify(repoListResponse),
                { status: 200 }
            ],
            [
                JSON.stringify(fileListResponse),
                { status: 200 }
            ]);
        await gallery.fetchRepoList("krzwier");
        const returnedData = await gallery.getRepoInfo("guess-the-word");
        expect(returnedData.repoName).toEqual("guess-the-word");
        const expectedReadme = "# guess-the-word\n\nProject created in Javascript course in the [Skillcrush](https://skillcrush.com/) [Break Into Tech](https://skillcrush.com/break-into-tech-blueprint) program.\n\nPracticed TDD in working on this project.  Test coverage is 100%, including both UI and logic.  Tests written in Jest.  Also experimented with Mocha but did not end up using it in main (see mocha branch).\n\nDemo here: https://krzwier.github.io/guess-the-word\n";
        expect(returnedData.readme).toEqual(expectedReadme);
        expect(returnedData.languages).toEqual(["HTML", "CSS", "JavaScript"]);
        expect(returnedData.picUrl).toEqual("https://repository-images.githubusercontent.com/364132052/def35400-bcc5-11eb-977c-9b0c6bf7726b");
        expect(returnedData.url).toEqual("https://github.com/krzwier/guess-the-word");
        expect(returnedData.numDeployments).toEqual(1);

    });

    it('prints errors to console when fetch fails', async () => {
        const restoreConsole = mockConsole();
        fetch.mockResponseOnce(JSON.stringify(repoListResponse));
        const result = await gallery.fetchRepoList("krzwier");
        fetch.resetMocks();
        fetch.mockRejectOnce(() => Promise.reject("API is down"));
        await gallery.getRepoInfo("guess-the-word");
        expect(console.error.mock.calls.length).toEqual(2);
        expect(console.error.mock.calls[0][0]).toContain('API call to https://api.github.com/graphql rejected in getRepoInfo');
        expect(console.error.mock.calls[1][0]).toContain('Failed conversion to JSON in getRepoInfo');
        restoreConsole();

    });

});

describe('Clicking on a repo', () => {

    it('unhides repo data and hides repo list', async () => {
        fetch.mockResponses(
            [
                JSON.stringify(repoListResponse),
                { status: 200 }
            ],
            [
                JSON.stringify(fileListResponse),
                { status: 200 }
            ],
            [
                readmeHTML,
                { status: 200 }
            ]);
        const result = await gallery.fetchRepoList("krzwier");
        const repoTitle = document.querySelector(".repo-list>li>h3");
        repoTitle.click();
        // wait for click to propagate up parent elements and complete
        await new Promise((r) => setTimeout(r, 1000));
        const repoData = document.querySelector(".repo-data");
        const repos = document.querySelector(".repos");
        expect(repoData.classList).not.toContain("hide");
        expect(repos.classList).toContain("hide");
    });
    

});

describe('Clicking on area in repo-list but outside repo', () => {

    it('does nothing', async () => {
        gallery.displayRepoList(repoListArray);

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

