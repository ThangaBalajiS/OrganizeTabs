var reDirUrl = 'templates/dashboard.html';
var siteExists = { flag: false, id: 0 };

document.body.style.background = '#fff';

var allTabsQuery = browser.tabs.query({currentWindow:true});
allTabsQuery.then(function (tabs) {
    var itemArray = [];
    for (tab in tabs) {
        var tabDomain = getDomainFromUrl(tabs[tab].url),
            tabUrl = tabs[tab].url,
            tabTitle = tabs[tab].title,
            tabFavIconUrl = tabs[tab].favIconUrl;
        tabDomain = tabDomain.replace("www.", '');
 /*        if (tabUrl === browser.runtime.getURL( reDirUrl )) {
            var a = browser.tabs.update(tabs[tab].id,{active:true});

        } */
        

        if (tabDomain && itemArray.indexOf(tabDomain) === -1) {
            document.getElementById('domain-list').innerHTML += '<div data-title="' + tabTitle + '" data-favicon="' + tabFavIconUrl + '" data-url="' + tabUrl + '" data-domain="' + tabDomain + '" class="site-list-item">' + tabDomain + '</div>';
            itemArray.push(tabDomain);
        }
    }
},function(){}).then( function(){

setTimeout(function () {
    var items = document.getElementsByClassName('site-list-item');
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', function (e) {
            var siteName = this.getAttribute('data-domain');
            var allTabsQuery1 = browser.tabs.query({currentWindow:true});
            allTabsQuery1.then(function (tabs) {
                var tabsListForLocalStorage = [];
                for (count in tabs) {
                    var tab = tabs[count];
                    var domain = getDomainFromUrl(tab.url);
                    domain = domain.replace("www.", '');
                    var condition = false;
                    if (siteName === 'all') {
                        condition = true;
                    } else if (siteName === 'selected') {
                        condition = tab.highlighted;
                    } else {
                        condition = domain === siteName;
                    }
                    if (domain && condition && tab.audible !== true) {


                        var tempTabDetailObject = {
                            id: tab.id,
                            title: tab.title,
                            url: tab.url,
                            favIcon: tab.favIconUrl,
                        };
                        tabsListForLocalStorage.push(tempTabDetailObject);


                    } else {
                        if (tab.url === browser.runtime.getURL( reDirUrl )) {
                            siteExists = { flag: true, id: tab.id };
                        }

                    }

                }



                if (siteName === 'selected') {
                    siteName = 'all';
                }

                if (localStorage.hasOwnProperty(siteName) || siteName !== 'all' ) {
                    if (!localStorage.hasOwnProperty('similar')) {
                        localStorage.similar = JSON.stringify({});
                    }
                    var oldDataOfSite ='';
                    if( siteName === 'all' ){
                        oldDataOfSite = JSON.parse(localStorage[siteName]);
                    }
                    if (siteName !== 'all') {
                        if( tabsListForLocalStorage.length ){
                            
                            var tempVals = [],
                                tempSimilar = JSON.parse(localStorage.similar);
                            if (tempSimilar.hasOwnProperty(siteName) ){
                                tempVals = tempSimilar[siteName];
                            }
                            
                            
                            oldDataOfSite = extend({},tempSimilar,{[siteName]:tempVals.concat(tabsListForLocalStorage)});
                            siteName = 'similar';
                        }
                        $(e.target).remove();
                    } else {

                        if (tabsListForLocalStorage.length) {
                            oldDataOfSite = oldDataOfSite.concat(tabsListForLocalStorage);
                        }
                    }
                    var newDataOfSite = JSON.stringify(oldDataOfSite);
                    localStorage.setItem(siteName, newDataOfSite);

                } else {

                    localStorage.setItem(siteName, JSON.stringify(tabsListForLocalStorage));
                }


                if (siteExists.flag) {
                    browser.tabs.reload(siteExists.id);
                } else {
                    browser.tabs.create({ index: 0, url: reDirUrl });
                }

                tabsListForLocalStorage.map(function (tabb) {
                    browser.tabs.remove(tabb.id);
                });
            },function(){});


        }, false);
    }

    document.getElementById('open-dashboard').addEventListener('click',function(){
        var allTabsQuery2 = browser.tabs.query({currentWindow:true});
        allTabsQuery2.then(function (tabs) {
           var hasDashboardOpened = false;
           for( tab in tabs){
               if( tabs[tab].url === browser.runtime.getURL( reDirUrl ) ){
                   hasDashboardOpened = true;
                   browser.tabs.update(tabs[tab].id,{active:true});
               }
               
              
           }
            if( !hasDashboardOpened ){
                browser.tabs.create({ index: 0, url: reDirUrl });
            } 
       },function(){}); 
    });
}, 0);
},function(){});


function getDomainFromUrl(url) {
    var splitedUrl = url.split('/');
    if (splitedUrl[0] !== 'moz-extension:' && splitedUrl[0] !== 'about:') {
        return url.split('/')[2] || '';
    } else {
        return '';
    }

}
function extend() {
    for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
            if (arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}