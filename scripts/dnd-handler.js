 window.dnd = function(){
setTimeout(function(){
    $( '.to-drag' ).draggable({
        delay:100,
        drag:function(e,i){
            
            var selectedItems = $( '.item-selected' );
            var draggerId = $(e.target).find('.icon-card-close').attr( 'data-tab-id' );
            selectedItems.each(function(index,el){
                var curSelectedId = $(el).find('.icon-card-close').attr( 'data-tab-id' );
                if( draggerId !== curSelectedId ){
                    $( el ).offset( $(e.target).offset() );
                    if( !$(el).hasClass( 'no-transition' ) ){
                    setTimeout( function(){
                        
                            $( el ).addClass( 'no-transition' );
                        
                   },200 );
                }
                }
            });

        },
        stop: function(e,i){
            $( '.no-transition' ).each(function(i,e){
                $(this).removeClass( 'no-transition' );
            })

         if($( '.drop-ok' ).length){
             $( '.drop-ok' ).removeClass( 'drop-ok' );

         }else{
             $(this).css( i.originalPosition );
             $( '.item-selected' ).css( i.originalPosition);
         }
        }
    });
 
    $( '.to-drop' ).droppable({
        accept : '.to-drag',
        drop: function(){
         $(this).addClass( 'drop-ok' );
        }
    });

    $( '#group-target' ).sortable({
        stop: function(){
            var groupOrderArray = [];
            $( '#group-target' ).children().each(function(i,e) {
                groupOrderArray.push(  $(e).attr( 'data-id' ) );  
            });
            localStorage.setItem( 'groupOrder',  JSON.stringify(groupOrderArray) );
        }
    });
},0);


};