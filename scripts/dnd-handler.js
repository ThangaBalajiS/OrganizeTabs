window.dnd = function () {
    setTimeout(function () {
        $('.to-drag').draggable({
            delay: 100,
            drag: function (e, i) {

                var selectedItems = $('.item-selected');
                var draggerId = $(e.target).find('.item-card-wrap').attr('data-id') || $(e.target).find('.site-card').attr('data-site');
                selectedItems.each(function (index, el) {
                    var curSelectedId = $(el).find('.item-card-wrap').attr('data-id') || $(el).find('.site-card').attr('data-site');
                    if (draggerId !== curSelectedId) {
                        $(el).offset($(e.target).offset());
                        if (!$(el).hasClass('no-transition')) {

                            $(el).addClass('its-dragging');
                            setTimeout(function () {
                                $(el).addClass('no-transition');
                            }, 200);
                        }
                    }
                });
            },
            stop: function (e, i) {
                $('.no-transition').each(function (i, e) {
                    $(this).removeClass('no-transition');
                    $(this).removeClass('its-dragging');
                });

                if ($('.drop-ok').length) {
                    $('.drop-ok').removeClass('drop-ok');
                } else {
                    $(this).css(i.originalPosition);
                    $('.item-selected').css(i.originalPosition);
                }
            }
        });

        $('.to-drop').droppable({
            accept: '.to-drag',
            tolerance: 'pointer',
            drop: function (e, i) {
                $(this).addClass('drop-ok');
                var selectedItems = $('.item-selected');
                var lStorage = window.helpers.getStore();
                var selectedCategory = localStorage.selectedCategory;
                var dropTarget = $(e.target).attr('data-id');
                
                if (!selectedItems.length) {
                    selectedItems = i.draggable;
                }

                selectedItems.each(function (index, el) {
                    var jEl = $(el);
                    if (jEl.hasClass('item-card-wrap-outer')) {
                        jEl = jEl.find('.item-card-wrap');
                        var newItem = {
                            id: jEl.attr('data-id'),
                            title: jEl.attr('data-title'),
                            favIcon: jEl.attr('data-favicon'),
                            url: jEl.attr('data-url')
                        };
                        
                        if (selectedCategory === 'all') {
                            var allArray = lStorage.all;
                            lStorage.all = window.helpers.removeFromArray(allArray, newItem.id);
                        } else {
                            var allArray = lStorage.group[selectedCategory].all;
                            lStorage.group[selectedCategory].all = window.helpers.removeFromArray(allArray, newItem.id);
                        }
                        lStorage.group[dropTarget].all.push(newItem);
                    } else if (jEl.hasClass('site-card-wrap')) {

                        jEl = jEl.find('.site-card');
                        var itemId = jEl.attr('data-site');
                        var parsedStore = {};
                        if (selectedCategory === 'all') {
                            parsedStore = $.extend({}, lStorage.similar);
                            delete lStorage.similar[itemId];

                        } else {
                            parsedStore = $.extend({}, lStorage.group[selectedCategory].similar);
                            delete lStorage.group[selectedCategory].similar[itemId];
                        }
                        var newItem = { [itemId]: parsedStore[itemId] };
                        var tempSimilarObj = lStorage.group[dropTarget].similar;
                        var valToStore = newItem;
                        if (tempSimilarObj.hasOwnProperty(itemId)) {
                            valToStore = { [itemId]: tempSimilarObj[itemId].concat(parsedStore[itemId]) };
                        }
                        lStorage.group[dropTarget].similar = $.extend({}, lStorage.group[dropTarget].similar, valToStore);
                    }

                    jEl.css('transform', 'scale(0)');
                });

                window.helpers.setStore(lStorage);
                setTimeout(function () {
                    localStorage.selectedCategory = dropTarget;
                    window.renderTabs();
                    window.renderGroups();
                }, 300);
            }
        });

        $('#group-target').sortable({
            stop: function () {
                var groupOrderArray = [];
                $('#group-target').children().each(function (i, e) {
                    groupOrderArray.push($(e).attr('data-id'));
                });
                localStorage.setItem('groupOrder', JSON.stringify(groupOrderArray));
            },
            delay: 100
        });

        $('.dropper-item').off();
        $('.dropper-item').on('click', function (e) {
            e.stopPropagation();
            var selectedItems = $('.item-selected');
            var lStorage = window.helpers.getStore();
            var selectedCategory = localStorage.selectedCategory;

            if ($(this).hasClass('delete')) {
                if (selectedItems.length) {
                    swal({
                        title: "Are you sure?",
                        text: "This cannot be undone!",
                        type : 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, go ahead!',
                        cancelButtonText: 'No, forget it!',
                        dangerMode: true,
                    }).then(function (result) {
                        if (result.value) {
                            selectedItems.each(function (index, el) {
                                var jEl = $(el);
                                if (jEl.hasClass('item-card-wrap-outer')) {
                                    jEl = jEl.find('.item-card-wrap');
                                    var itemId = jEl.attr('data-id');

                                    if (selectedCategory === 'all') {
                                        var allArray = lStorage.all;
                                        lStorage.all = window.helpers.removeFromArray(allArray, itemId);
                                    } else {
                                        var allArray = lStorage.group[selectedCategory].all;
                                        lStorage.group[selectedCategory].all = window.helpers.removeFromArray(allArray, itemId);
                                    }

                                } else if (jEl.hasClass('site-card-wrap')) {
                                    jEl = jEl.find('.site-card');
                                    var itemId = jEl.attr('data-site');

                                    if (selectedCategory === 'all') {
                                        delete lStorage.similar[itemId];

                                    } else {
                                        delete lStorage.group[selectedCategory].similar[itemId];
                                    }
                                }
                                jEl.css('transform', 'scale(0)');
                            });

                            window.helpers.setStore(lStorage);
                            setTimeout(function () {
                                window.renderTabs();
                            }, 300);
                        } else {
                            // swal("Cancelled", "Your tabs are now safe :)", "info");
                            window.renderTabs();
                        }
                    })

                } else {
                    swal('Please select tabs to delete', 'Hold CMD/CTRL and click an item to select', 'info');
                }


            } else if ($(this).hasClass('share')) {
                if (selectedItems.length) {

                    swal({
                        title: "Are you sure?",
                        text: "You want to create a sharable link?",
                        type : 'info',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, go ahead!',
                        cancelButtonText: 'No, forget it!',
                    }).then(function (result) {
                        if (result.value)  {
                            // Parse.initialize("myAppIddasdasdasdasd");
                            // Parse.serverURL = "http://tabsmanager.herokuapp.com/parse";
                            var tempValue = { all: [], similar: {} };
                            var modal = document.getElementById('dashboard-site-modal');
                            modal.innerHTML = '<img class="loading-icon rotating" src="../assets/loading.svg" />';
                            modal.classList.add('show');

                            selectedItems.each(function (index, el) {
                                var jEl = $(el);

                                if (jEl.hasClass('item-card-wrap-outer')) {
                                    jEl = jEl.find('.item-card-wrap');
                                    var newItem = {
                                        id: jEl.attr('data-id'),
                                        title: jEl.attr('data-title'),
                                        favIcon: jEl.attr('data-favicon'),
                                        url: jEl.attr('data-url')
                                    };

                                    tempValue.all.push(newItem);

                                } else if (jEl.hasClass('site-card-wrap')) {
                                    jEl = jEl.find('.site-card');
                                    var itemId = jEl.attr('data-site');

                                    if (selectedCategory === 'all') {

                                        tempValue.similar = $.extend({}, tempValue.similar, { [itemId]: lStorage.similar[itemId] });
                                    } else {
                                        tempValue.similar = $.extend({}, tempValue.similar, { [itemId]: lStorage.group[selectedCategory].similar[itemId] });
                                    }
                                }
                                jEl.css('transform', 'scale(0)');
                                window.renderTabs();
                                //console.log(tempValue);

                            });



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
                            gameScore.set("data", JSON.stringify(tempValue));
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
                            window.renderTabs();
                        }
                    });
                } else {
                    swal('Please select tabs to share', 'Hold CMD/CTRL and click an item to select', 'info');
                }
            } else if ($(this).hasClass('add')) {
                if (selectedItems.length) {

                    // swal({
                    //     title: "Are you sure?",
                    //     text: "wanna create a new group with the selected tabs?",
                    //     icon: "info",
                    //     buttons: [
                    //         'No, forget it!',
                    //         'Yeah, go ahead!'
                    //     ],
                    // }).then(function (isConfirm) {
                    //     if (isConfirm) {

                            var tempValue = { name: 'Untitled', all: [], similar: {} };

                            selectedItems.each(function (index, el) {
                                var jEl = $(el);

                                if (jEl.hasClass('item-card-wrap-outer')) {
                                    jEl = jEl.find('.item-card-wrap');
                                    var newItem = {
                                        id: jEl.attr('data-id'),
                                        title: jEl.attr('data-title'),
                                        favIcon: jEl.attr('data-favicon'),
                                        url: jEl.attr('data-url')
                                    };

                                    tempValue.all.push(newItem);
                                    if (selectedCategory === 'all') {
                                        var allArray = lStorage.all;
                                        lStorage.all = window.helpers.removeFromArray(allArray, newItem.id);
                                    } else {
                                        var allArray = lStorage.group[selectedCategory].all;
                                        lStorage.group[selectedCategory].all = window.helpers.removeFromArray(allArray, newItem.id);
                                    }

                                } else if (jEl.hasClass('site-card-wrap')) {
                                    jEl = jEl.find('.site-card');
                                    var itemId = jEl.attr('data-site');

                                    if (selectedCategory === 'all') {

                                        tempValue.similar = $.extend({}, tempValue.similar, { [itemId]: lStorage.similar[itemId] });
                                        delete lStorage.similar[itemId];
                                    } else {
                                        tempValue.similar = $.extend({}, tempValue.similar, { [itemId]: lStorage.group[selectedCategory].similar[itemId] });
                                        delete lStorage.group[selectedCategory].similar[itemId];
                                    }
                                }
                                jEl.css('transform', 'scale(0)');


                            });

                            var newGroupId = window.helpers.guid();
                            lStorage.group = $.extend({}, lStorage.group, { [newGroupId]: tempValue });
                            lStorage.groupOrder.unshift(newGroupId);
                            window.helpers.setStore(lStorage);
                            setTimeout(function () {
                                window.renderTabs();
                                window.renderGroups();
                            }, 300);
                    //     } else {
                    //         window.renderTabs();
                    //     }
                    // });
                } else {
                    var lStorage = window.helpers.getStore();
                    var newGroupId = window.helpers.guid();

                    lStorage.group = $.extend({}, lStorage.group, { [newGroupId]: { name: window.helpers.getCurrentDate(), all: [], similar: {} } });
                    lStorage.groupOrder.unshift(newGroupId);
                    window.helpers.setStore(lStorage);
                    window.renderGroups();
                    window.renderTabs();
                }
            }
        });
    }, 0);


};