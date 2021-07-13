let currentPage = new URLSearchParams(window.location.search);

class Pagination{
    constructor(elem){
        this.parent = elem;

        this.id = elem.id; // distinguish multiple pagination using element's id
        this.url = elem.dataset.paginationUrl;
        
        this.start = parseInt(elem.dataset.paginationStart) || 0
        if( currentPage.has("start") ){
            this.start = parseInt(currentPage.get("start"));
        }
        this.step = parseInt(elem.dataset.paginationStep) || 20
        if( currentPage.has("end") ){
            this.step = parseInt(currentPage.get("end")) - this.start;
        }

        this.template = elem.querySelector("template");
        this.fetch()
    }

    async fetch(){
        let {pages, previous, next, error, length, start, end} = await getJSON(`${this.url}?start=${this.start}&end=${this.start+this.step}`);

        let currentSearch = new URLSearchParams(window.location.search);
        let previousSearch = new URLSearchParams(previous);
        let nextSearch = new URLSearchParams(next);
        currentSearch.set('start', previousSearch.get('start'))
        currentSearch.set('end', previousSearch.get('end'))
        let previousSearchUrl = '?'+currentSearch.toString()
        currentSearch.set('start', nextSearch.get('start'))
        currentSearch.set('end', nextSearch.get('end'))
        let nextSearchUrl = '?'+currentSearch.toString() 
        document.querySelectorAll(`[data-pagination-error='${this.id}']`).forEach( elem => elem.textContent = error )
        document.querySelectorAll(`[data-pagination-length='${this.id}']`).forEach( elem => elem.textContent = length )
        document.querySelectorAll(`[data-pagination-start='${this.id}']`).forEach( elem => elem.textContent = start )
        document.querySelectorAll(`[data-pagination-end='${this.id}']`).forEach( elem => elem.textContent = end )
        document.querySelectorAll(`[data-pagination-previous='${this.id}']`).forEach( a => {
            a.textContent = "Previous";
            a.href = previousSearchUrl
        });
        document.querySelectorAll(`[data-pagination-next='${this.id}']`).forEach( a => {
            a.textContent = "Next";
            a.href = nextSearchUrl
        });

        pages.forEach(this.addEntry.bind(this));
    }

    static toStringOrEmpty(o){
        return o==null ? '' : o.toString();
    }

    static accessObj(obj, propList){
        if( propList.length == 0) return obj;
        else{
            let key = propList[0];
            if( obj[key] == null )
                return obj;
            else            
                return Pagination.accessObj(obj[key], propList.slice(1));
        }
    }

    addEntry(entry){
        let templateInstance = document.importNode(this.template.content, true);
        let templatedName = (_m, possibleName) => entry.hasOwnProperty(possibleName) ? Pagination.toStringOrEmpty(entry[possibleName]) : Pagination.accessObj(entry, possibleName.split('.')).toString();
            
        templateInstance.querySelectorAll("[data-pagination-href]").forEach( a => a.href = a.dataset.paginationHref.replace(/#\{([^}]*)\}/g, templatedName))
        templateInstance.querySelectorAll("[data-pagination-map]").forEach( element => {
            let stringOrTemplate = element.dataset.paginationMap; 
            if( stringOrTemplate.length == 0 ){
                element.textContent = entry.toString()
            }
            else{
                if( entry.hasOwnProperty(stringOrTemplate) ){
                    element.textContent = Pagination.toStringOrEmpty(entry[stringOrTemplate]);
                }
                else{
                    element.textContent = stringOrTemplate.replace(/#\{([^}]*)\}/g, templatedName)
                }
            }
        })
        this.parent.appendChild(templateInstance)
        
        Pagination.listeners.map(fun => fun({ element: this.parent.lastChild, data: entry, id: this.id, url: this.url}));
    }
    static listeners = [];
    static set onadd(cb){
        Pagination.listeners.push(cb);
    }
}

window.addEventListener("load", () => {
    let paginationElements = document.querySelectorAll("[data-pagination-url]");
    paginationElements.forEach( elem => {
        elem.paginationInstance = new Pagination(elem);
    })
})