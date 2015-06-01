!(function objectX(host){
    var labels = ['superClass','extend','private'],
        privateStore = {};
    function ObjectX(opts, constructor){
        if(this === host){
            return new ObjectX(opts);
        }
        return creat.call(this,opts, constructor)
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
            return new ObjectX(me.opts, _objectX);
        }
        return _objectX;
    }

    Creator.prototype = {
        'inherit' : function(superClass){
            this.opts.superClass ? this.opts.superClass.push(superClass) : (this.opts.superClass = [superClass])
        }
    }

    function privateAccessor(name, value){
        if(arguments.length === 1){
            privateAccessor.get(name);
        }else{
            privateAccessor.set(name, value);
        }
    }

    privateAccessor.get = function(name){

    }

    privateAccessor.set = function(name, value){

    }

})(window)