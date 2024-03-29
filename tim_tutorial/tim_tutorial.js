Tasks = new Mongo.Collection("tasks");
if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        return Tasks.find({checked: {$ne:true}},{sort: {createdAt: -1}});
      } else {
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    }
  
  });
  Template.test_header.helpers({
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    } 
  }); 
Template.body.events({
  "submit .new-task": function (event) {
    event.preventDefault();

    var text = event.target.text.value;

    if (text !== "") {
    Tasks.insert({ 
	    text: text,
	    createdAt: new Date(),
	    owner: Meteor.userId(),
	    username: Meteor.user().username 
    });
    }

    event.target.text.value = "";

  },
  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }
  
}

);

Template.task.events({
  "click .toggle-checked": function () {
    Tasks.update(this._id, {
      $set: {checked: ! this.checked}
    });


  },
  "click .delete": function () {
    Tasks.remove(this._id);
  }});
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
  });
}
