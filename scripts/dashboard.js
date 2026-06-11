(async function () {
    var div_target = document.getElementById('target_div');
    var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 13 13"><polygon points="752.473 263.392 752.473 269.475 749.803 269.475 749.803 263.392 744.138 263.392 744.138 260.762 749.803 260.762 749.803 254.801 752.473 254.801 752.473 260.762 758.138 260.762 758.138 263.392" transform="rotate(45 687.657 -765.157)"/></svg>';
    var nothingFound = '<div class="no-card-found" ><div class="nothing-found-head" >' + chrome.i18n.getMessage('nothing_found') + ' <span class="nf-head-emoji" ><img src="../assets/emoji.png"/></span></div> <div class="nothing-found-desc" >' + chrome.i18n.getMessage('nothing_found_desc') + '</div><img style="height:350px; margin-top:400px" src="../assets/nothing-found.jpg" /> </div>';

    await window.helpers.initStore();
    $(document).on('click', function (e) {
        $('.group-options-dd').css('display', 'none');
    });

    const initialStore = await window.helpers.getStore();

    if (!initialStore.releaseNotesDismissed) {
        document.getElementById('release-notes-banner').style.display = 'block';
    }

    document.getElementById('dismiss-release-notes').addEventListener('click', async function () {
        const store = await window.helpers.getStore();
        store.releaseNotesDismissed = true;
        await window.helpers.setStore(store);
        document.getElementById('release-notes-banner').style.display = 'none';
    });

    const theme = initialStore.theme || (initialStore.darkMode ? 'dark' : 'light');
    
    async function setTheme(newTheme) {
        const store = await window.helpers.getStore();
        store.theme = newTheme;
        window.currentTheme = newTheme;
        
        function applyTheme(isDark) {
            if (isDark) {
                $('body').addClass('dark-mode');
                window.darkMode = true;
                store.darkMode = true;
            } else {
                $('body').removeClass('dark-mode');
                window.darkMode = false;
                store.darkMode = false;
            }
        }

        if (newTheme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(systemPrefersDark.matches);
            
            // Remove previous listener if any
            if (window.themeMediaQueryListener) {
                systemPrefersDark.removeEventListener('change', window.themeMediaQueryListener);
            }
            
            window.themeMediaQueryListener = (e) => {
                if (window.currentTheme === 'system') {
                    applyTheme(e.matches);
                }
            };
            systemPrefersDark.addEventListener('change', window.themeMediaQueryListener);
        } else {
            applyTheme(newTheme === 'dark');
            if (window.themeMediaQueryListener) {
                window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', window.themeMediaQueryListener);
                window.themeMediaQueryListener = null;
            }
        }
        
        await window.helpers.setStore(store);
        updateThemeSelectorUI(newTheme);
    }

    function updateThemeSelectorUI(currentTheme) {
        $('.theme-option').removeClass('active');
        $(`.theme-option[data-theme="${currentTheme}"]`).addClass('active');
        
        // Update main button icon
        const iconHtml = $(`.theme-option[data-theme="${currentTheme}"] svg`).prop('outerHTML');
        $('#theme-btn').html(iconHtml);
    }

    // Initialize theme
    setTheme(theme);

    // Toggle dropdown
    $('#theme-btn').on('click', function(e) {
        e.stopPropagation();
        $('#theme-dropdown').toggleClass('show');
    });

    // Close dropdown on click outside
    $(document).on('click', function() {
        $('#theme-dropdown').removeClass('show');
    });

    // Theme selector click
    $(document).on('click', '.theme-option', async function(e) {
        e.stopPropagation();
        const selectedTheme = $(this).data('theme');
        await setTheme(selectedTheme);
        $('#theme-dropdown').removeClass('show');
    });

    // Legacy logo click to cycle through themes
    $('.logo-img').on('click', async function () {
        const themes = ['light', 'dark', 'system'];
        let currentIndex = themes.indexOf(window.currentTheme);
        let nextIndex = (currentIndex + 1) % themes.length;
        await setTheme(themes[nextIndex]);
    });

    $(document).keydown(function (e) {
        if ((e.metaKey || e.ctrlKey) && e.keyCode === 65) {
            $('.to-drag').addClass('item-selected');
        }

    });

    if (initialStore.selectedCategory === 'similar') {
        await window.helpers.setStore({ selectedCategory: 'all' });
    }

    window.renderTabs = renderTabs;

    await renderTabs();
    async function renderTabs(searchString) {
        const lStorage = await window.helpers.getStore();
        var actualCategories = ['similar', 'all'];

        div_target.innerHTML = '';

        var selectedGroup = lStorage.selectedCategory;

        var isEmpty = 0;
        for (var singleCategory in actualCategories) {

            var siteName = actualCategories[singleCategory];
            if (siteName === 'all') {
                var tempDOMString = '';
                var tabsFromSite = [];
                if (selectedGroup === 'all') {
                    tabsFromSite = lStorage.all || [];
                } else {
                    try {
                        tabsFromSite = lStorage.group[selectedGroup].all;
                    } catch (e) {
                        tabsFromSite = [];
                    }
                }

                if (tabsFromSite.length) {

                    for (var count in tabsFromSite) {
                        var tab = tabsFromSite[count];
                        var renderCondition = searchString ? tab.title.toLowerCase().includes(searchString.toLowerCase()) || tab.url.toLowerCase().includes(searchString.toLowerCase()) : true;
                        if (renderCondition) {
                            tab.title = tab.title || tab.url;
                            tempDOMString += '<div class="item-card-wrap-outer to-drag" ><div data-item="' + tab.id + '" class="remove-item" >' + closeIcon + '</div><div class="item-card-wrap" data-title="' + tab.title + '" data-favicon="' + tab.favIcon + '" data-id="' + tab.id + '" data-url="' + tab.url + '" > <div class="item-card" > <div class="item-card-image" > <img src="' + tab.favIcon + '" /> </div><div class="item-card-title">' + tab.title + '</div></div></div></div>'
                        }
                    }
                    div_target.innerHTML += '<div class="all-content-wrap" >' + tempDOMString + '</div>';
                } else {
                    isEmpty++;
                }
            } else if (siteName === 'similar') {
                var sites = {};
                if (selectedGroup !== 'all') {
                    try {
                        sites = lStorage.group[selectedGroup].similar;
                    } catch (e) {
                        sites = {};
                    }
                } else {
                    sites = lStorage.similar || {};
                }
                var sitesArray = Object.keys(sites);
                if (sitesArray.length) {
                    for (var count in sitesArray) {
                        var site = sitesArray[count];
                        var renderCondition = searchString ? site.toLowerCase().includes(searchString.toLowerCase()) : true;

                        if (sites[site].length && renderCondition) {
                            div_target.innerHTML += '<div class="site-card-wrap to-drag" ><div data-site="' + site + '" class="remove-site" >' + closeIcon + '</div> <div data-site="' + site + '" class="site-card" >  <div class="site-card-img-wrap" ><img src="' + sites[site][0].favIcon + '" /></div> <div class="site-card-item-count" >' + sites[site].length + '</div> </div><div class="site-name" >' + site + '</div></div>';
                        } else if (!sites[site].length) {
                            await removeSite(site);
                        }
                    }
                } else {
                    isEmpty++;
                }
            }

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
                    if (!$(this).parent().hasClass('item-selected') && !(e.metaKey || e.ctrlKey)) {
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
            for (var l = 0; l < siteRemoveButtons.length; l++) {
                siteRemoveButtons[l].addEventListener('click', async function (e) {
                    await removeSite(this.getAttribute('data-site'));
                    e.stopPropagation();
                    await renderTabs();
                });
            }

            $('.remove-item').on('click', async function () {
                const lStorage = await window.helpers.getStore();
                if (lStorage.selectedCategory === 'all') {
                    lStorage.all = window.helpers.removeFromArray(lStorage.all, this.getAttribute('data-item'));
                } else {
                    lStorage.group[lStorage.selectedCategory].all = window.helpers.removeFromArray(lStorage.group[lStorage.selectedCategory].all, this.getAttribute('data-item'));
                }
                await window.helpers.setStore(lStorage);
                await renderTabs();
            });


            var holdStart;
            var allItems = $('.item-card-wrap');
            allItems.off();
            for (var site = 0; site < allItems.length; site++) {
                $(allItems[site]).on('mousedown', function (e) {
                    if (!$(this).parent().hasClass('item-selected') && !(e.metaKey || e.ctrlKey)) {
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


    async function similarItemClick(passedSite) {
        var selectedSiteName = passedSite,
            modal = document.getElementById('dashboard-site-modal'),
            overlay = document.getElementById('dashboard-overlay');
            
        const lStorage = await window.helpers.getStore();
        var selectedCategory = lStorage.selectedCategory;
        var selectedSites = [];
        if (selectedCategory === 'all') {
            selectedSites = lStorage.similar[selectedSiteName];
        } else {
            selectedSites = lStorage.group[selectedCategory].similar[selectedSiteName];
        }


        overlay.classList.add('show');
        modal.classList.add('show');

        overlay.addEventListener('click', async function () {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            overlay.removeEventListener('click', function () { });
            await renderTabs();
        });

        var tempContent = selectedSites.map(function (site) {
            return site ? '<div class="modal-item" ><a href="' + site.url + '" target="_blank" ><div class="modal-item-title">' + (site.title ? site.title : site.url) + '</div></a><div data-site="' + selectedSiteName + '" data-item="' + site.id + '" class="modal-item-remove" >' + closeIcon + '</div></div>' : '';
        });
        modal.innerHTML = '';
        modal.innerHTML += '<div class="modal-header"><div class="modal-site-img" style="background:url(' + selectedSites[0].favIcon + ');background-size:cover;" ></div><div class="modal-header-title" >' + selectedSiteName + '</div><div id="open-all-of-this-site" data-site-name="' + selectedSiteName + '" >open all</div></div>';
        modal.innerHTML += '<div class="modal-body">' + tempContent.join("") + '</div>';
        var openAllInSite = document.getElementById('open-all-of-this-site');
        openAllInSite.addEventListener('click', async function () {
            var targetSite = this.getAttribute('data-site-name');
            const currentStore = await window.helpers.getStore();
            var pagesInSite = [];
            if (currentStore.selectedCategory === 'all') {
                pagesInSite = currentStore.similar[targetSite];
            } else {
                pagesInSite = currentStore.group[currentStore.selectedCategory].similar[targetSite];
            }
            openTheseTabs(pagesInSite);
        });
        addListenersToAll();
    }



    //removes a site from group of sites in category-similar tabs
    async function removeThisPageFromSite() {
        var tabId = this.getAttribute("data-item");
        var siteOfPage = this.getAttribute("data-site");
        const lStorage = await window.helpers.getStore();

        var tabsFromSite = [];
        var newList = [];
        if (lStorage.selectedCategory === 'all') {
            tabsFromSite = lStorage.similar[siteOfPage];
            newList = tabsFromSite.filter(function (item) {
                return item.id !== tabId;
            });
            lStorage.similar[siteOfPage] = newList;
        } else {
            tabsFromSite = lStorage.group[lStorage.selectedCategory].similar[siteOfPage];
            newList = tabsFromSite.filter(function (item) {
                return item.id !== tabId;
            });
            lStorage.group[lStorage.selectedCategory].similar[siteOfPage] = newList;
        }

        await window.helpers.setStore(lStorage);

        if (!newList.length) {
            var modal = document.getElementById('dashboard-site-modal'),
                overlay = document.getElementById('dashboard-overlay');
            overlay.classList.remove('show');
            modal.classList.remove('show');
            overlay.removeEventListener('click', function () { });
            await renderTabs();
        } else {
            await similarItemClick(siteOfPage);
        }
    }

    (function () {

        var searchBar = document.getElementById('search-bar');
        searchBar.addEventListener('keyup', async function (e) {
            await renderTabs(e.target.value);
        });

    }());

    $('#target_div').on('click', function (e) {
        if (e.target === this) {
            console.log($(e.target).delegate());
        } else {
            console.log('aaa');
        }
        if ($(e.target).attr('id') === 'target_div') {
            //    / console.log('dasdsad');
            $('.item-selected').removeClass('item-selected');
        }
    });

    function openTheseTabs(tabs) {
        tabs.map(function (tab) {
            chrome.tabs.create({ index: 100, url: tab.url });
        });
    }

    async function removeSite(site) {
        const lStorage = await window.helpers.getStore();
        if (lStorage.selectedCategory === 'all') {
            delete lStorage.similar[site];
        } else {
            delete lStorage.group[lStorage.selectedCategory].similar[site];
        }
        await window.helpers.setStore(lStorage);
    }


    (async function () {
        document.getElementById('take-a-tour').addEventListener('click', function () {
            chrome.tabs.create({ url: 'https://www.youtube.com/watch?v=oStlzQDUigU' });
        });
    }());
    (function () {


        var copyIcon = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 488.3 488.3" style="enable-background:new 0 0 488.3 488.3;" xml:space="preserve"><g><g><path d="M314.25,85.4h-227c-21.3,0-38.6,17.3-38.6,38.6v325.7c0,21.3,17.3,38.6,38.6,38.6h227c21.3,0,38.6-17.3,38.6-38.6V124           C352.75,102.7,335.45,85.4,314.25,85.4z M325.75,449.6c0,6.4-5.2,11.6-11.6,11.6h-227c-6.4,0-11.6-5.2-11.6-11.6V124 c0-6.4,5.2-11.6,11.6-11.6h227c6.4,0,11.6,5.2,11.6,11.6V449.6z"/> <path d="M401.05,0h-227c-21.3,0-38.6,17.3-38.6,38.6c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5c0-6.4,5.2-11.6,11.6-11.6h227     c6.4,0,11.6,5.2,11.6,11.6v325.7c0,6.4-5.2,11.6-11.6,11.6c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5c21.3,0,38.6-17.3,38.6-38.6  V38.6C439.65,17.3,422.35,0,401.05,0z"/></g></g></svg>';

        $('#open-all-tabs').click(async function () {
            var searchString = $('#search-bar').val();
            const store = await window.helpers.getStore();
            var actualCategories = ['similar', 'all'];
            var selectedGroup = store.selectedCategory;
            for (var singleCategory in actualCategories) {
                var siteName = actualCategories[singleCategory];
                if (siteName === 'all') {
                    var tabsFromSite = [];
                    if (selectedGroup === 'all') {
                        tabsFromSite = store.all || [];
                    } else {
                        try {
                            tabsFromSite = store.group[selectedGroup].all;
                        } catch (e) {
                            tabsFromSite = [];
                        }
                    }
                    if (tabsFromSite.length) {
                        for (var count in tabsFromSite) {
                            var tab = tabsFromSite[count];
                            var renderCondition = searchString ? tab.title.toLowerCase().includes(searchString.toLowerCase()) || tab.url.toLowerCase().includes(searchString.toLowerCase()) : true;
                            if (renderCondition) {
                                chrome.tabs.create({ index: 100, url: tab.url });
                            }
                        }
                    }
                } else if (siteName === 'similar') {
                    var sites = {};
                    if (selectedGroup !== 'all') {
                        try {
                            sites = store.group[selectedGroup].similar;
                        } catch (e) {
                            sites = {};
                        }
                    } else {
                        sites = store.similar || {};
                    }
                    var sitesArray = Object.keys(sites);
                    if (sitesArray.length) {
                        for (var count in sitesArray) {
                            var site = sitesArray[count];
                            var renderCondition = searchString ? site.toLowerCase().includes(searchString.toLowerCase()) : true;
                            if (sites[site].length && renderCondition) {
                                openTheseTabs(sites[site]);
                            } else if (!sites[site].length) {
                                await removeSite(site);
                            }
                        }
                    }
                }
            }
        });

        $('.share-history').click(async function () {

            var modal = document.getElementById('dashboard-site-modal'),
                overlay = document.getElementById('dashboard-overlay');
                
            const lStorage = await window.helpers.getStore();
            var links = lStorage.myLinks || [];

            var tempContent = '';
            if (links.length) {
                tempContent = links.map(function (link) {
                    return link ? '<div class="modal-item" ><a href="https://infinite-tabs-manager.herokuapp.com/?secureCode=' + link + '" target="_blank" >https://infinite-tabs-manager.herokuapp.com/?secureCode=' + link + '</a> <span class="your-links-btn" data-url="https://infinite-tabs-manager.herokuapp.com/?secureCode=' + link + '" >' + copyIcon + '</span> </div>' : '';
                });
            } else {
                tempContent = ['<div class="link-empty-notice" >' + chrome.i18n.getMessage('nothing_found_share') + ' </div>']
            }


            modal.innerHTML = '';
            modal.innerHTML += '<div class="modal-header"><div class="modal-header-title" > Your Links </div></div>';
            modal.innerHTML += '<div class="modal-body">' + tempContent.join("") + '</div>';

            modal.classList.add('show');
            overlay.classList.add('show');

            overlay.addEventListener('click', async function () {
                overlay.classList.remove('show');
                modal.classList.remove('show');
                overlay.removeEventListener('click', function () { });
                await renderTabs();
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
        });

        $('#a-sadist').click(async function () {
            const lStorage = await window.helpers.getStore()
            lStorage.rating.dontShow = true;
            $('#rating-notice').removeClass('show');
            await window.helpers.setStore(lStorage);
        });

        $('#rate-later').click(async function () {
            const lStorage = await window.helpers.getStore();
            var d = new Date(),
                today = (d.getFullYear()) + "" + (d.getMonth() + 1) + "" + d.getDate();
            lStorage.rating.rateLater = true;

            lStorage.rating.laterDate = today;


            $('#rating-notice').removeClass('show');
            await window.helpers.setStore(lStorage);
        });

        $('#goto-store').click(async function () {
            const lStorage = await window.helpers.getStore();
            lStorage.rating.dontShow = true;

            $('#rating-notice').removeClass('show');
            await window.helpers.setStore(lStorage);
        });

    }());
    //rating later manager
    !(async function () {

        const lStorage = await window.helpers.getStore();
        var ratingData = lStorage.rating || {};
        
        if (!ratingData.dontShow) {
            if (ratingData.laterDate) {
                var d = new Date(),
                    today = (d.getFullYear()) + "" + (d.getMonth() + 1) + "" + d.getDate(),
                    laterClickedDate = '';

                laterClickedDate = parseInt(ratingData.laterDate);
                if (today > laterClickedDate) {
                    $('#rating-notice').addClass('show');
                }
            } else {
                $('#rating-notice').addClass('show');
            }
        }
    }())

})();