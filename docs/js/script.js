if( !!window.chrome && !!window.chrome.webstore ){

	document.getElementsByClassName( 'download-btn' )[0].href = "https://chrome.google.com/webstore/detail/infinite-tabs-manager/hjpahkeoabpccidknfdepajnfjncjiep"
	document.getElementsByClassName( 'download-btn' )[1].href = "https://chrome.google.com/webstore/detail/infinite-tabs-manager/hjpahkeoabpccidknfdepajnfjncjiep"



}else if ( typeof InstallTrigger !== 'undefined' ){

	document.getElementsByClassName( 'download-btn' )[0].href = "https://addons.mozilla.org/en-US/firefox/addon/infinite-tabs-manager/"
	document.getElementsByClassName( 'download-btn' )[1].href = "https://addons.mozilla.org/en-US/firefox/addon/infinite-tabs-manager/"

}else{

	document.getElementsByClassName( 'download-btn' )[0].addEventListener('click',function(){
		alert( "Sorry! This extension is not compatible with your browser yet" );
		this.target = "";
	});	document.getElementsByClassName( 'download-btn' )[1].addEventListener('click',function(){
		alert( "Sorry! This extension is not compatible with your browser yet" );
		this.target = "";
	});
}