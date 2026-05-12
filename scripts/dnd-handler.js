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
            drop: async function (e, i) {
                //console.log('here');
                $(this).addClass('drop-ok');
                var selectedItems = $('.item-selected');
                const lStorage = await window.helpers.getStore();
                var selectedCategory = lStorage.selectedCategory;
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

                await window.helpers.setStore(lStorage);
                setTimeout(async function () {
                    await window.helpers.setStore({selectedCategory: dropTarget});
                    await window.renderTabs();
                    await window.renderGroups();
                }, 300);
            }
        });

        $('#group-target').sortable({
            stop: async function () {
                var groupOrderArray = [];
                $('#group-target').children().each(function (i, e) {
                    groupOrderArray.push($(e).attr('data-id'));
                });
                await window.helpers.setStore({groupOrder: groupOrderArray});
            },
            delay: 100
        });

        $('.dropper-item').off();
        $('.dropper-item').on('click', async function (e) {
            e.stopPropagation();
            var selectedItems = $('.item-selected');
            const lStorage = await window.helpers.getStore();
            var selectedCategory = lStorage.selectedCategory;

            if ($(this).hasClass('delete')) {
                var _gaq = _gaq || [];
                _gaq.push(['_trackEvent', 'delete', 'clicked']);
                if (selectedItems.length) {
                    swal({
                        title: chrome.i18n.getMessage('are_you_sure'),
                        text: "This cannot be undone!",
                        icon: "warning",
                        buttons: [
                            chrome.i18n.getMessage('no'),
                            chrome.i18n.getMessage('yes')
                        ],
                        dangerMode: true,
                    }).then(async function (isConfirm) {
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

                            await window.helpers.setStore(lStorage);
                            setTimeout(async function () {
                                await window.renderTabs();
                            }, 300);
                        } else {
                            // swal("Cancelled", "Your tabs are now safe :)", "info");
                            await window.renderTabs();
                        }
                    })

                } else {
                    swal(chrome.i18n.getMessage('plz_select_to_delete'), chrome.i18n.getMessage('how_to_select_text'), 'info');
                }


            } else if ($(this).hasClass('share')) {
                var _gaq = _gaq || [];
                _gaq.push(['_trackEvent', 'share', 'clicked']);
                
                var modal = document.getElementById('dashboard-site-modal');
                var overlay = document.getElementById('dashboard-overlay');
                
                modal.innerHTML = '<div style="padding: 50px; text-align: center; font-size: 18px; line-height: 1.6;">This one is currently broken. <br> <a href="https://twitter.com/itabsmanager" target="_blank" style="color: #3b99fc; font-weight: 600; text-decoration: underline;">Please click here to request the developer to enable it.</a></div>';
                modal.classList.add('show');
                overlay.classList.add('show');

                $(overlay).on('click', function () {
                    $(overlay).removeClass('show');
                    $(modal).removeClass('show');
                    $(overlay).off('click');
                });
            } else if ($(this).hasClass('add')) {
                var _gaq = _gaq || [];
                _gaq.push(['_trackEvent', 'add', 'clicked']);
                if (selectedItems.length) {
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
                            await window.helpers.setStore(lStorage);
                            setTimeout(async function () {
                                await window.renderTabs();
                                await window.renderGroups();
                            }, 300);
                } else {
                    var newGroupId = window.helpers.guid();

                    lStorage.group = $.extend({}, lStorage.group, { [newGroupId]: { name: window.helpers.getCurrentDate(), all: [], similar: {} } });
                    lStorage.groupOrder.unshift(newGroupId);
                    await window.helpers.setStore(lStorage);
                    await window.renderGroups();
                    await window.renderTabs();
                }
            }
        });
    }, 0);


};