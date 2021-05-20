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

describe('Gallery.fetchProfile', () => {

    beforeEach(() => {
        fetchMock.doMock();
        console.log = jest.fn();
    });

    afterEach(() => {
        fetch.resetMocks();
    })

    it('calls API and returns data', () => {
        const gallery = new Gallery();
        fetch.mockResponseOnce({
            "login": "octocat",
            "id": 1,
            "node_id": "MDQ6VXNlcjE=",
            "avatar_url": "https://github.com/images/error/octocat_happy.gif",
            "gravatar_id": "",
            "url": "https://api.github.com/users/octocat",
            "html_url": "https://github.com/octocat"
        });
        gallery.fetchProfile().then(res => {
            expect(res).toEqual({
                "login": "octocat",
                "id": 1,
                "node_id": "MDQ6VXNlcjE=",
                "avatar_url": "https://github.com/images/error/octocat_happy.gif",
                "gravatar_id": "",
                "url": "https://api.github.com/users/octocat",
                "html_url": "https://github.com/octocat"
            });
        });
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual("https://api.github.com/users/krzwier");
    });

});