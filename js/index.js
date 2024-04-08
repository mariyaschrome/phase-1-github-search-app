document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();

        
        userList.innerHTML = '';
        reposList.innerHTML = '';

        
        fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(data => {
            data.items.forEach(user => {
                const userItem = document.createElement('li');
                const userLink = document.createElement('a');
                userLink.href = user.html_url;
                userLink.textContent = user.login;
                userItem.appendChild(userLink);
                userList.appendChild(userItem);

                userLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    fetch(`https://api.github.com/users/${user.login}/repos`, {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch user repos');
                        }
                        return response.json();
                    })
                    .then(repos => {
                        reposList.innerHTML = '';
                        repos.forEach(repo => {
                            const repoItem = document.createElement('li');
                            const repoLink = document.createElement('a');
                            repoLink.href = repo.html_url;
                            repoLink.textContent = repo.name;
                            repoItem.appendChild(repoLink);
                            reposList.appendChild(repoItem);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching user repos:', error);
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    });
});

