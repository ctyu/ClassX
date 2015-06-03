!(function objectX(host){
    var ver = '$$ObjectX' + Math.random().toString().replace(/\./g,'');
    var labels = ['statics','superClass','private','extend'],
        labelProcess = {
            'superClass' : function(newClass, superClass){
                if(!newClass) return;
                superClass = superClass;
                var newClassPrototype = newClass.prototype,
                    superClassPrototype = superClass.prototype;
                //statics
                labelProcess.statics(newClass, superClass, true, true);

                //prototype
                objectEach(superClassPrototype, function(key, value){
                    newClassPrototype[key] = value;
                });

                //extend
                labelProcess.extend(newClass, superClass.extendList || [])

                labelProcess.private(newClass,superClass.private)                
            },
            'extend' : function(newClass, extendList){
                newClass.extendList ? newClass.extendList.push.apply(newClass.extendList,extendList) : (newClass.extendList = extendList);
            },
            'private' : function(newClass,privateValue){
                privateValue = privateValue || {};
                newClass.private || (newClass.private = {});
                ObjectX.extend(newClass.private,privateValue);
            },
            'statics' : function(newClass, statics, own, notOverridden){
                objectEach(statics, function (k, v) {
                    if(notOverridden === true){
                        if( !(k in newClass) ){
                            newClass[k] = v;
                        }
                    }else{
                        newClass[ k ] = v;
                    }
                },own);
            }
        },
        log = function(value){
            if(host && host.console && host.console.log){
                host.console.log(value);
                log = function(value){
                    host.console.log(value);
                }
            }
        };

    function ObjectX(className, opts){
        return ObjectX.define(className, opts);
    }

    ObjectX.prototype = {
        'parent' : function(){
            ObjectX.parent.call(this);
        },
        'extend' : function(params){
            ObjectX.extend.call(this,params);
        },
        'initialize' : function(){

        },
        'destroy' : function(){
            privateAccessor.destroy(this[ver]);
        }
    }

    ObjectX.extend = function(target, params, notOverridden){
        if(arguments.length === 1){
            params = target;
            target = this;
            notOverridden = false;
        }else{
            if(typeof params === 'boolean'){
                notOverridden = params;
                params = target;
                target = this;
            }
        }
        target = target || this;
        params = params || {};
        objectEach(params, function (name, value) {
            var prev = target[ name ];
            if (prev && notOverridden === true)
                return;
            target[ name ] = value;
            if (typeof value === 'function') {
                value.$name = name;
                value.$owner = this;
                if (prev)
                    value.$prev = prev;
            }
        });
    }

    ObjectX.parent = function(){
        var caller = this.parent.caller,
            func = caller.$prev;
        if (!func)
            log('can not call parent');
        else {
            return func.apply(this, arguments);
        }
    }

    ObjectX.toDefine = function(className, opts){
        if( !className ){
            log('NO CLASSNAME!');
            return null;
        }
        var me = this,
            lastIndex = className.lastIndexOf('.');
        return (ns(lastIndex === -1 ? null : className.substr(0, lastIndex))[ className.substr(lastIndex + 1) ] = creator(opts,me));
    }

    function creat(host,opts,extendList,privateValue){
        opts || (opts = {});
        host[ver] = privateAccessor.init(privateValue);//私有变量访问器
        host.privateAccessor = function(name,value){
            privateAccessor(this[ver],name,value)
        };
        if(extendList){
            extendList.forEach(function(extendItem){
                host.extend(extendItem);
            });
        }

        return host.initialize && host.initialize(opts);
    }

    function creator(opts, base){
        opts = opts || {};
        var privateValues;
        var _ObjectX = function(opts){
            return creat.call(this,this, opts, _ObjectX.extendList || [], privateValues);
        }

        opts.superClass || (opts.superClass = base);

        var protoMethods = {
            'constructor' : _ObjectX
        }

        labels.forEach(function(k){
            labelProcess[k](_ObjectX, opts[k]);
        })

        objectEach(opts, function(k,v){
            if(!labelProcess.hasOwnProperty(k)){
                protoMethods[k] = v;
            }
        })

        ObjectX.extend(_ObjectX.prototype,protoMethods);

        privateValues = _ObjectX.private;

        delete _ObjectX.private;

        return _ObjectX;
    }

    /**
     * 私有变量访问器
     */
    var privateStore = {};
    function privateAccessor(id,name,value){
        var caller = arguments.callee.caller;
        for(var k in this){
            if(caller === this[k]){
                var classPrivate = privateStore[id],
                    privateValue = value;
                name ? value ? (classPrivate[name] = value) : (privateValue = classPrivate[name]) : '';
                return privateValue;
            }
        }
    }

    privateAccessor.init = function(privateValues){
        var id = 'objectX' + setTimeout(1);
        privateStore[id] = {};
        ObjectX.extend(privateStore[id],privateValues);
        return id;
    }

    privateAccessor.destroy = function(id){
        delete privateStore[id];
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

    function objectEach(obj, fn , own, scope  ) {
        if(own === true){
            var keys = Object.keys(obj);
            keys.forEach(function(x){
                fn.call( scope, x, obj[x])
            })
        }else{
            for (var x in obj)
                fn.call( scope, x, obj[x] );
        }
    }
    if(module && module.exports){
        module.exports = ObjectX;
    }
})(window)