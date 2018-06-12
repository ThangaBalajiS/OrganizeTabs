chrome.tabs.getAllInWindow(null,function(tabs){
    var itemArray = [];
    for( tab in tabs ){
        var temp = getDomainFromUrl(tabs[tab].url); 
        if( itemArray.indexOf( temp ) === -1 ){
            document.getElementById('popup-space').innerHTML += '<div data-domain="'+temp+'" class="site-list-item">'+temp+'</div>'; 
            itemArray.push(temp);
        }
    }
});

var items = document.getElementsByClassName('site-list-item');

console.log(items)
for(var i = 0; i < items.length; i++) {

    console.log(items[i]);
    // items[i].addEventListener('click', function(){
    //     console.log("items[i].getAttribute('data-domain')");
    // }, false);
}

function getDomainFromUrl(url){

    return url.split('/')[2] || '';
    

}