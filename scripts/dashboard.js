(function () {
    var url = new URL(window.location.href);
    var div_target = document.getElementById('target_div');
    var categories = document.getElementsByClassName('categories-item');

    renderTabs();
    function renderTabs() {
        var siteName = localStorage.selectedCategory || 'all';
        if (localStorage.hasOwnProperty(siteName)) {
            if (siteName === 'all') {
                div_target.innerHTML = '';
                var tempDOMString = '';
                var tabsFromSite = JSON.parse(localStorage[siteName]);
                if (tabsFromSite.length) {
                    for (count in tabsFromSite) {
                        var tab = tabsFromSite[count];
                        tempDOMString += '<div class="item-card-wrap" ><div data-tab-id="' + tab.id + '" class="icon-card-close" >x</div><a target="_blank" href="' + tab.url + '"> <div class="item-card" > <div class="item-card-image" style="background:url(' + tab.favIcon + ');background-size:cover;" ></div></div></a><div class="item-card-title">' + tab.title + '</div></div>'
                    }
                    div_target.innerHTML += '<div class="all-content-wrap" >' + tempDOMString + '</div>';
                } else {
                    div_target.innerHTML = '<div class="no-card-found" > Nothing Found </div>'
                }
            } else if (siteName === 'similar') {
                var sites = JSON.parse(localStorage[siteName]);
                var sitesArray = Object.keys(sites);
                div_target.innerHTML = '';
                for (var count in sitesArray) {
                    var site = sitesArray[count];
                    if (sites[site].length) {
                        div_target.innerHTML += '<div class="site-card-wrap" ><div data-site="' + site + '" class="site-card" > <div class="site-card-img-wrap" ><img src="' + sites[site][0].favIcon + '" /></div> <div class="site-card-item-count" >' + sites[site].length + '</div> </div></div>';
                    } else {
                        //TODO
                        //delete that key from localstorage if empty
                    }
                }
                div_target.innerHTML += '<div id="dashboard-overlay" class="overlay" ></div><div id="dashboard-site-modal" class="modal" ></div>';

            }

        } else {
            div_target.innerHTML = '<div class="nothing-found" >Nothing Found</div>';
        }
        addListenersToAll();
    }

    function addListenersToAll() {
        setTimeout(function () {
            var siteName = localStorage.selectedCategory || 'all';
            var closeIcons = document.getElementsByClassName('icon-card-close');
            for (var i = 0; i < closeIcons.length; i++) {
                closeIcons[i].addEventListener('click', ItemClose);
            }

            var sites = document.getElementsByClassName('site-card');
            for (var j = 0; j < sites.length; j++) {
                sites[j].addEventListener('click', similarItemClick);
            }


            for (var count = 0; count < categories.length; count++) {
                if (categories[count].getAttribute('data-category') === localStorage.selectedCategory) {
                    categories[count].style.background = '#EFF7FF';
                } else {
                    categories[count].style.background = 'unset';
                }
            }

            var pagesInModal = document.getElementsByClassName('modal-item-remove');
            for (var k = 0; k < pagesInModal.length; k++) {
                pagesInModal[k].addEventListener('click', removeThisPageFromSite);
            }



        }, 0);
    }


    function similarItemClick() {
        var selectedSiteName = this.getAttribute('data-site'),
            selectedSites = JSON.parse(localStorage.similar)[selectedSiteName] || [],
            modal = document.getElementById('dashboard-site-modal'),
            overlay = document.getElementById('dashboard-overlay');

        overlay.classList.add('show');
        modal.classList.add('show');

        overlay.addEventListener('click', function () {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            overlay.removeEventListener('click', function () { });
        });

        var tempContent = selectedSites.map(function (site) {
            return '<div class="modal-item" ><a href="'+site.url+'" target="_blank" ><div class="modal-item-title">' + site.title + '</div></a><div data-site="' + selectedSiteName + '" data-item="' + site.id + '" class="modal-item-remove" >x</div></div>'
        });
        modal.innerHTML = '';
        modal.innerHTML += '<div class="modal-header"><div class="modal-site-img" style="background:url(' + selectedSites[0].favIcon + ');background-size:cover;" ></div><div class="modal-header-title" >' + selectedSiteName + '</div><div id="open-all-of-this-site" data-site-name="'+selectedSiteName+'" >open all</div></div>';
        modal.innerHTML += '<div class="modal-body">' + tempContent.join("") + '</div>';
        var openAllInSite = document.getElementById('open-all-of-this-site');
        openAllInSite.addEventListener('click',function(){
           var targetSite =  this.getAttribute('data-site-name');
           var pagesInSite = JSON.parse(localStorage.similar)[targetSite];
           openTheseTabs(pagesInSite);
        });
        addListenersToAll();
    }

    //removes an item from category-all
    function ItemClose() {
        var tabId = this.getAttribute("data-tab-id");
        var tabsFromSite = JSON.parse(localStorage.all);
        if (tabsFromSite.length) {
            var newList = tabsFromSite.filter(function (item) {
                return item.id !== Number(tabId);
            });
            localStorage.all = JSON.stringify(newList);
            renderTabs();

        }

    }

    //removes a site from group of sites in category-similar tabs
    function removeThisPageFromSite() {
        var tabId = this.getAttribute("data-item");
        var siteOfPage = this.getAttribute("data-site");
        var tabsFromSite = JSON.parse(localStorage.similar)[siteOfPage];

        var newList = tabsFromSite.filter(function (item) {
            return item.id !== Number(tabId);
        });
        localStorage.similar = JSON.stringify(extend({}, JSON.parse(localStorage.similar), { [siteOfPage]: newList }));
        renderTabs();
    }

    (function () {
        for (var count = 0; count < categories.length; count++) {
            categories[count].addEventListener('click', function () {
                localStorage.setItem('selectedCategory', this.getAttribute('data-category'));
                this.style.background = '#EFF7FF';
                renderTabs();
            });
        }

        var allOpener = document.getElementById('open-all-tabs');
        allOpener.addEventListener('click', function () {
            var tempCategory = localStorage.selectedCategory;
            var parsedTabs = JSON.parse(localStorage[tempCategory]);
            if (tempCategory === 'all') {
                openTheseTabs(parsedTabs);
            } else if (tempCategory === 'similar') {
                var tempItemArray = Object.keys( parsedTabs );
                tempItemArray.map(function(item){
                    openTheseTabs(parsedTabs[item]);
                });
            }
        });

        var removeAll = document.getElementById('remove-all-tabs');
        removeAll.addEventListener('click',function(){
            var tempCategory = localStorage.selectedCategory;
            var parsedTabs = JSON.parse(localStorage[tempCategory]);
            if (tempCategory === 'all') {
                localStorage.setItem(tempCategory,JSON.stringify([]));
            } else if (tempCategory === 'similar') {
                localStorage.setItem(tempCategory,JSON.stringify({}));
            }
            renderTabs();
        });



    }());

}());

function openTheseTabs(tabs){
    tabs.map(function (tab) {
        chrome.tabs.create({ index: 1, url: tab.url });
    });
}


function extend() {
    for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
            if (arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

