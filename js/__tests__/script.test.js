const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

// must load document here, or else import below will fail
document.documentElement.innerHTML = html.toString();
const Gallery = require("../main/script");

beforeEach(() => {
    document.innerHTML = html.toString();
});

afterEach(() => {
    jest.resetModules();
    document.innerHTML = "";
});

describe('Gallery.fetchProfile()', () => {

    const log = global.console.log; // save original console.log function

    beforeEach(() => {
        fetchMock.doMock();
        fetch.resetMocks();
        console.log = jest.fn();
    });

    afterEach(() => {
        global.console.log = log; // restore original console.log after all tests
    })

    it('calls API and returns data', () => {
        const gallery = new Gallery();
        fetch.mockResponseOnce(JSON.stringify({
            login: "octocat",
            id: 1,
            node_id: "MDQ6VXNlcjE=",
            avatar_url: "https://github.com/images/error/octocat_happy.gif",
            gravatar_id: "",
            url: "https://api.github.com/users/octocat",
            html_url: "https://github.com/octocat"
        }));
            
        gallery.fetchProfile().then((res) => {
            expect(res).toEqual({
                login: "octocat",
                id: 1,
                node_id: "MDQ6VXNlcjE=",
                avatar_url: "https://github.com/images/error/octocat_happy.gif",
                gravatar_id: "",
                url: "https://api.github.com/users/octocat",
                html_url: "https://github.com/octocat"
            });
            expect(fetch.mock.calls.length).toEqual(1);
            expect(fetch.mock.calls[0][0]).toEqual(`https://api.github.com/users/${gallery.username}`);
        });

    });

    it('logs to console when fetch fails', () => {
        fetch.mockReject(new Error('Fetch failed'));
        const gallery = new Gallery();
        gallery.fetchProfile().then(() => {
            expect(global.console.log.mock.calls[0][0]).toContain("Fetch failed in fetchProfile() method");
        });

    });

});

describe('Gallery.displayProfile()', () => {

    it ('creates a new div inside overview element', () => {
        const newDivs = document.querySelectorAll(".overview>div");
        expect(newDivs.length).toBe(1);
    });

    it ('creates figure inside new div', () => {
        const newFigs = document.querySelectorAll(".overview>div>figure");
        expect(newFigs.length).toBe(1);
    });

    it ('creates info div inside new div', () => {
        const infoDiv = document.querySelector(".overview>div>div");
        expect(infoDiv.innerHTML).toContain("<p><strong>Name:</strong>");
    });

});