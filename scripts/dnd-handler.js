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

                } else if ($(e.target).hasClass('share')) {
                    Parse.initialize("myAppIddasdasdasdasd");
                    Parse.serverURL = "http://tabsmanager.herokuapp.com/parse";
                    var tempValue = { all: [], similar: {} };

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

                    });
                    console.log(tempValue);

                    window.renderTabs();
                    var GameScore = Parse.Object.extend("TabsData");
                    var gameScore = new GameScore();
                    var hash = window.helpers.guid() + window.helpers.guid(); 

                    var tempLinks = [];
                    if( localStorage.myLinks ){
                        tempLinks = JSON.parse(localStorage.myLinks);
                    }else{
                        tempLinks = [];
                    }

                    tempLinks.push( hash );

                    localStorage.myLinks = JSON.stringify(tempLinks);

                    gameScore.set("hash", hash);
                    gameScore.set("data", JSON.stringify( tempValue ));
                    gameScore.save()
                        .then((gameScore) => {
                            // Execute any logic that should take place after the object is saved.
                            console.log('New object created with hash: ' + gameScore.get('hash'));
                        }, (error) => {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            alert('Failed to create new object, with error code: ' + error.message);
                        });

                } else if ($(e.target).hasClass('add')) {

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
                                lStorage.all = window.helpers.removeFromArray(allArray, itemId);
                            } else {
                                var allArray = lStorage.group[selectedCategory].all;
                                lStorage.group[selectedCategory].all = window.helpers.removeFromArray(allArray, itemId);
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
                }

            },
            over: function () {
                $('.to-drop').droppable();
                $('.to-drop').droppable('disable');
            },
            out: function () {
                $('.to-drop').droppable();
                $('.to-drop').droppable('enable');
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
            drop: function () {
                console.log('sds');
                $('.to-drop').droppable();
                setTimeout(function () {
                    $('.to-drop').droppable('enable');
                }, 210);
            }
        });
    }, 0);


};