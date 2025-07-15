document.addEventListener('DOMContentLoaded', () => {
    fetch('data/aboutMe.md')
        .then(response => response.text())
        .then(md => {
            const aboutCard = document.querySelector('#section-about .card');
            aboutCard.innerHTML = marked.parse(md);
        })
        .catch(() => {
            const aboutCard = document.querySelector('#section-about .card');
            aboutCard.textContent = "Unable to load About Me.";
        });
});