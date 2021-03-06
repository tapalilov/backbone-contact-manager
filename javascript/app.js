// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(function() {
    var Contact, ContactView, ContactsRouter, Directory, DirectoryView, contacts, contactsRouter, directory;
    contacts = [
      {
        name: "Contact 1",
        address: "1, a street, a town, a city, AB12 3CD",
        tel: "0123456789",
        email: "anemail@me.com",
        type: "family"
      }, {
        name: "Contact 2",
        address: "1, a street, a town, a city, AB12 3CD",
        tel: "0123456789",
        email: "anemail@me.com",
        type: "family"
      }, {
        name: "Contact 3",
        address: "1, a street, a town, a city, AB12 3CD",
        tel: "0123456789",
        email: "anemail@me.com",
        type: "friend"
      }, {
        name: "Contact 4",
        address: "1, a street, a town, a city, AB12 3CD",
        tel: "0123456789",
        email: "anemail@me.com",
        type: "colleague"
      }, {
        name: "Contact 5",
        address: "1, a street, a town, a city, AB12 3CD",
        tel: "0123456789",
        email: "anemail@me.com",
        type: "family"
      }, {
        name: "Contact 6",
        address: "1, a street, a town, a city, AB12 3CD",
        tel: "0123456789",
        email: "anemail@me.com",
        type: "colleague"
      }, {
        name: "Contact 7",
        address: "1, a street, a town, a city, AB12 3CD",
        tel: "0123456789",
        email: "anemail@me.com",
        type: "friend"
      }, {
        name: "Contact 8",
        address: "1, a street, a town, a city, AB12 3CD",
        tel: "0123456789",
        email: "anemail@me.com",
        type: "family"
      }
    ];
    Contact = (function(_super) {

      __extends(Contact, _super);

      function Contact() {
        return Contact.__super__.constructor.apply(this, arguments);
      }

      Contact.prototype.defaults = {
        photo: './img/placeholder.png',
        name: "",
        address: "",
        tel: "",
        email: "",
        type: ""
      };

      return Contact;

    })(Backbone.Model);
    Directory = (function(_super) {

      __extends(Directory, _super);

      function Directory() {
        return Directory.__super__.constructor.apply(this, arguments);
      }

      Directory.prototype.model = Contact;

      return Directory;

    })(Backbone.Collection);
    ContactView = (function(_super) {

      __extends(ContactView, _super);

      function ContactView() {
        return ContactView.__super__.constructor.apply(this, arguments);
      }

      ContactView.prototype.tagName = 'article';

      ContactView.prototype.className = "contact-container";

      ContactView.prototype.template = $("#contactTemplate").html();

      ContactView.prototype.render = function() {
        var tmpl;
        tmpl = _.template(this.template);
        this.$el.html(tmpl(this.model.toJSON()));
        return this;
      };

      ContactView.prototype.editTemplate = _.template($('#contactEditTemplate').html());

      ContactView.prototype.events = function() {
        return {
          'click button.delete': 'deleteContact',
          'click button.edit': 'editContact',
          'change select.type': 'addType',
          'click button.save': 'saveEdit',
          'click button.cancel': 'cancelEdit'
        };
      };

      ContactView.prototype.cancelEdit = function() {
        return this.render();
      };

      ContactView.prototype.saveEdit = function(event) {
        var formData, prev;
        event.preventDefault();
        formData = {};
        prev = this.model.previousAttributes();
        $(event.target).closest('form').find(':input').not('button').each(function() {
          var el;
          el = $(this);
          return formData[el.attr('class')] = el.val();
        });
        if (formData.photo === '') {
          delete formData.photo;
        }
        this.model.set(formData);
        this.render();
        if (prev.photo === '/img/placeholder.png') {
          delete prev.photo;
        }
        return _.each(contacts, function(contact) {
          if (_.isEqual(contact, prev)) {
            return contacts.splice(_.indexOf(contacts, contact), 1, formData);
          }
        });
      };

      ContactView.prototype.editContact = function() {
        var newOpt;
        this.$el.html(this.editTemplate(this.model.toJSON()));
        newOpt = $('<option/>', {
          html: '<em> Add new .. </em>',
          value: 'Add type'
        });
        this.select = directory.createSelect().addClass('type').val(this.$el.find('#type').val()).append(newOpt).insertAfter(this.$el.find('.name'));
        return this.$el.find("input[type='hidden']").remove();
      };

      ContactView.prototype.addType = function() {
        if (this.select.val() === 'Add type') {
          this.select.remove();
          return $('<input />', {
            'class': 'type'
          }).insertAfter(this.$el.find('.name')).focus();
        }
      };

      ContactView.prototype.deleteContact = function() {
        var removedType;
        removedType = this.model.get('type').toLowerCase();
        this.model.destroy();
        this.remove();
        if (_.indexOf(directory.getType(), removedType) === -1) {
          return directory.$el.find('#filter select').children("[value='" + removedType + "']").remove();
        }
      };

      return ContactView;

    })(Backbone.View);
    DirectoryView = (function(_super) {

      __extends(DirectoryView, _super);

      function DirectoryView() {
        return DirectoryView.__super__.constructor.apply(this, arguments);
      }

      DirectoryView.prototype.el = $('#contacts');

      DirectoryView.prototype.events = {
        "change #filter select": "setFilter",
        'click #add': 'addContact',
        'click #showForm': 'showForm'
      };

      DirectoryView.prototype.initialize = function() {
        this.collection = new Directory(contacts);
        this.render();
        this.$el.find("#filter").append(this.createSelect());
        this.on("change:filterType", this.filterByType, this);
        this.collection.on('reset', this.render, this);
        this.collection.on('add', this.renderContact, this);
        return this.collection.on('remove', this.removeContact, this);
      };

      DirectoryView.prototype.render = function() {
        var that;
        this.$el.find("article").remove();
        that = this;
        _.each(this.collection.models, function(item) {
          return that.renderContact(item);
        });
        return this;
      };

      DirectoryView.prototype.renderContact = function(item) {
        var contactView;
        contactView = new ContactView({
          model: item
        });
        return this.$el.append(contactView.render().el);
      };

      DirectoryView.prototype.getType = function() {
        return _.uniq(this.collection.pluck("type"), false, function(type) {
          return type.toLowerCase();
        });
      };

      DirectoryView.prototype.createSelect = function() {
        var filter, select;
        filter = this.$el.find("#filter");
        select = $('<select/>', {
          html: "<option>All</option>"
        });
        _.each(this.getType(), function(item) {
          var option;
          return option = $("<option/>", {
            value: item.toLowerCase(),
            text: item.toLowerCase()
          }).appendTo(select);
        });
        return select;
      };

      DirectoryView.prototype.setFilter = function(event) {
        this.filterType = event.currentTarget.value;
        return this.trigger('change:filterType');
      };

      DirectoryView.prototype.filterByType = function() {
        var filterType, filtered;
        if (this.filterType === 'All') {
          this.collection.reset(contacts);
          return contactsRouter.navigate('filter/all');
        } else {
          this.collection.reset(contacts, {
            silent: true
          });
          filterType = this.filterType;
          filtered = _.filter(this.collection.models, function(item) {
            return item.get('type').toLowerCase() === filterType;
          });
          this.collection.reset(filtered);
          return contactsRouter.navigate("filter/" + filterType);
        }
      };

      DirectoryView.prototype.addContact = function(e) {
        var formData;
        e.preventDefault();
        formData = {};
        $('#addContact').children('input').each(function(i, el) {
          return formData[el.id] = $(el).val();
        });
        contacts.push(formData);
        if (formData.photo === '') {
          formData.photo = './img/placeholder.png';
        }
        if (_.indexOf(this.getType(), formData.type) === -1) {
          this.collection.add(new Contact(formData));
          return this.$el.find('#filter').find('select').remove().end().append(this.createSelect());
        } else {
          return this.collection.add(new Contact(formData));
        }
      };

      DirectoryView.prototype.removeContact = function(removedModel) {
        var removed;
        removed = removedModel.attributes;
        if (removed.photo === "./img/placeholder.png") {
          delete removed.photo;
        }
        return _.each(contacts, function(contact) {
          if (_.isEqual(contact, removed)) {
            return contacts.splice(_.indexOf(contacts, contact), 1);
          }
        });
      };

      DirectoryView.prototype.showForm = function(e) {
        e.preventDefault();
        return this.$el.find('#addContact').slideToggle();
      };

      return DirectoryView;

    })(Backbone.View);
    ContactsRouter = (function(_super) {

      __extends(ContactsRouter, _super);

      function ContactsRouter() {
        return ContactsRouter.__super__.constructor.apply(this, arguments);
      }

      ContactsRouter.prototype.routes = {
        "filter/:type": "urlFilter"
      };

      ContactsRouter.prototype.urlFilter = function(type) {
        console.log(type);
        directory.filterType = type;
        return directory.trigger("change:filterType");
      };

      return ContactsRouter;

    })(Backbone.Router);
    directory = new DirectoryView();
    contactsRouter = new ContactsRouter();
    return Backbone.history.start();
  });

}).call(this);
