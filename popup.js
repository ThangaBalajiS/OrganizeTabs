chrome.tabs.getAllInWindow(null, function (tabs) {
    var itemArray = [];
    for (tab in tabs) {
        var temp = getDomainFromUrl(tabs[tab].url);
        if (temp && itemArray.indexOf(temp) === -1 ) {
            document.getElementById('popup-space').innerHTML += '<div data-domain="' + temp + '" class="site-list-item">' + temp + '</div>';
            itemArray.push(temp);
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
    if( splitedUrl[0] !== 'chrome-extension:' ){
        return url.split('/')[2] || '';
    }else{
        return null;
    }

}