
!(function(){
    $('.localize').each(function(index,item){
        var localizeKey = $(item).data( 'localize' );
        $(item).html(chrome.i18n.getMessage(localizeKey));
    });
})();