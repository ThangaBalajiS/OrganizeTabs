(function () {
    var div_target = document.getElementById('target_div');
    var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 13 13"><polygon fill="#313131" fill-rule="evenodd" points="752.473 263.392 752.473 269.475 749.803 269.475 749.803 263.392 744.138 263.392 744.138 260.762 749.803 260.762 749.803 254.801 752.473 254.801 752.473 260.762 758.138 260.762 758.138 263.392" transform="rotate(45 687.657 -765.157)"/></svg>';
    var nothingFound = '<div class="no-card-found" ><div class="nothing-found-head" >No Tabs Found <span class="nf-head-emoji" ><img src="../assets/emoji.png"/></span></div> <div class="nothing-found-desc" >Group tabs in the popup to make them appear here!</div><img style="height:350px;" src="../assets/nothing-found.jpg" /> </div>';

    if( localStorage.selectedCategory === 'similar' ){
        localStorage.selectedCategory = 'all';
    }

    window.renderTabs = renderTabs;

    renderTabs();
    function renderTabs(searchString) {

        var actualCategories = ['similar', 'all'];

        div_target.innerHTML = '';

        var selectedGroup = localStorage.selectedCategory;

        for (var singleCategory in actualCategories) {

            var siteName = actualCategories[singleCategory];
          //  if (localStorage.hasOwnProperty(siteName)) {
                var isEmpty = 0;
                if (siteName === 'all') {
                    var tempDOMString = '';
                    var tabsFromSite = [];
                    if( selectedGroup === 'all' ){
                        tabsFromSite = JSON.parse(localStorage.all);
                    }else{
                        try{
                            tabsFromSite = JSON.parse( localStorage.group )[selectedGroup].all;
                        }catch(e){
                            tabsFromSite = [];
                        }
                    }

                    if (tabsFromSite.length) {

                        for (count in tabsFromSite) {
                            var tab = tabsFromSite[count];
                            var renderCondition = searchString ? tab.title.toLowerCase().includes(searchString.toLowerCase()) || tab.url.toLowerCase().includes(searchString.toLowerCase()) : true;
                            if (renderCondition) {
                                tempDOMString += '<div class="item-card-wrap-outer to-drag" ><div class="item-card-wrap" data-title="'+ tab.title +'" data-favicon="'+ tab.favIcon +'" data-id="' + tab.id + '" data-url="' + tab.url + '" > <div class="item-card" > <div class="item-card-image" > <img src="' + tab.favIcon + '" /> </div><div class="item-card-title">' + tab.title + '</div></div></div></div>'
                            }
                        }
                        div_target.innerHTML += '<div class="all-content-wrap" >' + tempDOMString + '</div>';
                    } else {
                        isEmpty++;
                    }
                } else if (siteName === 'similar') {
                    var sites = {}; 
                    if( selectedGroup !== 'all' ){
                        try{
                            sites = JSON.parse( localStorage.group)[selectedGroup].similar;
                        }catch(e){
                            sites = {};
                        }
                    }else{
                        sites = JSON.parse(localStorage.similar);
                    }
                    var sitesArray = Object.keys(sites);
                    if (sitesArray.length) {
                        for (var count in sitesArray) {
                            var site = sitesArray[count];
                            var renderCondition = searchString ? site.toLowerCase().includes(searchString.toLowerCase()) : true;

                            if (sites[site].length && renderCondition  ) {
                                div_target.innerHTML += '<div class="site-card-wrap to-drag" > <div data-site="' + site + '" class="site-card" >  <div class="site-card-img-wrap" ><img src="' + sites[site][0].favIcon + '" /></div> <div class="site-card-item-count" >' + sites[site].length + '</div> </div><div class="site-name" >' + site + '</div></div>';
                            } else if (!sites[site].length) {
                                removeSite(site);
                            }
                        }
                        div_target.innerHTML += '<div id="dashboard-overlay" class="overlay" ></div><div id="dashboard-site-modal" class="modal" ></div>';
                    } else {
                        isEmpty++;
                    }
                }
                if (isEmpty > 1) {
                    div_target.innerHTML = nothingFound;
                }
            // } else {
            //     div_target.innerHTML = nothingFound;
            // }

        }
        addListenersToAll();

        window.dnd();
    }

    function addListenersToAll() {
        setTimeout(function () {

            var sites = $('.site-card');
            sites.off();
            var longPressTime = 200;
            var siteHoldStart;
            for (var j = 0; j < sites.length; j++) {

                $(sites[j]).on('mousedown', function (e) {
                    if( !$(this).parent().hasClass( 'item-selected' ) && !(e.metaKey || e.ctrlKey) ){
                        if ($('.item-selected').length) {
                            $('.item-selected').removeClass('item-selected');
                        }
                    }
                    siteHoldStart = new Date().getTime();
                });

                $(sites[j]).on('mouseleave', function () {
                    siteHoldStart = 0;
                });

                $(sites[j]).on('mouseup', function (e) {
                    if (new Date().getTime() >= (siteHoldStart + longPressTime)) {

                        //handle long press if needed

                    } else {
                        if (e.metaKey || e.ctrlKey) {
                            $(this).parent().toggleClass('item-selected');
                        } else {
                            if ($('.item-selected').length) {
                                $('.item-selected').removeClass('item-selected');
                            } else {
                                similarItemClick($(e.target).closest('.site-card').attr('data-site'));
                            }
                        }
                    }
                });
            }


            var pagesInModal = $('.modal-item-remove');
            for (var k = 0; k < pagesInModal.length; k++) {
                pagesInModal[k].addEventListener('click', removeThisPageFromSite);
            }


            var holdStart;
            var allItems = $('.item-card-wrap');
            allItems.off();
            for (var site = 0; site < allItems.length; site++) {
                $(allItems[site]).on('mousedown', function (e) {
                    if( !$(this).parent().hasClass( 'item-selected' ) && !(e.metaKey || e.ctrlKey) ){
                        if ($('.item-selected').length) {
                            $('.item-selected').removeClass('item-selected');
                        }
                    }
                    holdStart = new Date().getTime();
                });

                $(allItems[site]).on('mouseleave', function (e) {
                    holdStart = 0;
                });

                $(allItems[site]).on('mouseup', function (e) {
                    if (new Date().getTime() >= (holdStart + longPressTime)) {

                        //handle long press if needed

                    } else {
                        if (e.metaKey || e.ctrlKey) {
                            $(this).parent().toggleClass('item-selected');
                        } else {
                            if ($('.item-selected').length) {
                                $('.item-selected').removeClass('item-selected');
                            } else {
                                chrome.tabs.create({ index: 1, url: $(this).attr('data-url') });
                            }
                        }
                    }
                });
            }

        }, 0);
    }


    function similarItemClick(passedSite) {
        var selectedSiteName = passedSite,
            selectedCategory = localStorage.selectedCategory,
            selectedSites = [],
            modal = document.getElementById('dashboard-site-modal'),
            overlay = document.getElementById('dashboard-overlay'),
            lStorage = window.helpers.getStore();
            if( selectedCategory === 'all' ){
                selectedSites = lStorage.similar[ selectedSiteName ];
            }else{
                selectedSites = lStorage.group[ selectedCategory ].similar[ selectedSiteName ];
            }


        overlay.classList.add('show');
        modal.classList.add('show');

        overlay.addEventListener('click', function () {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            overlay.removeEventListener('click', function () { });
            renderTabs();
        });

        var tempContent = selectedSites.map(function (site) {
            return site ? '<div class="modal-item" ><a href="' + site.url + '" target="_blank" ><div class="modal-item-title">' + site.title + '</div></a><div data-site="' + selectedSiteName + '" data-item="' + site.id + '" class="modal-item-remove" >' + closeIcon + '</div></div>' : '';
        });
        modal.innerHTML = '';
        console.log( selectedSites );
        modal.innerHTML += '<div class="modal-header"><div class="modal-site-img" style="background:url(' + selectedSites[0].favIcon + ');background-size:cover;" ></div><div class="modal-header-title" >' + selectedSiteName + '</div><div id="open-all-of-this-site" data-site-name="' + selectedSiteName + '" >open all</div></div>';
        modal.innerHTML += '<div class="modal-body">' + tempContent.join("") + '</div>';
        var openAllInSite = document.getElementById('open-all-of-this-site');
        openAllInSite.addEventListener('click', function () {
            var targetSite = this.getAttribute('data-site-name');
            var pagesInSite = []; JSON.parse(localStorage.similar)[targetSite];
            if( selectedCategory === 'all' ){
                pagesInSite = lStorage.similar[ selectedSiteName ];
            }else{
                pagesInSite = lStorage.group[ selectedCategory ].similar[ selectedSiteName ];
            }
            openTheseTabs(pagesInSite);
        });
        addListenersToAll();
    }

    //removes an item from category-all
    function ItemClose(e) {
        console.log(e);
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
        localStorage.similar = JSON.stringify($.extend({}, JSON.parse(localStorage.similar), { [siteOfPage]: newList }));
        if (!newList.length) {
            renderTabs();
        } else {
            similarItemClick(siteOfPage);
        }
    }

    (function () {

        var searchBar = document.getElementById('search-bar');
        searchBar.addEventListener('keyup', function (e) {
            renderTabs(e.target.value);
        });

        var allOpener = document.getElementById('open-all-tabs');
        allOpener.addEventListener('click', function () {
            var tempCategory = localStorage.selectedCategory || 'all';
            var parsedTabs = JSON.parse(localStorage[tempCategory]);
            if (tempCategory === 'all') {
                openTheseTabs(parsedTabs);
            }
        });

        var removeAll = document.getElementById('remove-all-tabs');
        removeAll.addEventListener('click', function () {
            if (confirm("Are you sure? Want to remove everything?")) {
                var tempCategory = localStorage.selectedCategory || 'all';
                if (tempCategory === 'all') {
                    localStorage.setItem(tempCategory, JSON.stringify([]));
                } else if (tempCategory === 'similar') {
                    localStorage.setItem(tempCategory, JSON.stringify({}));
                }
                renderTabs();
            }
        });
    }());

    $('#target_div').on('click', function (e) {
        if ($(e.target).attr('id') === 'target_div') {
            $('.item-selected').removeClass('item-selected');
        }
    });

}());

