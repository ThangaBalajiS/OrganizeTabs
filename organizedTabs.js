(function () {
    var url = new URL(window.location.href);
    var siteName = url.searchParams.get('site');
    console.log(siteName);
    var div_target = document.getElementById('target_div');

    chrome.tabs.getAllInWindow(null, function (tabs) {
        var tabsListForLocalStorage = [];
        for (count in tabs) {
            var tab = tabs[count];
            var domain = getDomainFromUrl(tab.url);
            var condition = false;
            if( siteName === 'all' ){
                condition = true;
            }else if (siteName === 'selected'){
                condition = tab.highlighted;
                console.log( condition )
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
                chrome.tabs.remove(tab.id);
            }
        }
        if (localStorage.hasOwnProperty(siteName)) {

            var oldDataOfSite = JSON.parse(localStorage[siteName]);
            console.log(oldDataOfSite);
            var newDataOfSite = JSON.stringify(oldDataOfSite.push(tabsListForLocalStorage));
            localStorage.setItem(siteName,newDataOfSite);

        } else {
            localStorage.setItem(siteName, JSON.stringify(tabsListForLocalStorage));
        }

    });

    renderTabs();
    function renderTabs() {
        if (localStorage.hasOwnProperty(siteName)) {
            var tabsFromSite = JSON.parse(localStorage[siteName]);
            for (count in tabsFromSite) {
                var tab = tabsFromSite[count];
                div_target.innerHTML += '<div class="item-card" > <div class="item-card-image" > <img src="' + tab.favIcon + '"/> </div><div class="item-card-title">' + tab.title + '</div><div class="item-card-link" ><a target="_blank" href="' + tab.url + '"> Goto Site</a> </div></div>'
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


