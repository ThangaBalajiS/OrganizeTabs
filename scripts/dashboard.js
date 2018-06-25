(function () {
    var url = new URL(window.location.href);
    var div_target = document.getElementById('target_div');

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
                        tempDOMString += '<div class="item-card-wrap" ><div class="item-card" > <div data-tab-id="' + tab.id + '" class="icon-card-close" >x</div><a target="_blank" href="' + tab.url + '"> <div class="item-card-image" style="background:url('+tab.favIcon+');background-size:cover;" ></div></a></div><div class="item-card-title">' + tab.title + '</div></div>'
                    }
                    div_target.innerHTML += '<div class="all-content-wrap" >'+tempDOMString+'</div>';
                } else {
                    div_target.innerHTML = '<div class="no-card-found" > Nothing Found </div>'
                }
            } else if (siteName === 'similar') {
                var sites = JSON.parse(localStorage[siteName]);
                var sitesArray = Object.keys(sites);
                div_target.innerHTML = '';
                for (var count in sitesArray) {
                    var site = sitesArray[count];
                    if( sites[site].length ){
                    div_target.innerHTML += '<div class="site-card-wrap" ><div data-site="' + site + '" class="site-card" > <div class="site-card-img-wrap" ><img src="' + sites[site][0].favIcon + '" /></div> <div class="site-card-item-count" >' + sites[site].length + '</div> </div></div>';
                    }else{
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
            var categories = document.getElementsByClassName('categories-item');
            
            for (var count = 0; count < categories.length; count++) {
                categories[count].addEventListener('click', function () {
                    localStorage.setItem('selectedCategory', this.getAttribute('data-category'));
                    renderTabs();
                });
                if( categories[count].getAttribute('data-category') === localStorage.selectedCategory ){
                    categories[count].style.background = '#EFF7FF';
                }else{
                    categories[count].style.background = 'unset';
                }
            }

            var sites = document.getElementsByClassName('site-card');
            for (var j = 0; j < sites.length; j++) {
                sites[j].addEventListener('click', similarItemClick);
            }

            var pagesInModal = document.getElementsByClassName('modal-item-remove');
            console.log(pagesInModal);
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
            return '<div class="modal-item" ><div class="modal-item-title">' + site.title + '</div><div data-site="' + selectedSiteName + '" data-item="' + site.id + '" class="modal-item-remove" >x</div></div>'
        });
        modal.innerHTML = '';
        modal.innerHTML += '<div class="modal-header"><div class="modal-site-img" style="background:url('+selectedSites[0].favIcon+');background-size:cover;" ></div><div class="modal-header-title" >'+selectedSiteName+'</div></div>';
        modal.innerHTML += '<div class="modal-body">' + tempContent.join("") + '</div>';
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


}());

function extend() {
    for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
            if (arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

(function(){
    var s = document.getElementsByTagName('input'),
    f  = document.getElementsByTagName('form'),
    a = document.getElementsByClassName('after');

    s[0].addEventListener('focus',function(){
  if( f[0].classList.contains('open') ) return;
  f[0].classList.add('in');
  setTimeout(function(){
    f[0].classList.add('open'); 
    f[0].classList.remove('in');
  }, 1300);
});

a[0].addEventListener('click', function(e){
  e.preventDefault(); 
  console.log(f[0].classList,1);
  if( !f[0].classList.contains('open') ) return;
   s[0].value = '';
  f[0].classList.add('close');
  f[0].classList.remove('open');
  setTimeout(function(){
    f[0].classList.remove('close');
  }, 1300);
})

}());