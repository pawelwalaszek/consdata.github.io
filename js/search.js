(function () {
    function displaySearchResults(results, store) {
        const searchResults = document.getElementById('search-results');

        if (results.length) {
            results.forEach(result => {
                const item = store[result.ref];
                const row = document.createElement('div');
                const col15 = document.createElement('div');
                const col13 = document.createElement('div');
                const col23 = document.createElement('div');
                const image = document.createElement('img');
                const col5Left = document.createElement('div');
                col5Left.classList.add('col-5');
                const col5Right = col5Left.cloneNode(true);
                const postTitle = document.createElement('p');
                const postDescription = document.createElement('p');
                const title = document.createTextNode(item.title);
                const description = document.createTextNode(item.content.split(" ").slice(0, 20).join(" "));
                const authorInfo = document.createElement('div');
                const authorPhoto = document.createElement('img');
                const postInfo = document.createElement('div');
                const authorName = document.createElement('span');
                const postDate = document.createElement('span');
                const imageAnchor = document.createElement('a');
                const textAnchor = document.createElement('a');
                const authorNameText = document.createTextNode(item.author);
                const dateText = document.createTextNode(item.date);

                imageAnchor.setAttribute('href', item.url);
                textAnchor.setAttribute('href', item.url);
                image.setAttribute('src', '/assets/img/highlight/' + item.highlight);
                authorPhoto.setAttribute('src', '/assets/img/authors/' + item.image);
                row.classList.add('row');
                row.classList.add('search-result-row');
                col15.classList.add('col-15');
                col15.classList.add('post-animation');
                col13.classList.add('col-1-3');
                col13.classList.add('first-post-content');
                col23.classList.add('col-2-3');
                image.classList.add('highlight-image');
                authorPhoto.classList.add('small-author-image');
                postTitle.classList.add('post-title');
                postInfo.classList.add('post-info');
                authorName.classList.add('author-name');
                authorInfo.classList.add('tile-author');

                authorName.appendChild(authorNameText);
                postDate.appendChild(dateText);
                postTitle.appendChild(title);
                postDescription.append(description);
                imageAnchor.append(image);
                postInfo.append(authorName, postDate);
                authorInfo.append(authorPhoto, postInfo);
                textAnchor.append(postTitle, postDescription);
                col23.appendChild(imageAnchor);
                col13.append(textAnchor, authorInfo);
                col15.append(col23, col13);
                row.append(col5Left, col15, col5Right);
                searchResults.appendChild(row);
            });
        } else {
            //TODO komunikat o braku wyników
            searchResults.innerHTML = '<li>Brak wyników wyszukiwania</li>';
        }
    }

    function getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split('&');

        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
            }
        }
    }

    const searchTerm = getQueryVariable('query');

    if (searchTerm) {
        document.getElementById('search-box').setAttribute("value", searchTerm);

        const idx = lunr(function () {
            this.field('id');
            this.field('title', {boost: 10});
            this.field('tags');
            this.field('content');

            for (let key in window.store) {
                this.add({
                    'id': key,
                    'title': window.store[key].title,
                    'tags': window.store[key].tags,
                    'content': window.store[key].content
                });
            }
        });

        const results = idx.search(searchTerm);
        displaySearchResults(results, window.store);
    }
})();
