import ObjectUtil from "./object-util.mjs";

export default class InlineFetch{
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
        
        this.parent.querySelectorAll("[data-inline-fetch-map]", elem => {
            let key = elem.dataset.InlineFetchKey || "textContext";
            elem[key] = ObjectUtil.valueFromMap(elem.dataset.InlineFetchMap, response);
        })
    }
}

ObjectUtil.initialize(InlineFetch, "[data-inline-fetch-url]");




/*





window.addEventListener("load", () => {
    document.querySelectorAll("[data-fetch-json]").forEach(element => {
        let url = element.dataset.fetchJson;
        let method = element.dataset.fetchMethod || "get";
        let reqBody = element.dataset.fetchBody || "{}";
        let elementWithMaps = element.querySelectorAll("[data-fetch-map]");
        requestJSON(url, method, JSON.parse(reqBody)).then( obj => {
            let templatedName = (_match, possibleName) => obj.hasOwnProperty(possibleName) ? obj[possibleName].toString() : accessObj(obj, possibleName.split('.')).toString();
            elementWithMaps.forEach( mapElement => {
                let stringOrTemplate = mapElement.dataset.fetchMap; 
                if( stringOrTemplate.length == 0 ){
                    mapElement.textContent = obj.toString()
                }
                else{
                    if( obj.hasOwnProperty(stringOrTemplate) ){
                        mapElement.textContent = obj[stringOrTemplate].toString();
                    }
                    else{
                        mapElement.textContent = stringOrTemplate.replace(/#\{([^}]*)\}/g, templatedName)
                    }
                }
            })
        })
    })
})

function accessObj(obj, propList){
    if( propList.length == 0) return obj;
    else{
        let key = propList[0];
        if( obj[key] == null )
            return obj;
        else            
            return accessObj(obj[key], propList.slice(1));
    }
}


class InlineFetch{
    constructor(elem){
        this.parent = elem;
        this.url = elem.dataset.inlineFetchUrl;
        this.method = elem.dataset.inlineFetchMethod || "get";
        this.body = elem.dataset.inlineFetchBody || "{}";
        this.fetch();
    }

    async fetch(){
        let obj = await requestJSON(this.url, this.method, JSON.parse(this.body));
    }
}

window.addEventListener("load", () => {
    document.querySelectorAll("[data-inline-fetch-url]").forEach(elem => elem.inlineFetchInstance = new InlineFetch(elem))
})

*/