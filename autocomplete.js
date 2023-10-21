import { debounce } from './utils.js'

export const createAutocomplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
    root.innerHTML = `
        <label><b>Search for movie</b></label>
        <input type="text" class="input" id="search-input" />

        <div class="dropdown">

            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `

    const searchInput = root.querySelector('#search-input')
    const dropdown = root.querySelector('.dropdown')
    const resultWrapper = root.querySelector('.results')

    const onSearch =  async (event) => {
        const items = await fetchData(event.target.value)

        if(!items.length) {
            dropdown.classList.remove('is-active')
            return;
        }

        resultWrapper.innerHTML = '' // reset for the next search
        dropdown.classList.add('is-active') // add is-active to dropdown to complete some css

        items.forEach(item => {
            
            const anchorLink = document.createElement('a')
            anchorLink.classList.add('dropdown-item')
            anchorLink.innerHTML = renderOption(item)

            resultWrapper.appendChild(anchorLink)

            anchorLink.addEventListener('click', () => {
                dropdown.classList.remove('is-active')
                searchInput.value = inputValue(item)

                onOptionSelect(item)
            })
        })
    }

    searchInput.addEventListener('input', debounce(onSearch, 500))

    // click.away to close dropdown
    document.addEventListener('click', event => {
        if(! root.contains(event.target)) {
            dropdown.classList.remove('is-active') // remove 'is-active' class
        }
    })
}