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
        let response = await requestJSON(this.url, this.method, this.body);
        
        this.parent.querySelectorAll("[data-inline-fetch-map]").forEach( elem => {
            let key = elem.dataset.inlineFetchKey || "textContent";
            elem[key] = ObjectUtil.valueFromMap(elem.dataset.inlineFetchMap, response);
        })
    }
}

if( window.ObjectUtil == null ){
    window.addEventListener("load", () => {
        let script = document.createElement("script");
        document.body.appendChild(script);
        script.src = "/util/object-util.js";
        script.onload = () => {
            ObjectUtil.initialize(InlineFetch, "[data-inline-fetch-url]");
        }
    })
}
else{
    ObjectUtil.initialize(InlineFetch, "[data-inline-fetch-url]");
}
