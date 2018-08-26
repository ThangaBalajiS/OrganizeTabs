(function(){


    function renderGroups(){

        var groups = localStorage.group;
        var groupOrder = localStorage.getItem( 'groupOrder' );
        if( !groupOrder ){
            groupOrder = [];
        }else{
            groupOrder = JSON.parse( groupOrder );
        }
        if( groupOrder.length ){
            $( '#group-target' ).html('');
            groups = JSON.parse(groups);
            groupOrder.forEach(function(item){
                $( '#group-target' ).append( '<div class="group-list-item to-drop " data-id="'+item+'" >'+groups[item].name+'<span class="group-name-edit" >V</span></div>' );
            });
            setTimeout(function(){
                $( '.group-name-edit' ).on('click',function(){
                    var tempId = $( this ).parent().attr( 'data-id' );
                    $(this).parent().html( '<input id="group-name-editor" type="text" value="'+groups[tempId].name+'"  />' );

                    setTimeout(function(){
                        $( '#group-name-editor' ).on( 'blur', function(){
                            renderGroups();
                        } );
                        $( '#group-name-editor' ).on( 'keyup', function(e){
                            var tempId1 = $( this ).parent().attr( 'data-id' );
                            if( e.keyCode === 13 ){
                                groups[tempId1].name = e.target.value; 
                                groups = JSON.stringify( groups );
                                localStorage.setItem( 'group',groups );
                                renderGroups();
                            }else if( e.keyCode === 27 ){
                                renderGroups();
                            }
                        } );
                    },0);

                });
            },0);
        }

    }
    renderGroups();

    $('.add-group-btn').on('click',function(){

        var group = localStorage.getItem( 'group' ) || '{}' ;
        var groupOrder = localStorage.getItem( 'groupOrder' );
        if( !groupOrder ){
            groupOrder = [];
        }else{
            groupOrder = JSON.parse( groupOrder );
        }
        var tempData = {};
        if( group ){
            tempData = JSON.parse( group );
        }
        var tempId = guid();
        groupOrder.push( tempId );
        tempData[tempId] = {name:'Untitled'}; 
        localStorage.setItem('group',JSON.stringify( tempData ));
        localStorage.setItem( 'groupOrder', JSON.stringify(groupOrder) );
        renderGroups();
    });


    function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return s4() + s4() +  s4();
    }

}());