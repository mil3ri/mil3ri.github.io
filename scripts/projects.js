document.addEventListener("DOMContentLoaded", () => {
    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            const projectsContainer = document.querySelector('.section-projects .container');
            const descriptionDiv = projectsContainer.querySelector('#projects-list');
            descriptionDiv.innerHTML = ""; // Clear placeholder

            Object.entries(projects).forEach(([name, info]) => {
                const projectDiv = document.createElement('div');
                projectDiv.className = 'card project-card';

                // Only show image if path exists
                const imageHtml = info.path
                    ? `<img src="${info.path}" alt="${name}" class="project-image">`
                    : "";

                // Only show Live Demo link if url exists
                const liveDemoHtml = info.url
                    ? `<a href="${info.url}" target="_blank">Live Demo</a>`
                    : "";

                // Only show Source Code link if repository exists
                const repoHtml = info.repository
                    ? `<a href="${info.repository}" target="_blank">Source Code</a>`
                    : "";

                projectDiv.innerHTML = `
                    ${imageHtml}
                    <div class="project-details">
                        <h3>${name}</h3>
                        <p>${info.description || ""}</p>
                        ${liveDemoHtml}
                        ${repoHtml}
                    </div>
                `;
                descriptionDiv.appendChild(projectDiv);
            });
        })
        .catch(err => {
            const projectsContainer = document.querySelector('.section-projects .container');
            const descriptionDiv = projectsContainer.querySelector('.description-text');
            descriptionDiv.textContent = "Failed to load projects.";
        });
});