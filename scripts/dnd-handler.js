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
                console.log('here');
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
                        lStorage.group[dropTarget].all.push(newItem);
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
                    window.renderTabs();
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
            }
        });

        $('.tab-actions').droppable({
            tolerance: 'pointer',
            accept: '.to-drag',
            drop: function (e, i) {
                console.log( 'gsgd' );
                $(e.target).addClass('drop-ok');
                $('.to-drop').droppable();
                setTimeout(function () {
                    $('.to-drop').droppable('enable');
                }, 210);

                var selectedItems = $('.item-selected');
                var lStorage = window.helpers.getStore();
                var selectedCategory = localStorage.selectedCategory;

                if (!selectedItems.length) {
                    selectedItems = i.draggable;
                }

                if ($(e.target).hasClass('delete')) {


                    swal({
                        title: "Are you sure?",
                        text: "This cannot be undone!",
                        icon: "warning",
                        buttons: [
                            'No, cancel it!',
                            'Yes, I am sure!'
                        ],
                        dangerMode: true,
                    }).then(function (isConfirm) {
                        if (isConfirm) {
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




                } else if ($(e.target).hasClass('share')) {


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
                            var tempValue = { all: [], similar: {} };
                            var modal = document.getElementById('dashboard-site-modal');
                            modal.innerHTML = 'Please Wait..';
                            modal.classList.add( 'show' );

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
                                console.log(tempValue);

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
                            window.renderTabs();
                        }
                    });
                    
                } else if ($(e.target).hasClass('add')) {


                    swal({
                        title: "Are you sure?",
                        text: "wanna create a new group with the selected tabs?",
                        icon: "info",
                        buttons: [
                            'No, forget it!',
                            'Yeah, go ahead!'
                        ],
                        dangerMode: true,
                    }).then(function (isConfirm) {
                        if (isConfirm) {

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
                        } else {
                            window.renderTabs();
                        }
                    });
                }

            },
            over: function (e, i) {
                $('.to-drop').droppable();
                $('.to-drop').droppable('disable');
                var selectedItems = $('.item-selected');
                if (!selectedItems.length) {
                    selectedItems = i.draggable;
                }
                selectedItems.css({
                    'transform': 'scale(0.5)',
                    'transition': 'all 200ms ease'
                });

            },
            out: function (e, i) {
                var selectedItems = $('.item-selected');
                if (!selectedItems.length) {
                    selectedItems = i.draggable;
                }
                $('.to-drop').droppable();
                $('.to-drop').droppable('enable');
                selectedItems.css({ 'transform': 'scale(1)' });
                setTimeout(function () {
                    selectedItems.css({ 'transition': '' });
                }, 200);
            },

        });

        //added a underlay beneath actions to avoid items to fall on overflowing groups
        $('.dropper-things').droppable({
            tolerance: 'pointer',
            over: function () {
                $('.to-drop').droppable();
                $('.to-drop').droppable('disable');
            },
            out: function () {
                $('.to-drop').droppable();
                $('.to-drop').droppable('enable');
            },
            drop: function (e, i) {

                if( $( '.ui-droppable-hover' ).length ){
                    $( '.ui-droppable-hover' ).removeClass( 'ui-droppable-hover' );
                }
                var selectedItems = $('.item-selected');

                if (!selectedItems.length) {
                    selectedItems = i.draggable;
                }

                selectedItems.css('transform', 'scale(1)');

                $('.to-drop').droppable();
                setTimeout(function () {
                    $('.to-drop').droppable('enable');
                }, 210);
            }
        });
    }, 0);


};