if (Meteor.isClient) {
    console.log("The client is ready!");
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
      console.log("The server is ready!");
  });
}
