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
            label: CalendarFunctions.formatTime(date),
        };
        date = new Date(date.getTime() + 30*60*1000);
    }
    
    return periods;
};

Template.assetbookings.assets = MeetingRooms.assets;

Template.assetbookings.bookingStatusOfAssetAndPeriod = function(assetId, timePeriod) {
    
    var bookingStatus = {
        assetName: assets.findOne({_id: assetId}).name,
        assetId: assetId,
        period: CalendarFunctions.formatTime(timePeriod),
    };
    
    var endOfPeriod = new Date(timePeriod.getTime() + (30 * 60 * 1000));
    var startingInThisPeriod = bookings.findOne({assetId: assetId, from: {$gte: timePeriod, $lt: endOfPeriod}});
    
    if (startingInThisPeriod != null) {
        bookingStatus.startingInThisPeriod = true;
        bookingStatus.numberOfPeriods = (startingInThisPeriod.to.getTime() - startingInThisPeriod.from.getTime()) / 1000 / 60 / 30;
        bookingStatus.bookingId = startingInThisPeriod._id;
        
        if (startingInThisPeriod.userId != null) {
            bookingStatus.user = Meteor.users.findOne({_id: startingInThisPeriod.userId}).username;
        } else {
            bookingStatus.user = 'anonymous';
        }
        return bookingStatus;
    }
    
    var continuingInThisPeriod = bookings.findOne({assetId: assetId, from: {$lte: timePeriod}, to: {$gt: timePeriod}});
    
    if (continuingInThisPeriod == null) {
        bookingStatus.free = true;
        return bookingStatus;
    }
    
    return bookingStatus;
};

//
// Clicking on a bookable slot
//
Template.assetbookings.events({
   'click .booking-period.free': function(e) {
       
       if (Meteor.userId() == null) {
           return;
       }
       
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

       if (Meteor.userId() == null) {
           return;
       }
       
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
       
       bookings.insert({
           assetId: assetId, 
           from: fromDate, 
           to: toDate,
           userId: Meteor.userId()
       });
   }
});


Template.cancelassetbookingmodal.bookingToCancel = function() {
    return Session.get('bookingToCancel');
};

//
// Clicking on a booked slot
//
Template.assetbookings.events({
 'click .booking-period.booked': function(e) {
     
     var bookingId = e.target.getAttribute('data-booking-id');
     var booking = bookings.findOne({_id: bookingId});
     
     if (!allowedToRemoveBooking(Meteor.userId(), booking)) {
         return;
     }
     
     Session.set('bookingToCancel', booking);
 }
});

Template.cancelassetbookingmodal.events({
    'click .btn-primary': function(e) {
        var booking = Session.get('bookingToCancel');
        
        if (!allowedToRemoveBooking(Meteor.userId(), booking)) {
            return;
        }
        
        bookings.remove({_id: booking._id});
        
        Session.set('bookingToCancel', null);
    },
    'click *[data-dismiss="modal"]': function(e) {
        
        Session.set('bookingToCancel', null);
    }
});
