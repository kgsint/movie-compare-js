const debounce = (fn, delay = 1000) => {
    let tiemoutId;

    return (...args) => {
        if(tiemoutId) {
            clearTimeout(tiemoutId)
        }

        tiemoutId = setTimeout(() => fn.apply(null, args), delay)
    }
}

export { debounce }