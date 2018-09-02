var extBaseUrl = 'chrome-extension://' + chrome.runtime.id + '/';
var reDirUrl = 'templates/dashboard.html';
var siteExists = { flag: false, id: 0 };

document.body.style.background = '#fff';

chrome.tabs.getAllInWindow(null, function (tabs) {
    var itemArray = [];
    for (tab in tabs) {
        var tabDomain = getDomainFromUrl(tabs[tab].url),
            tabUrl = tabs[tab].url,
            tabTitle = tabs[tab].title,
            tabFavIconUrl = tabs[tab].favIconUrl;
        tabDomain = tabDomain.replace("www.", '');


        if (tabDomain && itemArray.indexOf(tabDomain) === -1) {
            document.getElementById('domain-list').innerHTML += '<div data-title="' + tabTitle + '" data-favicon="' + tabFavIconUrl + '" data-url="' + tabUrl + '" data-domain="' + tabDomain + '" class="site-list-item">' + tabDomain + '</div>';
            itemArray.push(tabDomain);
        }
    }
});

setTimeout(function () {
    var items = document.getElementsByClassName('site-list-item');
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', function () {
            var siteName = this.getAttribute('data-domain');
            chrome.tabs.getAllInWindow(null, function (tabs) {
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
                            id: guid(),
                            originId: tab.id,
                            title: tab.title,
                            url: tab.url,
                            favIcon: tab.favIconUrl || '../assets/null-icon.jpg' ,
                        };
                        tabsListForLocalStorage.push(tempTabDetailObject);


                    } else {
                        if (tab.url === extBaseUrl + reDirUrl) {
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
                    chrome.tabs.reload(siteExists.id);
                    localStorage.selectedCategory = 'all';
                } else {
                    localStorage.selectedCategory = 'all';
                    chrome.tabs.create({ index: 0, url: reDirUrl });
                }

                tabsListForLocalStorage.map(function (tabb) {
                    chrome.tabs.remove(tabb.originId);
                });
            });

            $(this).remove();
        }, false);
    }

    document.getElementById('open-dashboard').addEventListener('click',function(){
       chrome.tabs.getAllInWindow(null,function(tabs){
           var hasDashboardOpened = false;
           for( tab in tabs){
               if( tabs[tab].url === extBaseUrl + reDirUrl ){
                   hasDashboardOpened = true;
                   chrome.tabs.update(tabs[tab].id,{selected:true});
               }
               
              
           }
            if( !hasDashboardOpened ){
                chrome.tabs.create({ index: 0, url: reDirUrl });
            } 
       }); 
    });
}, 0);


function getDomainFromUrl(url) {
    var splitedUrl = url.split('/');
    if (splitedUrl[0] !== 'chrome-extension:' && splitedUrl[0] !== 'chrome:') {
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

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() +  s4();
}