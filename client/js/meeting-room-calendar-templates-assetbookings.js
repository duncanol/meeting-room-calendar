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
       
       var assetId = e.target.getAttribute('data-asset-id');
       var asset = assets.findOne({_id: assetId});
       var from = e.target.getAttribute('data-period');

       Template.assetbookingmodal.setNewBooking({
           asset: asset,
           from: from,
           to: ''
       });
   }
});

Template.assetbookingmodal.newBooking = function() {
    return Session.get('newBooking');  
};

Template.assetbookingmodal.setNewBooking = function(booking) {
    Session.set('newBooking', booking);  
};
  
//
// Booking modal
//
Template.assetbookingmodal.events({
   'click .btn-primary': function(e) {

       if (Meteor.userId() == null) {
           return;
       }
       
       var newBooking = Template.assetbookingmodal.newBooking();
       var modal = jQuery('#asset-booking-modal');
       var assetId = newBooking.asset._id;
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
       
       Template.assetbookingmodal.setNewBooking(null);
   },
   'click *[data-dismiss="modal"]': function(e) {
       Template.assetbookingmodal.setNewBooking(null);
   }
});

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
     
     Template.cancelassetbookingmodal.setBookingToCancel(booking);
 }
});


//
// Cancelling a booking
//
Template.cancelassetbookingmodal.bookingToCancel = function() {
    return Session.get('bookingToCancel');
};

Template.cancelassetbookingmodal.setBookingToCancel = function(booking) {
    Session.set('bookingToCancel', booking);
};

Template.cancelassetbookingmodal.events({
    'click .btn-primary': function(e) {
        var booking = Template.cancelassetbookingmodal.bookingToCancel();
        
        if (!allowedToRemoveBooking(Meteor.userId(), booking)) {
            return;
        }
        
        bookings.remove({_id: booking._id});
        
        Template.cancelassetbookingmodal.setBookingToCancel(null);
    },
    'click *[data-dismiss="modal"]': function(e) {
        Template.cancelassetbookingmodal.setBookingToCancel(null);
    }
});