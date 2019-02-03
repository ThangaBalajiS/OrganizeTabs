(function () {

    window.renderGroups = function () {
        var editIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="19" viewBox="0 0 15 19"><path d="M12.4861829,1.42845944 C10.4727946,-0.0882973021 9.03982341,-0.0553004185 8.49554948,0.0359909592 C8.34247244,0.0612885699 8.2138452,0.152579948 8.12348723,0.281267793 L3.21226543,7.29200565 L0.806617183,10.7269812 C0.512156482,11.1471415 0.342070879,11.6464944 0.315495004,12.1645454 L0.000836637727,18.3503612 C-0.0214870977,18.7958191 0.406916015,19.1180887 0.808743253,18.9586038 L6.39605532,16.7478126 C6.86697983,16.5608302 7.27624832,16.2363609 7.57177205,15.8140008 L9.53200863,13.0147651 L14.885453,5.37158703 C14.9800631,5.2362998 15.0183324,5.07131539 14.9917565,4.90633097 C14.9024616,4.32778561 14.4740584,2.92431816 12.4861829,1.42845944 Z M6.38032094,15.1901761 L4.0784949,15.9867139 C3.98835976,16.01801 3.88808442,15.9927712 3.82949658,15.9241216 C3.53317732,15.5859211 3.1805236,15.2507494 2.61830569,14.8842814 C2.05608777,14.5188231 1.59189182,14.3209506 1.14234283,14.1715367 C1.05220769,14.1412501 0.994746545,14.064524 1.00037999,13.9777024 L1.13783607,11.7708184 L1.75638845,11.0086055 C1.75638845,11.0086055 3.14108948,10.837991 4.94829896,12.0161399 C6.75325506,13.1932793 7,14.4269537 7,14.4269537 L6.38032094,15.1901761 Z"/></svg>';
        var optionsIcon = '<svg version="1.1" id="Capa_1" height="20px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 408 408" <g id="more-vert"><path d="M204,102c28.05,0,51-22.95,51-51S232.05,0,204,0s-51,22.95-51,51S175.95,102,204,102z M204,153c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51S232.05,153,204,153z M204,306c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51S232.05,306,204,306z"/></g></svg>';
        var shareIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="16" height="17" viewBox="0 0 16 17"><path d="M12.8,10.8181818 C11.92,10.8181818 11.12,11.2045455 10.56,11.7454545 L6.32,9.35 C6.32,9.04090909 6.4,8.80909091 6.4,8.5 C6.4,8.19090909 6.32,7.95909091 6.24,7.65 L10.48,5.25454545 C11.12,5.79545455 11.92,6.18181818 12.8,6.18181818 C14.56,6.18181818 16,4.79090909 16,3.09090909 C16,1.39090909 14.56,0 12.8,0 C11.04,0 9.6,1.39090909 9.6,3.09090909 C9.6,3.4 9.68,3.63181818 9.76,3.94090909 L5.44,6.33636364 C4.88,5.79545455 4.08,5.40909091 3.2,5.40909091 C1.44,5.40909091 0,6.8 0,8.5 C0,10.2 1.44,11.5909091 3.2,11.5909091 C4.08,11.5909091 4.88,11.2045455 5.44,10.6636364 L9.68,13.0590909 C9.68,13.3681818 9.6,13.6 9.6,13.9090909 C9.6,15.6090909 11.04,17 12.8,17 C14.56,17 16,15.6090909 16,13.9090909 C16,12.2090909 14.56,10.8181818 12.8,10.8181818 Z M12.8,1.54545455 C13.68,1.54545455 14.4,2.24090909 14.4,3.09090909 C14.4,3.94090909 13.68,4.63636364 12.8,4.63636364 C11.92,4.63636364 11.2,3.94090909 11.2,3.09090909 C11.2,2.24090909 11.92,1.54545455 12.8,1.54545455 Z M3.2,10.0454545 C2.32,10.0454545 1.6,9.35 1.6,8.5 C1.6,7.65 2.32,6.95454545 3.2,6.95454545 C4.08,6.95454545 4.8,7.65 4.8,8.5 C4.8,9.35 4.08,10.0454545 3.2,10.0454545 Z M12.8,15.4545455 C11.92,15.4545455 11.2,14.7590909 11.2,13.9090909 C11.2,13.6 11.28,13.3681818 11.44,13.1363636 C11.44,13.1363636 11.44,13.1363636 11.44,13.1363636 C11.44,13.1363636 11.44,13.1363636 11.44,13.1363636 C11.68,12.6727273 12.24,12.3636364 12.8,12.3636364 C13.68,12.3636364 14.4,13.0590909 14.4,13.9090909 C14.4,14.7590909 13.68,15.4545455 12.8,15.4545455 Z"/></svg>';
        var deleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="16" height="17" viewBox="0 0 16 17"><path d="M15.2,3.09090909 L12,3.09090909 L12,2.31818182 C12,1.00454545 10.96,0 9.6,0 L6.4,0 C5.04,0 4,1.00454545 4,2.31818182 L4,3.09090909 L0.8,3.09090909 C0.32,3.09090909 0,3.4 0,3.86363636 C0,4.32727273 0.32,4.63636364 0.8,4.63636364 L1.6,4.63636364 L1.6,14.6818182 C1.6,15.9954545 2.64,17 4,17 L12,17 C13.36,17 14.4,15.9954545 14.4,14.6818182 L14.4,4.63636364 L15.2,4.63636364 C15.68,4.63636364 16,4.32727273 16,3.86363636 C16,3.4 15.68,3.09090909 15.2,3.09090909 Z M5.6,2.31818182 C5.6,1.85454545 5.92,1.54545455 6.4,1.54545455 L9.6,1.54545455 C10.08,1.54545455 10.4,1.85454545 10.4,2.31818182 L10.4,3.09090909 L5.6,3.09090909 L5.6,2.31818182 Z M12.8,14.6818182 C12.8,15.1454545 12.48,15.4545455 12,15.4545455 L4,15.4545455 C3.52,15.4545455 3.2,15.1454545 3.2,14.6818182 L3.2,4.63636364 L12.8,4.63636364 L12.8,14.6818182 Z"/></svg>';
        var lStorage = window.helpers.getStore();
        var groups = lStorage.group;
        var groupOrder = lStorage.groupOrder;

        if (groupOrder.length) {
            $('#group-target').html('');
            groupOrder.forEach(function (item) {
                var selectedStyle = '';
                if (item === localStorage.selectedCategory) {
                    selectedStyle = 'selected-group';
                }

                $('#group-target').append('<div class="group-list-item to-drop group-item-mods ' + selectedStyle + ' " data-id="' + item + '" ><div class="group-name" >' + groups[item].name + '</div><div class="group-options" >' + optionsIcon + '</div> <div class="group-options-dd" style="display:none;" > <div class="group-dd-item rename" data-action="rename" data-id="' + item + '" > ' + editIcon + ' </div><div class="group-dd-item share" data-action="share" data-id="' + item + '" > ' + shareIcon + ' </div> <div class="group-dd-item delete" data-action="delete" data-id="' + item + '" > ' + deleteIcon + ' </div> </div>  </div>');
            });
            setTimeout(function () {
                $('.group-options').off();
                $('.group-options').on('click', function (e) {
                    //console.log(e)
                    e.stopPropagation();
                    var dropdownn = $(this).siblings('.group-options-dd');
                    dropdownn.css({ 'display': 'flex' });
                    dropdownn.off();
                    dropdownn.on('click', function (e) {
                        e.stopPropagation();
                        var dataId = $(e.target).closest('.group-dd-item').data('id');
                        if ($(e.target).closest('.group-dd-item').hasClass('rename')) {
                            var _gaq = _gaq || [];
                            _gaq.push(['_trackEvent', 'rename', 'clicked']);
                            $(this).parent().html('<input id="group-name-editor" type="text" value="' + groups[dataId].name + '"  />');
                            setTimeout(function () {
                                $('#group-name-editor').off();
                                $('#group-name-editor').focus();
                                $('#group-name-editor').on('blur', function () {
                                    //var dataId = $(this).parent().attr('data-id');
                                    groups[dataId].name = this.value;
                                    lStorage.group = groups;
                                    window.helpers.setStore(lStorage);
                                    window.renderGroups();
                                });
                                $('#group-name-editor').on('keyup', function (e) {
                                    if (e.keyCode === 13) {
                                        groups[dataId].name = e.target.value;
                                        lStorage.group = groups;
                                        window.helpers.setStore(lStorage);
                                        window.renderGroups();
                                    } else if (e.keyCode === 27) {
                                        window.renderGroups();
                                    }
                                });
                            }, 0);

                        } else if ($(e.target).closest('.group-dd-item').hasClass('share')) {
                            var _gaq = _gaq || [];
                            _gaq.push(['_trackEvent', 'share', 'clicked']);

                            swal({
                                title: "Are you sure?",
                                text: "You want to create a sharable link?",
                                icon: "info",
                                buttons: [
                                    'No, forget it!',
                                    'Yes, go ahead!'
                                ],
                            }).then(function (isConfirm) {
                                if (isConfirm) {
                                    // Parse.initialize("myAppIddasdasdasdasd");
                                    // Parse.serverURL = "http://tabsmanager.herokuapp.com/parse";
                                    var modal = document.getElementById('dashboard-site-modal');
                                    modal.innerHTML = '<img class="loading-icon rotating" src="../assets/loading.svg" />';
                                    modal.classList.add('show');
                                    var GameScore = Parse.Object.extend("TabsData");
                                    var gameScore = new GameScore();
                                    var hash = window.helpers.guid() + window.helpers.guid();

                                    var tempLinks = [];
                                    if (localStorage.myLinks) {
                                        tempLinks = JSON.parse(localStorage.myLinks);
                                    } else {
                                        tempLinks = [];
                                    }

                                    tempLinks.push(hash);

                                    localStorage.myLinks = JSON.stringify(tempLinks);

                                    gameScore.set("hash", hash);
                                    gameScore.set("data", JSON.stringify(groups[dataId]));
                                    gameScore.save()
                                        .then((gameScore) => {
                                            // Execute any logic that should take place after the object is saved.
                                            //console.log('New object created with hash: ' + gameScore.get('hash'));


                                            var overlay = $('#dashboard-overlay').addClass('show');

                                            var url = gameScore.get('hash');



                                            modal.classList.add('sharer');

                                            modal.innerHTML = '';
                                            modal.innerHTML += '<div class="modal-ulla"><div class="modal-site-padam" style="background:url(https://api.qrserver.com/v1/create-qr-code/?data=http%3A%2F%2Fitabsmanager.tk%2F%3FsecureCode%3D' + url + '&amp;size=150x150&amp);background-size:contain;" ></div><div class="share-modal-details" ><div class="sahre-title" >Untitled</div><div><div class="share-right-item share-desc" >Share this link or scan QR Code to view tabs in mobile</div><div class="share-right-item url" > <input type="text" style="width:100%;"  value="http://itabsmanager.tk/?secureCode=' + url + '" id="myInput"> </div></div><div class="share-right-item cpy-btn" ><div class="copy-url-btn"> Copy URL </div><div class="url-gone-notice" >Will be valid till August 13 00:00 GMT</div></div></div>';
                                            setTimeout(function () {
                                                $('.copy-url-btn').off()
                                                $('.copy-url-btn').on('click', function () {
                                                    var copyText = document.getElementById("myInput");

                                                    /* Select the text field */
                                                    copyText.select();

                                                    /* Copy the text inside the text field */
                                                    document.execCommand("copy");

                                                });
                                            }, 0);


                                            overlay.on('click', function () {
                                                overlay.removeClass('show');
                                                modal.classList.remove('show');
                                                overlay.off();
                                            });
                                        }, (error) => {
                                            // Execute any logic that should take place if the save fails.
                                            // error is a Parse.Error with an error code and message.
                                            alert('Failed to create new object, with error code: ' + error.message);
                                        });

                                } else {

                                }
                            });

                        } else if ($(e.target).closest('.group-dd-item').hasClass('delete')) {
                            var _gaq = _gaq || [];
                            _gaq.push(['_trackEvent', 'delete', 'clicked']);
                            swal({
                                title: "Are you sure?",
                                text: "You want to delete this group?",
                                icon: "warning",
                                buttons: [
                                    'No, never mind!',
                                    'Yes, go ahead!'
                                ],
                                dangerMode: true,
                            }).then(function (isConfirm) {
                                if (isConfirm) {

                                    delete lStorage.group[dataId];
                                    lStorage.groupOrder = lStorage.groupOrder.filter(function (item) {
                                        return item !== dataId;
                                    });

                                    if (localStorage.selectedCategory === dataId) {
                                        localStorage.selectedCategory = 'all';
                                    }

                                    //console.log('herre')
                                    window.helpers.setStore(lStorage);
                                    setTimeout(function () {
                                        window.renderGroups();
                                        window.renderTabs();
                                    }, 0);

                                } else {

                                }
                            });
                        }
                    });

                });

                (function () {
                    $('.group-item-mods').off();
                    $('.group-item-mods').on('click', function (e) {
                        if (!$(e.target).hasClass('group-dd-item') && e.target.id !== 'group-name-editor') {
                            localStorage.selectedCategory = $(this).attr('data-id');
                            window.renderGroups();
                            window.renderTabs();
                        }

                    })
                }());

            }, 0);
        } else {
            $( '#group-target' ).html('');
        }
        window.dnd();
        if( localStorage.selectedCategory === 'all' ){
            $('.group-uncategoriezed').css('font-weight','600');
        } else {
            $('.group-uncategoriezed').css('font-weight','400')

        }
        
    }
    window.renderGroups();
    $('.add-group-btn').on('click', function () {

        var group = localStorage.getItem('group') || '{}';
        var groupOrder = localStorage.getItem('groupOrder');
        if (!groupOrder) {
            groupOrder = [];
        } else {
            groupOrder = JSON.parse(groupOrder);
        }
        var tempData = {};
        if (group) {
            tempData = JSON.parse(group);
        }
        var tempId = window.helpers.guid();
        groupOrder.push(tempId);
        tempData[tempId] = { name: 'Untitled', all: [], similar: {} };
        localStorage.setItem('group', JSON.stringify(tempData));
        localStorage.setItem('groupOrder', JSON.stringify(groupOrder));
        window.renderGroups();
    });

}());