let changeColor = document.getElementById('changeColor');

changeColor.onclick = function(element) {

    chrome.tabs.getAllInWindow(null,function(tabs){
        console.log(tabs);
        for( tab in tabs  ){
            console.log(tabs[tab]);
        }
    });

  };