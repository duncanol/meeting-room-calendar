assets = new Meteor.Collection('assets');

assets.allow({
    insert: function (userId, doc) {
        return uniqueName(doc.name);
    },
    update: function (userId, doc, fields, modifier) {
        return uniqueName(modifier['$set'].name);
    }
});

var uniqueName = function(assetName) {
    return assets.find({name: assetName}).count() == 0;
};

if (Meteor.isClient) {
    console.log("The client is ready!");
    
    //
    // The intro Template
    //
    // templates are converted to javascript functions under the Templates namespace
    Template.intro.showIntro = function() {
        return Session.equals("showIntro", true);
    };
    
    // a table of event handlers for the "intro" template
    Template.intro.events({
        'click #show-intro-toggle': function() {
            if (Template.intro.showIntro()) {
                Session.set('showIntro', false);
            } else {
                Session.set('showIntro', true);
            }
        }
    });
    
    //
    // The assetlist Template
    //

    // access to the asset Collection
    Template.assetlist.assets = function() {
        return assets.find({});
    };

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
        'click span.asset-title': function(e) {
            
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
            Session.set('editingAssetId', null);
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
      console.log("The server is ready!");
      
      
  });
}
