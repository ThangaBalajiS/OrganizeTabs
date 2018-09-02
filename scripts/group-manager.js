(function(){

     window.renderGroups = function(){
         var editIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="19" viewBox="0 0 15 19"><path d="M12.4861829,1.42845944 C10.4727946,-0.0882973021 9.03982341,-0.0553004185 8.49554948,0.0359909592 C8.34247244,0.0612885699 8.2138452,0.152579948 8.12348723,0.281267793 L3.21226543,7.29200565 L0.806617183,10.7269812 C0.512156482,11.1471415 0.342070879,11.6464944 0.315495004,12.1645454 L0.000836637727,18.3503612 C-0.0214870977,18.7958191 0.406916015,19.1180887 0.808743253,18.9586038 L6.39605532,16.7478126 C6.86697983,16.5608302 7.27624832,16.2363609 7.57177205,15.8140008 L9.53200863,13.0147651 L14.885453,5.37158703 C14.9800631,5.2362998 15.0183324,5.07131539 14.9917565,4.90633097 C14.9024616,4.32778561 14.4740584,2.92431816 12.4861829,1.42845944 Z M6.38032094,15.1901761 L4.0784949,15.9867139 C3.98835976,16.01801 3.88808442,15.9927712 3.82949658,15.9241216 C3.53317732,15.5859211 3.1805236,15.2507494 2.61830569,14.8842814 C2.05608777,14.5188231 1.59189182,14.3209506 1.14234283,14.1715367 C1.05220769,14.1412501 0.994746545,14.064524 1.00037999,13.9777024 L1.13783607,11.7708184 L1.75638845,11.0086055 C1.75638845,11.0086055 3.14108948,10.837991 4.94829896,12.0161399 C6.75325506,13.1932793 7,14.4269537 7,14.4269537 L6.38032094,15.1901761 Z"/></svg>';
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
                var selectedStyle = '';
                if( item === localStorage.selectedCategory ){
                    selectedStyle = 'selected-group';
                }

                $( '#group-target' ).append( '<div class="group-list-item to-drop group-item-mods '+ selectedStyle +' " data-id="'+item+'" ><div class="group-name" >'+groups[item].name+'</div><div class="group-name-edit" >'+editIcon+'</div></div>' );
            });
            setTimeout(function(){
                $( '.group-name-edit' ).on('click',function(e){
                    var tempId = $( this ).parent().attr( 'data-id' );
                    $(this).parent().html( '<input id="group-name-editor" type="text" value="'+groups[tempId].name+'"  />' );
                    e.stopPropagation();
                    setTimeout(function(){
                        $( '#group-name-editor' ).focus();
                        $( '#group-name-editor' ).on( 'blur', function(){
                            var tempId1 = $( this ).parent().attr( 'data-id' );
                            groups[tempId1].name = this.value; 
                            groups = JSON.stringify( groups );
                            localStorage.setItem( 'group',groups );
                            window.renderGroups();
                        } );
                        $( '#group-name-editor' ).on( 'keyup', function(e){
                            var tempId1 = $( this ).parent().attr( 'data-id' );
                            if( e.keyCode === 13 ){
                                groups[tempId1].name = e.target.value; 
                                groups = JSON.stringify( groups );
                                localStorage.setItem( 'group',groups );
                                window.renderGroups();
                            }else if( e.keyCode === 27 ){
                                window.renderGroups();
                            }
                        } );
                    },0);

                });
                (function(){
                    $( '.group-item-mods' ).off();
                    $( '.group-item-mods' ).on( 'click',function(e){
                        if( e.target.id !== 'group-name-editor' ){
                            localStorage.selectedCategory = $(this).attr( 'data-id' );
                            window.renderGroups();
                            window.renderTabs();
                        }
        
                    } )
                }());
    
            },0);
        }
        window.dnd();
    }
    window.renderGroups();
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
        var tempId = window.helpers.guid();
        groupOrder.push( tempId );
        tempData[tempId] = {name:'Untitled',all:[],similar:{}}; 
        localStorage.setItem('group',JSON.stringify( tempData ));
        localStorage.setItem( 'groupOrder', JSON.stringify(groupOrder) );
        window.renderGroups();
    });

}());