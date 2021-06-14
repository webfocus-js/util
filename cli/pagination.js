/**
 * Setup pagination handlers
 */
window.addEventListener('load', () => {
    let currentPage = new URLSearchParams(window.location.search);
    
    let paginationElements = document.querySelectorAll("[data-pagination-url]")
    paginationElements.forEach(n => {
        let url = n.dataset.paginationUrl;
        
        let start = parseInt(n.dataset.paginationStart) || 0
        if( currentPage.has("start") ){
            start = parseInt(currentPage.get("start"));
        }
        let step = parseInt(n.dataset.paginationStep) || 20
        if( currentPage.has("end") ){
            step = parseInt(currentPage.get("end")) - start;
        }
        
        getJSON(`${url}?start=${start}&end=${start+step}`).then( ({pages, previous, next, error, length, start, end}) => {
            let currentSearch = new URLSearchParams(window.location.search);
            let previousSearch = new URLSearchParams(previous);
            let nextSearch = new URLSearchParams(next);
            currentSearch.set('start', previousSearch.get('start'))
            currentSearch.set('end', previousSearch.get('end'))
            let previousSearchUrl = '?'+currentSearch.toString()
            currentSearch.set('start', nextSearch.get('start'))
            currentSearch.set('end', nextSearch.get('end'))
            let nextSearchUrl = '?'+currentSearch.toString() 
            document.querySelectorAll("[data-pagination-error]").forEach( elem => elem.textContent = error )
            document.querySelectorAll("[data-pagination-length]").forEach( elem => elem.textContent = length )
            document.querySelectorAll("[data-pagination-start]").forEach( elem => elem.textContent = start )
            document.querySelectorAll("[data-pagination-end]").forEach( elem => elem.textContent = end )
            document.querySelectorAll("[data-pagination-previous]").forEach( a => {
                a.textContent = "Previous";
                a.href = previousSearchUrl
            });
            document.querySelectorAll("[data-pagination-next]").forEach( a => {
                a.textContent = "Next";
                a.href = nextSearchUrl
            });
            let template = n.querySelector("template");
            pages.map(entry => {
                let templateInstance = document.importNode(template.content, true);
                let templatedName = (_match, possibleName) => entry.hasOwnProperty(possibleName) ? entry[possibleName].toString() : entry.toString();
                templateInstance.querySelectorAll("[data-pagination-href]").forEach( a => a.href = a.dataset.paginationHref.replace(/#\{([^}]*)\}/g, templatedName))
                templateInstance.querySelectorAll("[data-pagination-map]").forEach( element => {
                    let stringOrTemplate = element.dataset.paginationMap; 
                    if( stringOrTemplate.length == 0 ){
                        element.textContent = entry.toString()
                    }
                    else{
                        if( entry.hasOwnProperty(stringOrTemplate) ){
                            element.textContent = entry[stringOrTemplate].toString();
                        }
                        else{
                            element.textContent = stringOrTemplate.replace(/#\{([^}]*)\}/g, templatedName)
                        }
                    }
                })
                n.appendChild(templateInstance)
                
                let custom = new CustomEvent("PaginationAddedEntry", { detail: { element: n.lastChild, data: entry} })
                window.dispatchEvent(custom)
                
            })
        })
    })
})