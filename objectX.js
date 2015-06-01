!(function objectX(host){
    var labels = ['extend','prototype','private'];
    function ObjectX(opts){
        if(this === host){
            return new ObjectX(opts);
        }
        return creat(opts)
    }

    ObjectX.prototype = {
        'constructor' : ObjectX,
        'inherit' : function(entity){
            return entity;
        },
        'creatSubClass' : function(opts){
            return opts
        }
    }

    ObjectX.define = function(className, opts){
        if( !className ){
            host.console && host.console.log && host.console.log('NO CLASSNAME!');
            return null;
        }
        var lastIndex = className.lastIndexOf('.');
        return ns(lastIndex === -1 ? null : className.substr(0, lastIndex))[ className.substr(lastIndex + 1) ] = function(){
            return new ObjectX(opts);
        }
    }

    function creat(opts){
        opts || (opts = {});
    }

    function ns( name , root ) {
        var part = root || host,
            parts = name && name.split('.') || [];

        parts.forEach(function(partName){
            if (partName) {
                part = part[ partName ] || ( part[ partName ] = {});
            }
        })

        return part;
    }


})(window)