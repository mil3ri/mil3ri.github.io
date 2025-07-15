document.addEventListener('DOMContentLoaded', () => {
    fetch('data/contacts.json')
        .then(response => response.json())
        .then(data => {
            const contactsList = document.getElementById('contacts-list');
            // Get all keys except 'Logos'
            const contactKeys = Object.keys(data).filter(key => key !== 'Logos');
            let listHTML = '<ul class="contacts-row">';
            contactKeys.forEach(key => {
                const url = data[key];
                const logo = data.Logos[key];
                const label = key;
                const target = key === 'Email' ? '' : ' target="_blank" rel="noopener"';
                listHTML += `
                    <li class="contact-item card">
                        <a href="${url}"${target}>
                            <img src="${logo}" alt="${label}" class="contact-logo"><br>
                            ${label}
                        </a>
                    </li>
                `;
            });
            listHTML += '</ul>';
            contactsList.innerHTML = listHTML;
        })
        .catch(error => {
            document.getElementById('contacts-list').textContent = 'Unable to load contacts.';
        });
});