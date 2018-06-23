(function () {
    var url = new URL(window.location.href);
    var div_target = document.getElementById('target_div');

    renderTabs();
    addListenersToAll();
    function renderTabs() {
        var siteName = localStorage.selectedCategory || 'all' ;
        if (localStorage.hasOwnProperty(siteName)) {
            div_target.innerHTML = '';
            var tabsFromSite = JSON.parse(localStorage[siteName]);
            if (tabsFromSite.length) {
                for (count in tabsFromSite) {
                    var tab = tabsFromSite[count];
                    div_target.innerHTML += '<div class="item-card" > <div data-tab-id="' + tab.id + '" class="icon-card-close" >X</div> <div class="item-card-image" > <img src="' + tab.favIcon + '"/> </div><div class="item-card-title">' + tab.title + '</div><div class="item-card-link" ><a target="_blank" href="' + tab.url + '"> Goto Site</a> </div></div>'
                }
            }else{
                div_target.innerHTML +='<div class="noting-found" > Nothing Found </div>'
            }
        } else {
            div_target.innerHTML += '<div>Nothing Found</div>'
        }
    }

 function addListenersToAll(){
    setTimeout(function () {
        var siteName = localStorage.selectedCategory || 'all' ;
        var closeIcons = document.getElementsByClassName('icon-card-close');
        for (var i = 0; i < closeIcons.length; i++) {
            closeIcons[i].addEventListener('click', function () {
                var tabId = this.getAttribute("data-tab-id");
                var tabsFromSite = JSON.parse(localStorage[siteName]);
                if (tabsFromSite.length) {
                    var newList = tabsFromSite.filter(function (item) {
                        return item.id !== Number(tabId);
                    });
                    localStorage[siteName] = JSON.stringify(newList);
                    renderTabs();
                    addListenersToAll();
                }

            });
        }
        var categories = document.getElementsByClassName('categories-item');
        for (var count = 0; count < categories.length;count++){
            categories[count].addEventListener('click',function(){
                localStorage.setItem('selectedCategory',this.getAttribute('data-category'));
                renderTabs();
                addListenersToAll();
            });
        }

    }, 0);
 }   
}());


