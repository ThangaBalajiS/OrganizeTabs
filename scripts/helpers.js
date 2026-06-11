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
            theme: 'system',
            selectedCategory: 'all',
            releaseNotesDismissed: false,
            migratedFromLocalStorage: false
        };

        const data = await chrome.storage.local.get(Object.keys(defaults));
        
        // --- Migration Logic ---
        if (!data.migratedFromLocalStorage) {
            const migrationData = {};
            const keysToMigrate = ['all', 'similar', 'group', 'groupOrder', 'myLinks', 'rating', 'darkMode', 'theme', 'selectedCategory'];
            
            keysToMigrate.forEach(key => {
                const oldVal = localStorage.getItem(key);
                if (oldVal !== null) {
                    try {
                        // localStorage stores everything as strings, so we parse it
                        migrationData[key] = JSON.parse(oldVal);
                    } catch (e) {
                        // If it's a simple string like darkMode or selectedCategory
                        migrationData[key] = oldVal === 'true' ? true : (oldVal === 'false' ? false : oldVal);
                    }
                }
            });

            // Handle legacy darkMode migration to theme
            if (migrationData.darkMode !== undefined && migrationData.theme === undefined) {
                migrationData.theme = migrationData.darkMode ? 'dark' : 'light';
            }

            migrationData.migratedFromLocalStorage = true;
            await chrome.storage.local.set(migrationData);
            
            // Re-fetch data after migration to ensure defaults logic works on updated state
            Object.assign(data, await chrome.storage.local.get(Object.keys(defaults)));
        }
        // --- End Migration Logic ---

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
        return await chrome.storage.local.get(['all', 'similar', 'group', 'groupOrder', 'myLinks', 'rating', 'darkMode', 'theme', 'selectedCategory', 'releaseNotesDismissed']);
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