class Gallery {

    // PUBLIC FIELDS

    // Overview div
    overview = document.querySelector(".overview");

    username = "krzwier";


    // PUBLIC METHODS

    async fetchProfile() {
        const data = await fetch("https://api.github.com/users/krzwier");
        const userData = await data.json();

    }


}

const gallery = new Gallery();


/* ---- EXPORT ONLY IF RUNNING TESTS ---- */
/* istanbul ignore next */
if (typeof exports !== 'undefined') {
    module.exports = Gallery;
}