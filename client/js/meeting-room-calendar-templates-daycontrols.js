MeetingRooms = MeetingRooms || {};

MeetingRooms.currentDay = function() {
    
    var currentDay = Session.get('currentDay');
    
    if (currentDay != null) {
        return currentDay;
    } 
    
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    
    Session.set('currentDay', today);
    return today;
};

MeetingRooms.setCurrentDay = function(date) {
    Session.set('currentDay', date);
};

Template.daycontrols.currentDay = function() {
    return MeetingRooms.currentDay();
};

Template.daycontrols.currentDayFormatted = function() {
    var day = Template.daycontrols.currentDay();
    return day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();
};

Template.daycontrols.events({
    'click #previous-day': function(e) {
        var yesterday = new Date(MeetingRooms.currentDay().getTime() - (24 * 60 * 60 * 1000));
        MeetingRooms.setCurrentDay(yesterday);
    },
    'click #next-day': function(e) {
        var tomorrow = new Date(MeetingRooms.currentDay().getTime() + (24 * 60 * 60 * 1000));
        MeetingRooms.setCurrentDay(tomorrow);
    }
});

Template.daycontrols.rendered = function() {
   //jQuery('#day-control').datepicker();
};