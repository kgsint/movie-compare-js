import { createAutocomplete } from "./autocomplete.js"

const autocompleteConfig = {
    renderOption(movie) {
        const title = movie.Title
        const imgUrl = movie.Poster === 'N/A' ? '' : movie.Poster

        return `
                <img src="${imgUrl}" />
                ${title} (${movie.Year})
            `
    },
    inputValue(movie) {
        return movie.Title
    },
    async fetchData(search) {
        const res = await axios.get('http://www.omdbapi.com', {
            params: {
                apiKey: 'ad02523c',
                s: search
            }
        })

        if(res.data.Error) {
            return []
        }

        return res.data.Search
    }

}

// left search bar
createAutocomplete({
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    },
    ...autocompleteConfig
})

// right searchbar
createAutocomplete({
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    },
    ...autocompleteConfig
})

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, targetSummary, side) => {
    const res = await axios.get('http://www.omdbapi.com', {
        params: {
            apiKey: 'ad02523c',
            i: movie.imdbID
        }
    })

    targetSummary.innerHTML = movieTemplate(res.data) // display movie summary

    // assign to respective variables
    if(side === 'left') {
        leftMovie = res.data
    }else if(side === 'right') {
        rightMovie = res.data
    }

    // when both left side and right side have been selected
    if(leftMovie && rightMovie) {
        compareMovies()
    }
}

const compareMovies = () => {
    const leftStats = document.querySelectorAll('#left-summary .notification')
    const rightStats = document.querySelectorAll('#right-summary .notification')

    leftStats.forEach((leftStat, index) => {
        let rightStat = rightStats[index]

        let leftValue = parseFloat(leftStat.dataset.value)
        let rightValue = parseFloat(rightStat.dataset.value)

        if(leftValue < rightValue) {
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-warning')

        }else if(rightValue < leftValue) {

            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-warning')
        }
    })

}

// movie summary template
const movieTemplate = movieDetails => {
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
    const metaScore = parseInt(movieDetails.Metascore)
    const imdbRating = parseFloat(movieDetails.imdbRating)
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''))

    const awards = movieDetails.Awards.slice(0, movieDetails.Awards.indexOf(' wins')) // exclude string after wins, (i.e) exclude norminations
                                        .split(' ')
                                        .filter(word => parseInt(word))
                                        .reduce((acc, curr) => acc + parseInt(curr), 0)

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h2>${movieDetails.Title}</h2>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB votes</p>
        </article>
    `
}