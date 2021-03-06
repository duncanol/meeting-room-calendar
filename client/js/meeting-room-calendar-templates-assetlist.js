//
// The assetlist Template
//

// access to the asset Collection
Template.assetlist.assets = MeetingRooms.assets;

//
// Adding assets
//
Template.assetlist.addingAsset = function() {
    return Session.equals('addingAsset', true);
};

Template.assetlist.events({
    
    // clicking the Add Asset button
    'click #add-asset-button': function() {
        
        // set addingAsset variable to true and force an instant update of the DOM so we can set 
        // the focus on the textfield that will appear
        Session.set('addingAsset', true);
        Meteor.flush();
        
        // and set the focus into the new textfield
        document.getElementById('add-asset-textfield').focus();
    },

    // hitting the Enter key in the Add Meeting Room textfield will add a non-empty Meeting Room 
    // to the list.  Hitting Escape will cancel
    'keyup #add-asset-textfield' : function(e, t) {

        // enter key
        if (e.which === 13) {
            var value = String(e.target.value || "");
            if (value) {
                assets.insert({name : value});
                Session.set('addingAsset', false);
            }
        }
        // escape key
        else if (e.which === 27) {
            Session.set('addingAsset', false);
        }
    },

    // clicking out of the textfield will cancel the action of adding an asset
    'focusout #add-asset-textfield': function() {
        Session.set('addingAsset', false);
    }
});


//
// Editing Assets
//
Template.assetlist.editingAsset = function(assetId) {
    return Session.equals('editingAssetId', assetId);
};

Template.assetlist.events({
    
    // clicking the Add Asset button
    'click .asset-title': function(e) {
        
        // set addingAsset variable to true and force an instant update of the DOM so we can set 
        // the focus on the textfield that will appear
        Session.set('editingAssetId', e.target.getAttribute('data-asset-id'));
        Meteor.flush();
        
        // and set the focus into the new textfield
        document.getElementById('edit-asset-textfield').focus();
    },

    // hitting the Enter key in the Add Meeting Room textfield will add a non-empty Meeting Room 
    // to the list.  Hitting Escape will cancel
    'keyup #edit-asset-textfield' : function(e, t) {

        // enter key
        if (e.which === 13) {
            var value = String(e.target.value || "");
            if (value) {
                assets.update({
                    '_id': e.target.getAttribute('data-asset-id')
                }, { 
                    $set: {
                        'name' : value
                    } 
                });
                Session.set('editingAssetId', null);
            }
        }
        // escape key
        else if (e.which === 27) {
            Session.set('editingAssetId', false);
        }
    },

    // clicking out of the textfield will cancel the action of adding an asset
    'focusout #edit-asset-textfield': function() {
        window.setTimeout(function() { 
            Session.set('editingAssetId', null);
        }, 100);
    }
});

Template.assetlist.events({
    
    // clicking the Remove Asset button
    'click .remove-asset': function(e) {
        assets.remove({'_id': e.target.getAttribute('data-asset-id')});
    }
});