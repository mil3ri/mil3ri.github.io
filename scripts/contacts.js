document.addEventListener('DOMContentLoaded', () => {
    fetch('data/contacts.json')
        .then(response => response.json())
        .then(data => {
            const contactsList = document.getElementById('contacts-list');
            contactsList.innerHTML = `
                <ul class="contacts-row">
                    <li>
                        <a href="${data.GitHub}" target="_blank" rel="noopener">
                            <img src="${data.Logos.GitHub}" alt="GitHub" class="contact-logo"><br>
                            GitHub
                        </a>
                    </li>
                    <li>
                        <a href="${data.LinkedIn}" target="_blank" rel="noopener">
                            <img src="${data.Logos.LinkedIn}" alt="LinkedIn" class="contact-logo"><br>
                            LinkedIn
                        </a>
                    </li>
                    <li>
                        <a href="${data.Email}">
                            <img src="${data.Logos.Email}" alt="Email" class="contact-logo"><br>
                            Email
                        </a>
                    </li>
                </ul>
            `;
        })
        .catch(error => {
            document.getElementById('contacts-list').textContent = 'Unable to load contacts.';
        });
});