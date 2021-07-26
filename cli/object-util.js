class ObjectUtil {

    /**
     * Converts anything to a string. If null or undefined is given returns an empty string otherwise calls `.toString()`
     * @param {any} obj 
     * @returns 
     */
    static toStringOrEmpty(obj){
        return obj == null ? '' : obj.toString();
    }
    
    /**
     * Follows a path on an object. Returns the deepest non-null value found unless object is null.
     * 
     * Example:
     * let obj = {
     *   bar : {
     *     foo : () => {}
     *   },
     *   string: ""
     * }
     * 
     * accessObject(obj, ["bar", "foo"]) -> () => {}
     * accessObject(obj, ["foo"]) -> obj
     * accessObject(obj, ["string"]) -> ""
     * 
     * @param {*} obj 
     * @param {*} propList 
     */
    static accessObject(obj, propList){
        if( obj == null ) return obj;
        if( propList.length == 0) return obj;
        else{
            let key = propList[0];
            if( obj[key] == null )
                return obj;
            else            
                return ObjectUtil.accessObject(obj[key], propList.slice(1));
        }
    }

    /**
     * If keyOrPath contains a property of object returns that value. 
     * Otherwise keyOrPath is assumed as a list and splited for every "." calling accessObject with that list.
     * When object is null, null is returned.
     * @param keyOrPath
     * @param obj
     */
    static valueFromKeyOrPath(keyOrPath, obj){
        if( obj == null ){
            return obj;
        }
        if( keyOrPath.length === 0 ){
            return obj;
        }
        if( obj.hasOwnProperty(keyOrPath) ){
            return obj[keyOrPath];
        }

        return ObjectUtil.accessObject(obj, keyOrPath.split('.'))
    }

    /**
     * If strOrTemplate contains a property of object returns the toStringOrEmpty o that value. 
     * Otherwise a template is assumed.
     * 
     * A template is a string containing 0 or more #{keyOrPath}.
     * for each keyOrPath toStringOrEmpty is called on the value of valueFromKeyOrPath
     * 
     * When object is null strOrTemplate is returned unchanged.
     */
    static stringFromMap(strOrTemplate, obj){
        if( obj == null ){
            return strOrTemplate;
        }
        if( strOrTemplate.length === 0 ){
            return ObjectUtil.toStringOrEmpty(obj);
        }

        if( obj.hasOwnProperty(strOrTemplate) ){
            return ObjectUtil.toStringOrEmpty(obj[strOrTemplate]);
        }

        // It is a template where inside "#{}" will be properties to access the object divided by .
        let templateReplacer = (_match, possibleProperty) => ObjectUtil.toStringOrEmpty(ObjectUtil.valueFromKeyOrPath(possibleProperty, obj))
        return strOrTemplate.replace(/#\{([^}]*)\}/g, templateReplacer)
    }

    /**
     * Creates a new instance of a given class for each element that matches the selector.
     */
    static initialize(klass, selector){
        document.querySelectorAll(selector).forEach( elem => new klass(elem));
    }
}
