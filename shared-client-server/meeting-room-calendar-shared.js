assets = new Meteor.Collection('assets');

assets.allow({
    insert: function (userId, doc) {
        return uniqueName(doc.name);
    },
    update: function (userId, doc, fields, modifier) {
        return uniqueName(modifier['$set'].name);
    },
    remove: function (userId, doc, fields, modifier) {
        return true;
    }
});

var uniqueName = function(assetName) {
    return assets.find({name: assetName}).count() == 0;
};

bookings = new Meteor.Collection('bookings');