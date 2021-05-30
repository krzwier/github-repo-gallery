# github-repo-gallery

This project is a visual gallery of all of my public GitHub repos.  The app fetches from both the REST API and the GraphQL API.  Preview images for each repository come from its "social preview" image. When you click a repo from the main gallery, its readme text is displayed on its detail page, along with buttons that link to the repo on GitHub and the live version (if it exists).

Tests are written using Jest. Test coverage is 97%. The last few uncovered lines are promise rejection handlers for internal async functions.  I provided test coverage for promise rejection for all external fetch calls at least 😉.  

Scripts are bundled for the browser using Browserify. 

The gallery is based on a project from [Skillcrush](https://skillcrush.com/)'s Javascript course, but I prettied it up and expanded it quite a bit.  The GitHub GraphQL API was crucial because it allowed me to showcase images, languages, and pull the readme text.  Manipulating the accessible data to get it into my desired form proved to be quite a challenge.  This project also gave me a much better understanding of async functions, promises, and rejection handling.
