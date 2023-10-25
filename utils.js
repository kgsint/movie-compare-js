const debounce = (fn, delay = 1000) => {
    let tiemoutId;

    return (...args) => {
        if(tiemoutId) {
            clearTimeout(tiemoutId)
        }

        tiemoutId = setTimeout(() => fn.apply(null, args), delay)
    }
}

// wati for some element
const waitFor = (selector) => {
    return new Promise((resolve, reject) => {
        // run or find the given element, every after 30s
        const interval = setInterval(() => {
            // if found, resolve, clear interval and timeout
            if(document.querySelector(selector)) {
                clearInterval(interval)
                clearTimeout(timeout)
                resolve()
            }
        }, 30)

        // if not find after 3s, reject
        const timeout = setTimeout(() => {
            reject()
        }, 3000)
    })
}

export { debounce, waitFor }