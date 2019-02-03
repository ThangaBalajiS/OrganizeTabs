(function () {
    var div_target = document.getElementById('target_div');
    var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 13 13"><polygon points="752.473 263.392 752.473 269.475 749.803 269.475 749.803 263.392 744.138 263.392 744.138 260.762 749.803 260.762 749.803 254.801 752.473 254.801 752.473 260.762 758.138 260.762 758.138 263.392" transform="rotate(45 687.657 -765.157)"/></svg>';
    var nothingFound = '<div class="no-card-found" ><div class="nothing-found-head" >No Tabs Found <span class="nf-head-emoji" ><img src="../assets/emoji.png"/></span></div> <div class="nothing-found-desc" >Group tabs in the popup to make them appear here!</div><img style="height:350px;" src="../assets/nothing-found.jpg" /> </div>';

    window.helpers.initStore();
    $( document ).on( 'click',function(e){
        $( '.group-options-dd' ).css('display','none');
    } );

    Parse.initialize("myAppIddasdasdasdasd");
    Parse.serverURL = "http://tabsmanager.herokuapp.com/parse";
    var GameScore = Parse.Object.extend("TabsData");
    var query = new Parse.Query(GameScore);
    query.equalTo("hash", 'bc62ea66bfac6da3094dbb9f');
    query.find()
        .then((gameScore) => {
            console.log( gameScore );
    });

    if( localStorage.darkMode ){
        $('body').addClass( 'dark-mode' );
        window.darkMode = true;
    }

    $( '.logo-img' ).on( 'click',function(){
        if(! window.darkMode ){
            $('body').addClass('dark-mode');
            window.darkMode = true;
            localStorage.darkMode = true;
        }else{
            $('body').removeClass('dark-mode');
            window.darkMode = false;
            localStorage.darkMode = '';
        }
    });

    $(document).keydown(function(e) {
        if( (e.metaKey || e.ctrlKey ) && e.keyCode === 65 ){
            $( '.to-drag' ).addClass( 'item-selected' );
        }

  });

    if( localStorage.selectedCategory === 'similar' ){
        localStorage.selectedCategory = 'all';
    }

    window.renderTabs = renderTabs;

    renderTabs();
    function renderTabs(searchString) {

        var actualCategories = ['similar', 'all'];

        div_target.innerHTML = '';

        var selectedGroup = localStorage.selectedCategory;

        var isEmpty = 0;
        for (var singleCategory in actualCategories) {

            var siteName = actualCategories[singleCategory];
          //  if (localStorage.hasOwnProperty(siteName)) {
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
                                tab.title = tab.title || tab.url;
                                tempDOMString += '<div class="item-card-wrap-outer to-drag" ><div data-item="'+tab.id +'" class="remove-item" >'+closeIcon+'</div><div class="item-card-wrap" data-title="'+ tab.title +'" data-favicon="'+ tab.favIcon +'" data-id="' + tab.id + '" data-url="' + tab.url + '" > <div class="item-card" > <div class="item-card-image" > <img src="' + tab.favIcon + '" /> </div><div class="item-card-title">' + tab.title + '</div></div></div></div>'
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
                                div_target.innerHTML += '<div class="site-card-wrap to-drag" ><div data-site="'+site+'" class="remove-site" >'+closeIcon+'</div> <div data-site="' + site + '" class="site-card" >  <div class="site-card-img-wrap" ><img src="' + sites[site][0].favIcon + '" /></div> <div class="site-card-item-count" >' + sites[site].length + '</div> </div><div class="site-name" >' + site + '</div></div>';
                            } else if (!sites[site].length) {
                                removeSite(site);
                            }
                        }
                    } else {
                        isEmpty++;
                    }
                }
             
            // } else {
            //     div_target.innerHTML = nothingFound;
            // }

        }
        if (isEmpty > 1) {
            div_target.innerHTML = nothingFound;
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
            var siteRemoveButtons = document.getElementsByClassName('remove-site');
            for(var l = 0;l < siteRemoveButtons.length; l++){
                siteRemoveButtons[l].addEventListener('click',function(e){
                    removeSite(this.getAttribute('data-site'));
                    e.stopPropagation();
                    renderTabs();
                });
            }

            $( '.remove-item' ).on('click',function(){
                lStorage = window.helpers.getStore();
                var tempSites = {};
                if( localStorage.selectedCategory === 'all' ){
                    lStorage.all =  window.helpers.removeFromArray(lStorage.all,this.getAttribute( 'data-item' ));
                } else {
                    lStorage.group[localStorage.selectedCategory].all = window.helpers.removeFromArray(lStorage.group[localStorage.selectedCategory].all,this.getAttribute('data-item'));       
                }
                window.helpers.setStore( lStorage );
                renderTabs();
            } );


            var holdStart;
            var allItems = $('.item-card-wrap');
            allItems.off();
            for (var site = 0; site < allItems.length; site++) {
                $(allItems[site]).on('mousedown', function (e) {
                    if( !$(this).parent().hasClass( 'item-selected' ) && !(e.metaKey || e.ctrlKey) ){
                        if ($('.item-selected').length) {
                          //  $('.item-selected').removeClass('item-selected');
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
            return site ? '<div class="modal-item" ><a href="' + site.url + '" target="_blank" ><div class="modal-item-title">' + ( site.title ?  site.title : site.url ) + '</div></a><div data-site="' + selectedSiteName + '" data-item="' + site.id + '" class="modal-item-remove" >' + closeIcon + '</div></div>' : '';
        });
        modal.innerHTML = '';
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



    //removes a site from group of sites in category-similar tabs
    function removeThisPageFromSite() {
        var tabId = this.getAttribute("data-item");
        var siteOfPage = this.getAttribute("data-site");
        //var tabsFromSite = JSON.parse(localStorage.similar)[siteOfPage];
        var lStorage = window.helpers.getStore(); 

        var tabsFromSite = [];
        if( localStorage.selectedCategory === 'all' ){
            tabsFromSite = lStorage.similar[siteOfPage];
            var newList = tabsFromSite.filter(function (item) {
                return item.id !== tabId;
            });
            lStorage.similar[siteOfPage] = newList;
        }else{
            tabsFromSite = lStorage.group[localStorage.selectedCategory].similar[siteOfPage];
            var newList = tabsFromSite.filter(function (item) {
                return item.id !== tabId;
            });
            lStorage.group[localStorage.selectedCategory].similar[siteOfPage] = newList;
        }

        window.helpers.setStore(lStorage);

        if (!newList.length) {
           var modal = document.getElementById('dashboard-site-modal'),
            overlay = document.getElementById('dashboard-overlay');
            overlay.classList.remove('show');
            modal.classList.remove('show');
            overlay.removeEventListener('click', function () { });
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

    }());

    $('#target_div').on('click', function (e) {
        if( e.target === this ){
            console.log($(e.target).delegate());
        }else{
            console.log( 'aaa');
        }
        if ($(e.target).attr('id') === 'target_div') {
        //    / console.log('dasdsad');
            $('.item-selected').removeClass('item-selected');
        }
    });

}());

function openTheseTabs(tabs) {
    tabs.map(function (tab) {
        chrome.tabs.create({ index: 100, url: tab.url });
    });
}

function removeSite(site) {
    var lStorage = window.helpers.getStore();
    var tempSites = {};
    if( localStorage.selectedCategory === 'all' ){
        delete lStorage.similar[site];
    } else {
        delete lStorage.group[localStorage.selectedCategory].similar[site];       
    }
    window.helpers.setStore( lStorage );
}


(function () {
    if (localStorage.selectedCategory) {
        document.getElementById('corousel-wrap-wrap').style.display = 'none';
    } else {
        document.getElementById('corousel-wrap-wrap').style.display = 'block';
    }

    document.getElementById('take-a-tour').addEventListener('click', function () {
        document.getElementById('corousel-wrap-wrap').style.display = 'block';
    });

    $('#corousel-wrap-wrap').off();
    $('#corousel-wrap-wrap').on('click',function(){
        $(this).css('display','none');
        $('iframe').attr('src', $('iframe').attr('src'));
    });
 
}());
(function(){


    var copyIcon = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 488.3 488.3" style="enable-background:new 0 0 488.3 488.3;" xml:space="preserve"><g><g><path d="M314.25,85.4h-227c-21.3,0-38.6,17.3-38.6,38.6v325.7c0,21.3,17.3,38.6,38.6,38.6h227c21.3,0,38.6-17.3,38.6-38.6V124           C352.75,102.7,335.45,85.4,314.25,85.4z M325.75,449.6c0,6.4-5.2,11.6-11.6,11.6h-227c-6.4,0-11.6-5.2-11.6-11.6V124 c0-6.4,5.2-11.6,11.6-11.6h227c6.4,0,11.6,5.2,11.6,11.6V449.6z"/> <path d="M401.05,0h-227c-21.3,0-38.6,17.3-38.6,38.6c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5c0-6.4,5.2-11.6,11.6-11.6h227     c6.4,0,11.6,5.2,11.6,11.6v325.7c0,6.4-5.2,11.6-11.6,11.6c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5c21.3,0,38.6-17.3,38.6-38.6  V38.6C439.65,17.3,422.35,0,401.05,0z"/></g></g></svg>';

    $('#open-all-tabs').click( function(){
        var searchString = $( '#search-bar' ).val();
        var actualCategories = ['similar', 'all'];
        var selectedGroup = localStorage.selectedCategory;
        for (var singleCategory in actualCategories) {
            var siteName = actualCategories[singleCategory];
                if (siteName === 'all') {
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
                                chrome.tabs.create({index:100,url:tab.url});
                             }
                        }
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
                                openTheseTabs(sites[site]);
                            } else if (!sites[site].length) {
                                removeSite(site);
                            }
                        }
                    }
                }
        }
    });

    $('.share-history').click( function(){

        var modal = document.getElementById('dashboard-site-modal'),
            lStorage = window.helpers.getStore(),
            links = lStorage.myLinks,
            overlay = document.getElementById('dashboard-overlay');

        var tempContent = '';
        if( links.length ){
            tempContent = links.map(function (link) {
                return link ? '<div class="modal-item" ><a href="http://itabsmanager.tk/?secureCode=' + link + '" target="_blank" >http://itabsmanager.tk/?secureCode=' + link + '</a> <span class="your-links-btn" data-url="http://itabsmanager.tk/?secureCode=' + link + '" >'+copyIcon+'</span> </div>' : '';
            });
        } else {
            tempContent = ['<div class="link-empty-notice" > You haven\'t created any links yet. CMD/CTRL + click an item to  select and click share to create a sharable link  </div>']
        }
        
      
        modal.innerHTML = '';
        modal.innerHTML += '<div class="modal-header"><div class="modal-header-title" > Your Links </div></div>';
        modal.innerHTML += '<div class="modal-body">' + tempContent.join("") + '</div>';
        
        modal.classList.add('show');
        overlay.classList.add('show');

        overlay.addEventListener('click', function () {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            overlay.removeEventListener('click', function () { });
            renderTabs();
        });

        setTimeout(function () {
            $('.your-links-btn').off()
            $('.your-links-btn').on('click', function () {
                var copyElement = document.getElementById("linkCopyHelper");
                
                copyElement.value = ($(this).attr('data-url'));
                
                /* Select the text field */
                copyElement.select();

                /* Copy the text inside the text field */
                document.execCommand("copy");

            });
        }, 0);
    } );

}());