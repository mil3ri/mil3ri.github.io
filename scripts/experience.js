document.addEventListener('DOMContentLoaded', () => {
    fetch('data/experience.json')
        .then(response => response.json())
        .then(data => {
            const experienceContainer = document.querySelector('#section-experience .container');
            const experienceDiv = experienceContainer.querySelector('#experience-list');
            experienceDiv.innerHTML = ""; // Clear placeholder

            Object.entries(data).forEach(([company, info]) => {
                experienceDiv.innerHTML += `
                    <div class="card experience-card">
                        <h3>
                            <a href="${info.Website}" target="_blank" rel="noopener">${company}</a>
                        </h3>
                        <div class="experience-position">${info.Position}</div>
                        <div class="experience-dates">${info.StartDate} – ${info.EndDate}</div>
                        <div class="experience-description">${info.Description}</div>
                    </div>
                `;
            });
        })
        .catch(() => {
            const container = document.querySelector('#section-experience .container');
            container.innerHTML += '<div class="experience-list">Unable to load experience.</div>';
        });
});