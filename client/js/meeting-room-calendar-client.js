console.log("The client is ready!");

var TemplateScopes = {};

Handlebars.registerHelper('setScope', function(name) {
    TemplateScopes[name] = this; 
});

Handlebars.registerHelper('get', function(scope, field) {
    return TemplateScopes[scope][field]; 
});

var MeetingRooms = {
    assets: function() {
        return assets.find({});
    }
};


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

//
// Calendar time periods
//
Template.assetbookings.timePeriods = function() {
    var periods = new Array(24 * 2);
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    
    for (var i = 0; i < periods.length; i++) {
        periods[i] = { 
            date: date,
            label: date.toTimeString().substring(0, 5),
        };
        date = new Date(date.getTime() + 30*60*1000);
    }
    
    return periods;
};

Template.assetbookings.assets = MeetingRooms.assets;

Template.assetbookings.bookingStarts = function(assetId, timePeriod) {
    
    var endOfPeriod = new Date(timePeriod.getTime() + (30 * 60 * 1000));
    var existingBooking = bookings.findOne({assetId: assetId, from: {$gte: timePeriod, $lt: endOfPeriod}});
    
    if (existingBooking == null) {
        return null;
    }
    
    existingBooking.numberOfPeriods = (existingBooking.to.getTime() - existingBooking.from.getTime()) / 1000 / 60 / 30;
    return existingBooking;
};

Template.assetbookings.noBooking = function(assetId, timePeriod) {
    var existingBooking = bookings.findOne({assetId: assetId, from: {$lte: timePeriod}, to: {$gt: timePeriod}});
    return existingBooking == null;
};

Template.assetbookings.events({
   'click .booking-period': function(e) {
       var assetName = e.target.getAttribute('data-asset-name');
       var assetId = e.target.getAttribute('data-asset-id');
       var from = e.target.getAttribute('data-period');
       var modal = jQuery('#asset-booking-modal');
       modal.find('.asset-name').val(assetName);
       modal.find('.asset-id').val(assetId);
       modal.find('.from').val(from);
       modal.modal(true);
   }
});

//
// Booking modal
//
Template.assetbookingmodal.events({
   'click .btn-primary': function(e) {
       var modal = jQuery('#asset-booking-modal');
       var assetId = modal.find('.asset-id').val();
       var from = modal.find('.from').val();
       var to = modal.find('.to').val();
       
       var fromHour = from.split(':')[0];
       var fromMins = from.split(':')[1];
       var toHour = to.split(':')[0];
       var toMins = to.split(':')[1];
       
       var fromDate = new Date();
       var toDate = new Date();
       fromDate.setHours(fromHour, fromMins, 0, 0);
       toDate.setHours(toHour, toMins, 0, 0);
       
       bookings.insert({assetId: assetId, from: fromDate, to: toDate});
   }
});
