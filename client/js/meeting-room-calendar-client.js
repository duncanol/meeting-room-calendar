console.log("The client is ready!");

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

CalendarFunctions = {
    formatTime: function(date) {
       return date.toTimeString().substring(0, 5);
    }
};

MeetingRooms = {
    assets: function() {
        return assets.find({});
    }
};