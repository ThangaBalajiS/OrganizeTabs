(function () {
    var url = new URL(window.location.href);
    var siteName = url.searchParams.get('site');
    console.log(siteName);
    var div_target = document.getElementById('target_div');

    chrome.tabs.getAllInWindow(null, function (tabs) {
        console.log(tabs);
        for (count in tabs) {
            if (getDomainFromUrl(tabs[count].url) === siteName) {
                var tab = tabs[count];
                div_target.innerHTML += '<div class="item-card" > <div class="item-card-image" > <img src="'+ tab.favIconUrl +'"/> </div><div class="item-card-title">'+tab.title +'</div><div class="item-card-link" ><a target="_blank" href="'+ tab.url +'"> Goto Site</a> </div></div>'
                chrome.tabs.remove(tab.id);
            }
        }

    });

    function getDomainFromUrl(url) {

        return url.split('/')[2] || '';


    }


}());


