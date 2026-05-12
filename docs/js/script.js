var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}


// Set download URLs for all .tryit-btn elements
(function () {
	var btns = document.getElementsByClassName('tryit-btn');

	if (!!window.chrome && !!window.chrome.runtime) {
		for (var i = 0; i < btns.length; i++) {
			btns[i].href = "https://chrome.google.com/webstore/detail/infinite-tabs-manager/hjpahkeoabpccidknfdepajnfjncjiep";
		}
	} else if (typeof InstallTrigger !== 'undefined') {
		for (var i = 0; i < btns.length; i++) {
			btns[i].href = "https://addons.mozilla.org/en-US/firefox/addon/infinite-tabs-manager/";
		}
	} else {
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener('click', function () {
				alert("Sorry! This extension is not compatible with your browser yet");
				this.target = "";
			});
		}
	}
})();
