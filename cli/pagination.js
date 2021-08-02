
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

window.Pagination = class Pagination{
    constructor(elem){
        elem.paginationInstance = this;
        this.parent = elem;
        
        this.id = elem.id; // distinguish multiple pagination using element's id
        this.url = elem.dataset.paginationUrl;
        
        let currentPage = new URLSearchParams(window.location.search);

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
        let {pages, previous, next, errors, length, start, end} = await getJSON(`${this.url}?start=${this.start}&end=${this.start+this.step}`);

        let currentSearch = new URLSearchParams(window.location.search);
        let previousSearch = new URLSearchParams(previous);
        let nextSearch = new URLSearchParams(next);
        currentSearch.set('start', previousSearch.get('start'))
        currentSearch.set('end', previousSearch.get('end'))
        let previousSearchUrl = '?'+currentSearch.toString()
        currentSearch.set('start', nextSearch.get('start'))
        currentSearch.set('end', nextSearch.get('end'))
        let nextSearchUrl = '?'+currentSearch.toString() 
        document.querySelectorAll(`[data-pagination-error='${this.id}']`).forEach( elem => elem.textContent = errors )
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

        pages.forEach( (entry, i) => this.addEntry({ value: entry, i, array: pages}));
    }

    addEntry(entry, template){
        if( !template ) template = this.template;
        let templateInstance = document.importNode(template.content, true);

        templateInstance.querySelectorAll("[data-pagination-href]").forEach( a => a.href = ObjectUtil.stringFromMap(a.dataset.paginationHref, entry))
        templateInstance.querySelectorAll("[data-pagination-map]").forEach( element => {
            this.writeValue(element, entry, ObjectUtil.stringFromMap(element.dataset.paginationMap, entry))
        })
        templateInstance.querySelectorAll("[data-pagination-function]").forEach(element => {
            const fun = new AsyncFunction("value", element.dataset.paginationFunction);
            fun.call(element, entry.value).then( content => this.writeValue(element, entry, content))
        })

        templateInstance.querySelectorAll("[data-pagination-array]").forEach(templateElement => {
            let array = ObjectUtil.valueFromKeyOrPath(templateElement.dataset.paginationArray, entry) || [];
            if( !Array.isArray(array) ) return;
            array.forEach( (arrayEntry, i) => {
                let entry = { value: arrayEntry, i: i, array };
                this.addEntry(entry, templateElement);
            })
        })
        template.parentElement.appendChild(templateInstance)
        
        Pagination.listeners.map(fun => fun({ element: template.parentElement.lastChild, data: entry, id: this.id, url: this.url}));
    }

    writeValue(element, entry, value){
        let keyAttribute = element.dataset.paginationKey || "textContent";
        let condFunctionBody = element.dataset.paginationIf || "return true;";

        let condFunction = new AsyncFunction("value", condFunctionBody);

        condFunction(entry.value).then( cond => {
            if( cond ){
                element[keyAttribute] = value;
            }
        })

    }

    static listeners = [];
    static addListener(cb){
        Pagination.listeners.push(cb);
    }
}

loadScript('ObjectUtil', "/util/object-util.js", () => ObjectUtil.initialize(Pagination, "[data-pagination-url]"));
