(async function () {
    var extBaseUrl = 'chrome-extension://' + chrome.runtime.id + '/';
    var reDirUrl = 'templates/dashboard.html';
    var siteExists = { flag: false, id: 0 };

    await window.helpers.initStore();
    const lStorage = await window.helpers.getStore();

    const theme = lStorage.theme || (lStorage.darkMode ? 'dark' : 'light');

    function setTheme(newTheme) {
        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }

        if (newTheme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(systemPrefersDark.matches);
            
            systemPrefersDark.addEventListener('change', (e) => {
                applyTheme(e.matches);
            }, { once: true }); // Popup is short-lived, so once is fine or just let it be
        } else {
            applyTheme(newTheme === 'dark');
        }
    }

    setTheme(theme);

    // Function to render the domain list
    function renderDomainList() {
        chrome.tabs.query({ currentWindow: true }, function (tabs) {
            var itemArray = [];
            var domainList = document.getElementById('domain-list');
            domainList.innerHTML = '';
            for (var i = 0; i < tabs.length; i++) {
                var tab = tabs[i];
                var tabDomain = getDomainFromUrl(tab.url);
                if (!tabDomain) continue;
                
                tabDomain = tabDomain.replace("www.", '');
                var tabUrl = tab.url;
                var tabTitle = tab.title;
                var tabFavIconUrl = tab.favIconUrl;

                if (itemArray.indexOf(tabDomain) === -1) {
                    domainList.innerHTML += '<div data-title="' + tabTitle + '" data-favicon="' + tabFavIconUrl + '" data-url="' + tabUrl + '" data-domain="' + tabDomain + '" class="site-list-item">' + tabDomain + '</div>';
                    itemArray.push(tabDomain);
                }
            }
        });
    }

    renderDomainList();

    // Use event delegation for click handlers
    document.body.addEventListener('click', async function (e) {
        var item = e.target.closest('.site-list-item');
        if (item) {
            var siteName = item.getAttribute('data-domain');
            const store = await window.helpers.getStore();
            
            chrome.tabs.query({ currentWindow: true }, async function (tabs) {
                var tabsListForLocalStorage = [];
                for (var i = 0; i < tabs.length; i++) {
                    var tab = tabs[i];
                    var domain = getDomainFromUrl(tab.url);
                    domain = domain.replace("www.", '');
                    var condition = false;
                    
                    if (siteName === 'all') {
                        condition = true;
                    } else if (siteName === 'selected') {
                        condition = tab.highlighted;
                    } else {
                        condition = (domain === siteName);
                    }

                    if (domain && condition && (tab.audible || tab.pinned) !== true) {
                        var tempTabDetailObject = {
                            id: guid(),
                            originId: tab.id,
                            title: tab.title,
                            url: tab.url,
                            favIcon: tab.favIconUrl || '../assets/null-icon.png',
                        };
                        tabsListForLocalStorage.push(tempTabDetailObject);
                    } else {
                        if (tab.url === extBaseUrl + reDirUrl) {
                            siteExists = { flag: true, id: tab.id };
                        }
                    }
                }

                if (siteName === 'selected') {
                    siteName = 'all';
                }

                if (siteName === 'all') {
                    if (tabsListForLocalStorage.length) {
                        store.all = (store.all || []).concat(tabsListForLocalStorage);
                    }
                } else {
                    // Site-wise collapse
                    if (tabsListForLocalStorage.length) {
                        if (!store.similar) store.similar = {};
                        var tempVals = store.similar[siteName] || [];
                        store.similar[siteName] = tempVals.concat(tabsListForLocalStorage);
                    }
                    item.remove();
                }

                store.selectedCategory = 'all';
                await window.helpers.setStore(store);

                if (siteExists.flag) {
                    chrome.tabs.reload(siteExists.id);
                } else {
                    chrome.tabs.create({ index: 0, url: reDirUrl });
                }

                tabsListForLocalStorage.map(function (tabb) {
                    chrome.tabs.remove(tabb.originId);
                });
            });
        }

        if (e.target.id === 'open-dashboard') {
            chrome.tabs.query({ currentWindow: true }, function (tabs) {
                var hasDashboardOpened = false;
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].url === extBaseUrl + reDirUrl) {
                        hasDashboardOpened = true;
                        chrome.tabs.update(tabs[i].id, { active: true });
                        break;
                    }
                }
                if (!hasDashboardOpened) {
                    chrome.tabs.create({ index: 0, url: reDirUrl });
                }
            });
        }
    });


    function getDomainFromUrl(url) {
        if (!url) return '';
        var splitedUrl = url.split('/');
        if (splitedUrl[0] !== 'chrome-extension:' && splitedUrl[0] !== 'chrome:') {
            return splitedUrl[2] || '';
        } else {
            return '';
        }
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4();
    }
})();