window.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

window.InlineFetch = class InlineFetch{
    constructor(elem){
        elem.inlineFetchInstance = this;

        this.parent = elem;
        this.url = elem.dataset.inlineFetchUrl;
        this.method = elem.dataset.inlineFetchMethod || "get";
        this.body = elem.dataset.inlineFetchBody || "{}";
        

        this.fetch();
    }

    async fetch(){
        let entry = await requestJSON(this.url, this.method, this.body);
        
        this.parent.querySelectorAll("[data-inline-fetch-href]").forEach( a => a.href = ObjectUtil.stringFromMap(a.dataset.inlineFetchHref, entry))
        this.parent.querySelectorAll("[data-inline-fetch-map]").forEach( elem => {
            this.writeValue(elem, entry, ObjectUtil.stringFromMap(elem.dataset.inlineFetchMap, entry))
        })
        this.parent.querySelectorAll("[data-inline-fetch-function]").forEach(element => {
            const fun = new AsyncFunction("value", element.dataset.inlineFetchFunction);
            fun.call(element, entry.value).then( content => this.writeValue(element, entry, content))
        })

        this.parent.querySelectorAll("[data-inline-fetch-array]").forEach(templateElement => {
            console.error("Invalid. data-inline-fetch-array was not implemented.")
        })
    }


    writeValue(element, entry, value){
        let keyAttribute = element.dataset.inlineFetchKey || "textContent";
        let condFunctionBody = element.dataset.inlineFetchIf || "return true;";

        let condFunction = new AsyncFunction("value", condFunctionBody);

        condFunction(entry.value).then( cond => {
            if( cond ){
                element[keyAttribute] = value;
            }
        })

    }
}

loadScript('ObjectUtil', "/util/object-util.js", () => ObjectUtil.initialize(InlineFetch, "[data-inline-fetch-url]"));
