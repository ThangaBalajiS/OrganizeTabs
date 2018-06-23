(function () {
    var url = new URL(window.location.href);
    var div_target = document.getElementById('target_div');

    renderTabs();
    addListenersToAll();
    function renderTabs() {
        var siteName = localStorage.selectedCategory || 'all';
        if (localStorage.hasOwnProperty(siteName)) {
            if (siteName === 'all') {
                div_target.innerHTML = '';
                var tabsFromSite = JSON.parse(localStorage[siteName]);
                if (tabsFromSite.length) {
                    for (count in tabsFromSite) {
                        var tab = tabsFromSite[count];
                        div_target.innerHTML += '<div class="item-card" > <div data-tab-id="' + tab.id + '" class="icon-card-close" >X</div> <div class="item-card-image" > <img src="' + tab.favIcon + '"/> </div><div class="item-card-title">' + tab.title + '</div><div class="item-card-link" ><a target="_blank" href="' + tab.url + '"> Goto Site</a> </div></div>'
                    }
                } else {
                    div_target.innerHTML += '<div class="no-card-found" > Nothing Found </div>'
                }
            } else if (siteName === 'similar') {
                var sites = JSON.parse(localStorage[siteName]);
                var sitesArray = Object.keys(sites);
                div_target.innerHTML = '';
                for (var count in sitesArray) {
                    var site = sitesArray[count];
                    div_target.innerHTML += '<div class="site-card-wrap" ><div data-site="' + site + '" class="site-card" > <div class="site-card-img-wrap" ><img src="' + sites[site][0].favIcon + '" /></div> <div class="site-card-item-count" >' + sites[site].length + '</div> </div></div>';
                }
                div_target.innerHTML += '<div id="dashboard-overlay" class="overlay" ></div><div id="dashboard-site-modal" class="modal" ></div>';
            }

        } else {
            div_target.innerHTML += '<div class="nothing-found" >Nothing Found</div>'
        }
    }

    function addListenersToAll() {
        setTimeout(function () {
            var siteName = localStorage.selectedCategory || 'all';
            var closeIcons = document.getElementsByClassName('icon-card-close');
            for (var i = 0; i < closeIcons.length; i++) {
                closeIcons[i].addEventListener('click',ItemClose);
            }
            var categories = document.getElementsByClassName('categories-item');
            for (var count = 0; count < categories.length; count++) {
                categories[count].addEventListener('click', function () {
                    localStorage.setItem('selectedCategory', this.getAttribute('data-category'));
                    renderTabs();
                    addListenersToAll();
                });
            }

            var sites = document.getElementsByClassName('site-card');
            for (var j = 0; j < sites.length; j++) {
                sites[j].addEventListener('click', similarItemClick );
            }

        }, 0);
    }
}());


function similarItemClick() {
    var selectedSiteName = this.getAttribute('data-site'),
        selectedSites =  JSON.parse(localStorage.similar)[selectedSiteName] || [],
        modal = document.getElementById('dashboard-site-modal'),
        overlay = document.getElementById('dashboard-overlay');

    overlay.classList.add('show');
    modal.classList.add('show');

    overlay.addEventListener('click', function () {
        overlay.classList.remove('show');
        modal.classList.remove('show');
        overlay.removeEventListener('click',function(){});
    });

    var tempContent = selectedSites.map(function(site){
        return '<div class="modal-item" ><div class="modal-item-title">'+site.title+'</div><div data-item="'+site.id+'" class="modal-item-remove" >x</div></div>'
    });
        modal.innerHTML = '';
        modal.innerHTML += '<div class="modal-header"></div>';
        modal.innerHTML += '<div class="modal-body">'+tempContent.join("")+'</div>';                

}

function ItemClose() {
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

}