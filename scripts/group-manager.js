(function () {

    window.renderGroups = function () {
        var editIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="19" viewBox="0 0 15 19"><path d="M12.4861829,1.42845944 C10.4727946,-0.0882973021 9.03982341,-0.0553004185 8.49554948,0.0359909592 C8.34247244,0.0612885699 8.2138452,0.152579948 8.12348723,0.281267793 L3.21226543,7.29200565 L0.806617183,10.7269812 C0.512156482,11.1471415 0.342070879,11.6464944 0.315495004,12.1645454 L0.000836637727,18.3503612 C-0.0214870977,18.7958191 0.406916015,19.1180887 0.808743253,18.9586038 L6.39605532,16.7478126 C6.86697983,16.5608302 7.27624832,16.2363609 7.57177205,15.8140008 L9.53200863,13.0147651 L14.885453,5.37158703 C14.9800631,5.2362998 15.0183324,5.07131539 14.9917565,4.90633097 C14.9024616,4.32778561 14.4740584,2.92431816 12.4861829,1.42845944 Z M6.38032094,15.1901761 L4.0784949,15.9867139 C3.98835976,16.01801 3.88808442,15.9927712 3.82949658,15.9241216 C3.53317732,15.5859211 3.1805236,15.2507494 2.61830569,14.8842814 C2.05608777,14.5188231 1.59189182,14.3209506 1.14234283,14.1715367 C1.05220769,14.1412501 0.994746545,14.064524 1.00037999,13.9777024 L1.13783607,11.7708184 L1.75638845,11.0086055 C1.75638845,11.0086055 3.14108948,10.837991 4.94829896,12.0161399 C6.75325506,13.1932793 7,14.4269537 7,14.4269537 L6.38032094,15.1901761 Z"/></svg>';
        var optionsIcon = '<svg version="1.1" id="Capa_1" height="20px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 408 408" <g id="more-vert"><path d="M204,102c28.05,0,51-22.95,51-51S232.05,0,204,0s-51,22.95-51,51S175.95,102,204,102z M204,153c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51S232.05,153,204,153z M204,306c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51S232.05,306,204,306z"/></g></svg>';
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

                $('#group-target').append('<div class="group-list-item to-drop group-item-mods ' + selectedStyle + ' " data-id="' + item + '" ><div class="group-name" >' + groups[item].name + '</div><div class="group-options" >' + optionsIcon + '</div> <div class="group-options-dd" style="display:none;" > <div class="group-dd-item rename" data-action="rename" data-id="' + item + '" > R </div><div class="group-dd-item share" data-action="share" data-id="' + item + '" > S </div> <div class="group-dd-item delete" data-action="delete" data-id="' + item + '" > D </div> </div>  </div>');
            });
            setTimeout(function () {

                $('.group-options').on('click', function (e) {
                    e.stopPropagation();
                    var dropdownn = $(this).siblings('.group-options-dd');
                    dropdownn.css({ 'display': 'flex' });
                    dropdownn.off();
                    dropdownn.on('click', function (e) {
                        var dataId = $(e.target).data('id');
                        if ($(e.target).data('action') === 'rename') {
                            $(this).parent().html('<input id="group-name-editor" type="text" value="' + groups[dataId].name + '"  />');
                            setTimeout(function () {
                                $('#group-name-editor').off();
                                $('#group-name-editor').focus();
                                $('#group-name-editor').on('blur', function () {
                                    var dataId = $(this).parent().attr('data-id');
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

                        } else if ($(e.target).data('action') === 'share') {


                            swal({
                                title: "Are you sure?",
                                text: "wanna create a sharable link?",
                                icon: "info",
                                buttons: [
                                    'No, forget it!',
                                    'Yes, go ahead!'
                                ],
                            }).then(function (isConfirm) {
                                if (isConfirm) {
                                    Parse.initialize("myAppIddasdasdasdasd");
                                    Parse.serverURL = "http://tabsmanager.herokuapp.com/parse";
                                    var modal = document.getElementById('dashboard-site-modal');
                                    modal.innerHTML = 'Please Wait..';
                                    modal.classList.add( 'show' );
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
                                            console.log('New object created with hash: ' + gameScore.get('hash'));


                                    var overlay = $('#dashboard-overlay').addClass('show');

                                    var url =gameScore.get('hash');
                                   
                                    

                                    modal.classList.add( 'sharer' );

                                    modal.innerHTML = '';
                                    modal.innerHTML += '<div class="modal-ulla"><div class="modal-site-padam" style="background:url(https://api.qrserver.com/v1/create-qr-code/?data=http%3A%2F%2Fitabsmanager.tk%2F%3FsecureCode%3D'+ url +'&amp;size=150x150&amp);background-size:cover;" ></div><div class="share-modal-details" ><div class="sahre-title" >Untitled</div><div><div class="share-right-item share-desc" >Share this link or scan QR Code to view tabs in mobile</div><div class="share-right-item url" >http://itabsmanager.tk/?secureCode='+ url +' </div></div><div class="share-right-item cpy-btn" ><div class="copy-url-btn"> Copy URL </div><div class="url-gone-notice" >This link expires in 30 Days</div></div></div>';
                                
                                   

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

                        } else if ($(e.target).data('action') === 'delete') {

                            swal({
                                title: "Are you sure?",
                                text: "wanna delete this group?",
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

                                    window.helpers.setStore(lStorage);

                                    window.renderGroups();
                                    window.renderTabs();
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
        }
        window.dnd();
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