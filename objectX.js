!(function objectX(host){
    var labels = ['statics','superClass','extend','private'],
        labelProcess = {
            'superClass' : function(newClass, superClassList){
                var super,
                    superClassPrototype,
                    newClassPrototype = newClass.prototype;
                superClassList && superClassList.length && superClassList.forEach(function(superClass){
                    superClassPrototype = superClass.prototype;
                    //statics
                    objectEach(superClass,function(key, value){
                        if( !(key in newClass) )
                            newClass[key] = value
                    });

                    //prototype
                    
                })
            },
            'extend' : function(obj){

            },
            'private' : function(private){

            },
            'statics' : function(){

            }
        };
    function ObjectX(className, opts){
        return ObjectX.define(className, opts);
    }

    ObjectX.prototype = {
        'constructor' : ObjectX
    }

    ObjectX.define = function(className, opts){
        if( !className ){
            host.console && host.console.log && host.console.log('NO CLASSNAME!');
            return null;
        }
        var lastIndex = className.lastIndexOf('.');
        return ns(lastIndex === -1 ? null : className.substr(0, lastIndex))[ className.substr(lastIndex + 1) ] = new Creator(opts);
    }

    function creat(host,opts){
        opts || (opts = {});
        host.privateAccessor = new PrivateAccessor();//私有变量访问器
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

    function Creator(opts){
        var me = this;
        me.opts = opts || {};
        var _objectX = function(){
            return creat.call(this, me.opts, _objectX);
        }
        return _objectX;
    }

    Creator.prototype = {
        'inherit' : function(superClass){
            this.opts.superClass ? this.opts.superClass.push(superClass) : (this.opts.superClass = [superClass])
        }
    }

    /**
     * 私有变量访问器
     */
    function PrivateAccessor(){
        this.privateStore = {};
    }

    PrivateAccessor.prototype = {
        'constructor' : PrivateAccessor,
        'get' : function(name){

        },
        'set' : function(name, value){

        }
    }

    function objectEach(obj, fn , scope  ) {
        for (var x in obj)
            fn.call( scope, x, obj[x] );
    };
})(window)