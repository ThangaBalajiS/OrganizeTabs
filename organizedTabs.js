(function () {
    var url = new URL(window.location.href);
    var siteName = url.searchParams.get('site');
    var div_target = document.getElementById('target_div');
/* 
    chrome.tabs.getAllInWindow(null, function (tabs) {
        var tabsListForLocalStorage = [];
        for (count in tabs) {
            var tab = tabs[count];
            var domain = getDomainFromUrl(tab.url);
            domain = domain.replace( "www.",'' );
            var condition = false;
            debugger;
            if( siteName === 'all' ){
                condition = true;
            }else if (siteName === 'selected'){
                condition = tab.highlighted;
                //domain = 'selected';
            }else{
                condition = domain === siteName;
            }
            
            if (domain && condition) {
                

                var tempTabDetailObject = {
                    id: tab.id,
                    title: tab.title,
                    url: tab.url,
                    favIcon: tab.favIconUrl,
                };
                tabsListForLocalStorage.push(tempTabDetailObject);
             
            }
        }
        if (localStorage.hasOwnProperty(siteName)) {

            var oldDataOfSite = JSON.parse(localStorage[siteName]);
            console.log(oldDataOfSite);
            if( tabsListForLocalStorage.length ){
                oldDataOfSite = oldDataOfSite.concat(tabsListForLocalStorage);
            }
            var newDataOfSite = JSON.stringify(oldDataOfSite);
            localStorage.setItem(siteName,newDataOfSite);

        } else {
            localStorage.setItem(siteName, JSON.stringify(tabsListForLocalStorage));
        }
    });
 */

 renderTabs();
    function renderTabs() {
        if (localStorage.hasOwnProperty(siteName)) {
            var tabsFromSite = JSON.parse(localStorage[siteName]);
            for (count in tabsFromSite) {
                var tab = tabsFromSite[count];
                div_target.innerHTML += '<div class="item-card" > <div class="item-card-image" > <img src="' + tab.favIcon + '"/> </div><div class="item-card-title">' + tab.title + '</div><div class="item-card-link" ><a target="_blank" href="' + tab.url + '"> Goto Site</a> </div></div>'
                chrome.tabs.get(tab.id,function(){
                    if(chrome.runtime.lastError){

                    }else{
                        
                    }
                })
                
            }
        } else {
            div_target.innerHTML += '<div>Nothing Found</div>'
        }
    }


    function getDomainFromUrl(url) {
        var splitedUrl = url.split('/');
        if( splitedUrl[0] !== 'chrome-extension:' && splitedUrl[0] !== 'chrome:'  ){
            return url.split('/')[2] || '';
        }else{
           return '';
        }
    
    }


}());


