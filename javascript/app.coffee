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

		events: {
			"change #filter select": "setFilter"
		}

		initialize: ->
			@collection = new Directory(contacts)
			@render()
			@$el.find("#filter").append @createSelect()
			@on "change:filterType", @filterByType, this
			@collection.on 'reset', @render, @
		
		render: ->
			this.$el.find("article").remove();

			that = this
			_.each @collection.models, (item)->
				that.renderContact item
			this

		renderContact: (item) ->
			contactView = new ContactView model: item

			@$el.append contactView.render().el

		getType: ->
			_.uniq @collection.pluck("type"), false, (type) ->
    		type.toLowerCase()
		
		createSelect: ->
			filter = @$el.find("#filter")
		
			select = $('<select/>', 
				html: "<option>All</option>")

			_.each @getType(), (item) ->
				option = $("<option/>"
					value: item.toLowerCase()
					text:  item.toLowerCase()
				).appendTo(select)
			select

		setFilter: (event) ->
			@filterType = event.currentTarget.value
			@trigger 'change:filterType'

		filterByType: ->
			if @filterType is 'All'
				@collection.reset contacts
				contactsRouter.navigate('filter/all')
			else
				@collection.reset contacts, silent:true 

				filterType = @filterType
				filtered = _.filter @collection.models, (item) -> 
					item.get('type').toLowerCase() is filterType

				@collection.reset filtered

				contactsRouter.navigate "filter/#{filterType}"

	class ContactsRouter extends Backbone.Router
		routes:
			"filter/:type": "urlFilter"

		urlFilter: (type)->
			console.log type 
			directory.filterType = type
			directory.trigger "change:filterType" 

	directory = new DirectoryView()

	contactsRouter = new ContactsRouter()

	Backbone.history.start()