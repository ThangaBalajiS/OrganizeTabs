window.helpers = {
    initStore : async function(){
        const defaults = {
            all: [],
            similar: {},
            group: {},
            groupOrder: [],
            myLinks: [],
            rating: {},
            darkMode: false,
            selectedCategory: 'all',
            devMessageDismissed: false
        };
        const data = await chrome.storage.local.get(Object.keys(defaults));
        const toSet = {};
        for (const key in defaults) {
            if (data[key] === undefined) {
                toSet[key] = defaults[key];
            }
        }
        if (Object.keys(toSet).length > 0) {
            await chrome.storage.local.set(toSet);
        }
    },
    getStore : async function(){
        return await chrome.storage.local.get(['all', 'similar', 'group', 'groupOrder', 'myLinks', 'rating', 'darkMode', 'selectedCategory', 'devMessageDismissed']);
    },
    setStore: async function(lStorage){
        await chrome.storage.local.set(lStorage);
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