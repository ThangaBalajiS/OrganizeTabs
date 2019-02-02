window.helpers = {
    initStore : function(){
        if( !localStorage.all ){
            localStorage.all = '[]';
        }
        if( !localStorage.similar ){
            localStorage.similar = '{}';
        }
        if( !localStorage.group ){
            localStorage.group = '{}';
        }
        if( !localStorage.groupOrder ){
            localStorage.groupOrder = '[]';
        }
    },
    getStore : function(){
        return  {
            all: JSON.parse( localStorage.all ),
            similar: JSON.parse( localStorage.similar ),
            group: JSON.parse(localStorage.group ),
            groupOrder: JSON.parse(localStorage.groupOrder),
            myLinks : JSON.parse(localStorage.myLinks)
        }
    },
    setStore: function(lStorage){
        localStorage.all = JSON.stringify( lStorage.all );
        localStorage.similar = JSON.stringify( lStorage.similar );
        localStorage.group = JSON.stringify( lStorage.group );
        localStorage.groupOrder = JSON.stringify(lStorage.groupOrder);
    },
    guid: function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return s4() + s4() +  s4();
    },
    removeFromArray: function(arr,item){
        
        if( typeof arr === 'object' && arr.length ){
            arr = arr.filter(function(i){
                return i.id != item
            });
            return arr;
        }
        
        return [];
    },
    removeFromObject: function(obj,key){
        delete obj[key];
        return obj;
    },
    getCurrentDate: function(){
        return new Date().toString().substr(4,6);
    }
}