if (Meteor.isClient) {
    Meteor.startup(function () {
        
        // autorun will scan the function below for "Reactive Data sources" and run the supplied function every time that data source changes 
        Meteor.autorun(function () {
            var message = Session.get('myMessage');
            document.getElementById('my-message-placeholder').innerHTML = message;
            console.log(message);
        });
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
