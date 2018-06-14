chrome.tabs.getAllInWindow(null, function (tabs) {
    var itemArray = [];
    for (tab in tabs) {
        var tabDomain = getDomainFromUrl(tabs[tab].url),
            tabUrl = tabs[tab].url,
            tabTitle = tabs[tab].title,
            tabFavIconUrl = tabs[tab].favIconUrl;

            tabDomain = tabDomain.replace( "www.",'' );


        if (tabDomain && itemArray.indexOf(tabDomain) === -1 ) {
            document.getElementById('popup-space').innerHTML += '<div data-title="'+tabTitle+' data-favicon="'+tabFavIconUrl+' data-url="'+tabUrl+'" data-domain="' + tabDomain + '" class="site-list-item">' + tabDomain + '</div>';
            itemArray.push(tabDomain);
        }
    }
});

setTimeout(function(){
    var items = document.getElementsByClassName('site-list-item');
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', function(){
            var domainName = this.getAttribute('data-domain');
            chrome.tabs.create({index:0,url:'organizedTabs.html?site='+domainName});
        }, false);
    }
},0);


function getDomainFromUrl(url) {
    var splitedUrl = url.split('/');
    if( splitedUrl[0] !== 'chrome-extension:' && splitedUrl[0] !== 'chrome:'  ){
        return url.split('/')[2] || '';
    }else{
       return '';
    }

}