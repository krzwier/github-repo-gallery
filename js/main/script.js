class Gallery {

    // PUBLIC FIELDS
    
    username = "krzwier";

    // Overview div
    overview = document.querySelector(".overview");

    


    // PUBLIC METHODS

    async fetchProfile() {
        try {
            const data = await fetch(`https://api.github.com/users/${this.username}`);
            const dataClone = data.clone();
            const userData = await dataClone.json();
            this.displayProfile(userData);
            return userData;
        } catch (e){
             console.log(`Fetch failed in fetchProfile() method: ${e.message}`);
        }
    }

    displayProfile(userData) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("user-info");
        newDiv.innerHTML = `
            <figure>
                <img alt="user avatar" src="${userData.avatar_url}"} />
            </figure>
            <div>
                <p><strong>Name:</strong> ${userData.name}</p>
                <p><strong>Bio:</strong> ${userData.bio}</p>
                <p><strong>Location:</strong> ${userData.location}</p>
                <p><strong>Number of public repos:</strong> ${userData.public_repos}</p>
            </div>
        `;
        this.overview.append(newDiv);

    }
}

const gallery = new Gallery();

gallery.fetchProfile();


/* ---- EXPORT ONLY IF RUNNING TESTS ---- */
/* istanbul ignore next */
if (typeof exports !== 'undefined') {
    module.exports = Gallery;
}