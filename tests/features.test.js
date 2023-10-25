import { createAutocomplete } from "../autocomplete.js";
import { waitFor } from "../utils.js";

beforeEach(() => {
    // reset target element
    document.querySelector('#target').innerHTML = ''

    console.log(document.querySelector('#target'))

    createAutocomplete({
        root: document.querySelector('#target'),
        fetchData() {
            return [
                { Title: '500 days of summer'},
                { Title: 'Bridge to Teribithia'},
            ]
        },
        renderOption(movie) {
            return `<div>${movie.Title}</div>`
        }
    })
})


it('when the page loads, it shows a search input and does not show dropdown', () => {
    // chai
    const expect = chai.expect 

    // dropdown el
    const dropdown = document.querySelector('.dropdown')

    // assertion
    expect(document.querySelector('input')).not.to.be.null
    expect(dropdown.className).not.to.include('is-active')
})

it('after searching, dropdown opens up with the class of active', async () => {
    // chai
    const expect = chai.expect 

    // input el
    const input = document.querySelector('input')
    // fake search
    input.value = '500 days of Summer'
    // dispatch event
    input.dispatchEvent(new Event('input'))

    // wait for dropdown item to render, (delay because of custom debounce function)
    await waitFor('.dropdown-item')

    // dropdown el
    const dropdown = document.querySelector('.dropdown')

    // assertion
    expect(dropdown.className).to.include('is-active')
})

it('after searching, shows a list of movies', async () => {
     // chai
     const expect = chai.expect 

    // input el
    const input = document.querySelector('input')
    // fake search
    input.value = '500 days of Summer'
    // dispatch event
    input.dispatchEvent(new Event('input'))

    // wait for dropdown item to render, (delay because of custom debounce function)
    await waitFor('.dropdown-item')

    const movieLists = document.querySelectorAll('.dropdown-item')

    expect(movieLists.length).to.be.equal(2)

})