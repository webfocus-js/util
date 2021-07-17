export default class ObjectUtil {

    /**
     * Converts anything to a string. If null or undefined is given returns an empty string otherwise calls `.toString()`
     * @param {any} obj 
     * @returns 
     */
    static toStringOrEmpty(obj){
        return obj == null ? '' : obj.toString();
    }
    
    /**
     * Follows a path on an object. Returns the deepest non-null value found.
     * @param {*} obj 
     * @param {*} propList 
     */
    static accessObject(obj, propList){
        if( propList.length == 0) return obj;
        else{
            let key = propList[0];
            if( obj[key] == null )
                return obj;
            else            
                return ObjectUtil.accessObj(obj[key], propList.slice(1));
        }
    }

    static valueFromMap(strOrTemplate, obj){
        if( strOrTemplate.length === 0 ){
            return ObjectUtil.toStringOrEmpty(obj);
        }

        if( obj.hasOwnProperty(strOrTemplate) ){
            return ObjectUtil.toStringOrEmpty(obj[strOrTemplate]);
        }

        // It is a template where inside "#{}" will be properties to access the object divided by .
        let templateReplacer = (_match, possibleProperty) => {
            if( obj.hasOwnProperty(possibleProperty) ) return ObjectUtil.toStringOrEmpty(obj[possibleProperty]);

            return ObjectUtil.toStringOrEmpty(ObjectUtil.accessObject(obj, possibleProperty.split('.')))
        }
        return strOrTemplate.replace(/#\{([^}]*)\}/g, templateReplacer)
    }

    static initialize(klass, selector){
        window.addEventListener("load", _ => document.querySelectorAll(selector).forEach( elem => new klass(elem)))
    }
}