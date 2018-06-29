(function () {
    var url = new URL(window.location.href);
    var div_target = document.getElementById('target_div');
    var categories = document.getElementsByClassName('categories-item');
    var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 13 13"><polygon fill="#313131" fill-rule="evenodd" points="752.473 263.392 752.473 269.475 749.803 269.475 749.803 263.392 744.138 263.392 744.138 260.762 749.803 260.762 749.803 254.801 752.473 254.801 752.473 260.762 758.138 260.762 758.138 263.392" transform="rotate(45 687.657 -765.157)"/></svg>';

    renderTabs();
    function renderTabs(searchString) {
        var siteName = localStorage.selectedCategory || 'all';

        if (localStorage.hasOwnProperty(siteName)) {
            if (siteName === 'all') {
                div_target.innerHTML = '';
                var tempDOMString = '';
                var tabsFromSite = JSON.parse(localStorage[siteName]);
                
                if (tabsFromSite.length) {
                    
                    for (count in tabsFromSite) {
                        var tab = tabsFromSite[count];
                        var renderCondition = searchString ? tab.title.toLowerCase().includes(searchString.toLowerCase()) || tab.url.toLowerCase().includes(searchString.toLowerCase())  : true;
                        if(renderCondition){
                        tempDOMString += '<div class="item-card-wrap-outer" ><div class="item-card-wrap" ><div data-tab-id="' + tab.id + '" class="icon-card-close" >'+closeIcon+'</div><a target="_blank" href="' + tab.url + '"> <div class="item-card" > <div class="item-card-image" style="background:url(' + tab.favIcon + ');background-size:cover;" ></div></div></a><div class="item-card-title">' + tab.title + '</div></div></div>'
                        }
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
                    var renderCondition = searchString ? site.toLowerCase().includes(searchString.toLowerCase()) : true;
                       
                    if (sites[site].length && renderCondition ) {
                        div_target.innerHTML += '<div class="site-card-wrap" > <div data-site="' + site + '" class="site-card" > <div data-site="'+site+'" class="remove-site" >'+closeIcon+'</div> <div class="site-card-img-wrap" ><img src="' + sites[site][0].favIcon + '" /></div> <div class="site-card-item-count" >' + sites[site].length + '</div> </div><div class="site-name" >'+site+'</div></div>';
                    } else if(!sites[site].length) {
                        removeSite(site);
                    }
                }
                div_target.innerHTML += '<div id="dashboard-overlay" class="overlay" ></div><div id="dashboard-site-modal" class="modal" ></div>';

            }

        } else {
            div_target.innerHTML = '<div class="nothing-found" >Nothing Found</div>';
        }
        addListenersToAll();
        (function updateCount(){
        
        if( localStorage.similar ){
            var siteCount = document.getElementById('site-count');
            var tabsFromSite = JSON.parse(localStorage.similar);
            if(Object.keys(tabsFromSite).length){
                siteCount.innerText =  Object.keys(tabsFromSite).length;
                !siteCount.classList.contains('count-class') && siteCount.classList.add('count-class');
            }else{
                siteCount.innerText = '';
                siteCount.classList.contains('count-class') && siteCount.classList.remove('count-class');
            }
        }
        if( localStorage.all ){
            var tabsFromAll = JSON.parse(localStorage.all);
            var allCount = document.getElementById('all-count');
            console.log(tabsFromAll.length);
            if(tabsFromAll.length){
                allCount.innerHTML =  tabsFromAll.length;
                !allCount.classList.contains('count-class') && allCount.classList.add('count-class');
            }else{
                allCount.innerHTML = '';
                allCount.classList.contains('count-class') && allCount.classList.remove('count-class');
            }
            
        }
        }());
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
                var tempSiteName = sites[j].getAttribute('data-site');
                sites[j].addEventListener('click', similarItemClick.bind(this,tempSiteName));
            }


            for (var count = 0; count < categories.length; count++) {
                if (categories[count].getAttribute('data-category') === localStorage.selectedCategory) {
                    categories[count].style.background = '#EFF7FF';
                    categories[count].style.color = '#3b99fc';
                } else {
                    categories[count].style.background = 'unset';
                    categories[count].style.color = '#000000';
                }
            }

            var pagesInModal = document.getElementsByClassName('modal-item-remove');
            for (var k = 0; k < pagesInModal.length; k++) {
                pagesInModal[k].addEventListener('click', removeThisPageFromSite);
            }

            var siteRemoveButtons = document.getElementsByClassName('remove-site');
            for(var l = 0;l < siteRemoveButtons.length; l++){
                siteRemoveButtons[l].addEventListener('click',function(e){
                    removeSite(this.getAttribute('data-site'));
                    e.stopPropagation();
                    renderTabs();
                });
            }



        }, 0);
    }


    function similarItemClick(passedSite) {
        var selectedSiteName = passedSite,
            selectedSites = JSON.parse(localStorage.similar)[selectedSiteName] || [],
            modal = document.getElementById('dashboard-site-modal'),
            overlay = document.getElementById('dashboard-overlay');

        overlay.classList.add('show');
        modal.classList.add('show');

        overlay.addEventListener('click', function () {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            overlay.removeEventListener('click', function () { });
            renderTabs();
        });

        var tempContent = selectedSites.map(function (site) {
            return '<div class="modal-item" ><a href="'+site.url+'" target="_blank" ><div class="modal-item-title">' + site.title + '</div></a><div data-site="' + selectedSiteName + '" data-item="' + site.id + '" class="modal-item-remove" >'+closeIcon+'</div></div>'
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
        if( !newList.length ){
            renderTabs();
        }else{
            similarItemClick(siteOfPage);
        }
    }

    (function () {
        for (var count = 0; count < categories.length; count++) {
            categories[count].addEventListener('click', function () {
                localStorage.setItem('selectedCategory', this.getAttribute('data-category'));
                this.style.background = '#EFF7FF';
                renderTabs();
            });
        }

        var searchBar = document.getElementById('search-bar');
        searchBar.addEventListener('keyup',function(e){
            renderTabs(e.target.value);
        });

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
            if(confirm("Are you sure? Want to remove everything?")){
            var tempCategory = localStorage.selectedCategory;
            var parsedTabs = JSON.parse(localStorage[tempCategory]);
            if (tempCategory === 'all') {
                localStorage.setItem(tempCategory,JSON.stringify([]));
            } else if (tempCategory === 'similar') {
                localStorage.setItem(tempCategory,JSON.stringify({}));
            }
            renderTabs();
        }
        });



    }());

}());

function openTheseTabs(tabs){
    tabs.map(function (tab) {
        chrome.tabs.create({ index: 1, url: tab.url });
    });
}

function removeSite(site){
    var tempSites = JSON.parse(localStorage.similar);
    delete tempSites[site];
    localStorage.setItem('similar',JSON.stringify(tempSites));
}

function extend() {
    for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
            if (arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