function openTheseTabs(tabs) {
    tabs.map(function (tab) {
        chrome.tabs.create({ index: 1, url: tab.url });
    });
}

function removeSite(site) {
    var tempSites = JSON.parse(localStorage.similar);
    delete tempSites[site];
    localStorage.setItem('similar', JSON.stringify(tempSites));
}


(function () {
    if (localStorage.selectedCategory) {
        document.getElementById('corousel-wrap-wrap').style.display = 'none';
    } else {
        document.getElementById('corousel-wrap-wrap').style.display = 'block';
    }
    var slideIndex = 1;
    showDivs(slideIndex);

    function plusDivs(n) {
        showDivs(slideIndex += n);
    }

    document.getElementById('btn-l').addEventListener('click', function (e) { e.stopPropagation(); plusDivs(-1) });
    document.getElementById('btn-r').addEventListener('click', function (e) { e.stopPropagation(); plusDivs(1) });

    function showDivs(n) {
        var i;
        var x = document.getElementsByClassName("mySlides");
        if (n > x.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = x.length }
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex - 1].style.display = "block";
    }

    document.getElementById('take-a-tour').addEventListener('click', function () {
        document.getElementById('corousel-wrap-wrap').style.display = 'block';
    });

    document.getElementById('corousel-wrap-wrap').addEventListener('click', function () {
        this.style.display = 'none';
    });


}());