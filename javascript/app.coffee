$ ->	
	contacts = [
	  name: "Contact 1"
	  address: "1, a street, a town, a city, AB12 3CD"
	  tel: "0123456789"
	  email: "anemail@me.com"
	  type: "family"
	,
	  name: "Contact 2"
	  address: "1, a street, a town, a city, AB12 3CD"
	  tel: "0123456789"
	  email: "anemail@me.com"
	  type: "family"
	,
	  name: "Contact 3"
	  address: "1, a street, a town, a city, AB12 3CD"
	  tel: "0123456789"
	  email: "anemail@me.com"
	  type: "friend"
	,
	  name: "Contact 4"
	  address: "1, a street, a town, a city, AB12 3CD"
	  tel: "0123456789"
	  email: "anemail@me.com"
	  type: "colleague"
	,
	  name: "Contact 5"
	  address: "1, a street, a town, a city, AB12 3CD"
	  tel: "0123456789"
	  email: "anemail@me.com"
	  type: "family"
	,
	  name: "Contact 6"
	  address: "1, a street, a town, a city, AB12 3CD"
	  tel: "0123456789"
	  email: "anemail@me.com"
	  type: "colleague"
	,
	  name: "Contact 7"
	  address: "1, a street, a town, a city, AB12 3CD"
	  tel: "0123456789"
	  email: "anemail@me.com"
	  type: "friend"
	,
	  name: "Contact 8"
	  address: "1, a street, a town, a city, AB12 3CD"
	  tel: "0123456789"
	  email: "anemail@me.com"
	  type: "family"
	]


	class Contact extends Backbone.Model
		defaults:
			photo: './img/placeholder.png'

	
	class Directory extends Backbone.Collection
		model: Contact

	
	class ContactView extends Backbone.View
		tagName: 'article'
		className: "contact-container"
		template: $("#contactTemplate").html()

		render: ->
			tmpl = _.template(@template)

			@$el.html tmpl(@model.toJSON())
			this
		
	class DirectoryView extends Backbone.View
		el: $('#contacts')

		initialize: ->
			@collection = new Directory(contacts)
			@render()

		render: ->
			that = this
			_.each @collection.models, (item)->
				that.renderContact item
			this

		renderContact: (item) ->
			contactView = new ContactView model: item

			@$el.append contactView.render().el

	window.directoryView = new DirectoryView()