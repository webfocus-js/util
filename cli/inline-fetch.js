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
        const OBJ_UTIL_ID = "load-object-util-script";
        let script = document.getElementById(OBJ_UTIL_ID);
        if(  script == null ){
            script = document.createElement("script");
            document.body.appendChild(script);
            script.id = OBJ_UTIL_ID;
            script.src = "/util/object-util.js";
            script.addEventListener("load", () => {
                script.fired = true;
                ObjectUtil.initialize(InlineFetch, "[data-inline-fetch-url]")
            })
        }
        else if( !script.fired ){
            script.addEventListener("load", () => {
                script.fired = true;
                ObjectUtil.initialize(InlineFetch, "[data-inline-fetch-url]")
            })   
        }
        else{
            ObjectUtil.initialize(InlineFetch, "[data-inline-fetch-url]")
        }
    })
}
else{
    ObjectUtil.initialize(InlineFetch, "[data-inline-fetch-url]")
}
