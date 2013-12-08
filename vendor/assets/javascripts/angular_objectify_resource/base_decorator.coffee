angular.module('angular_objectify_resource')

.factory 'aor.BaseDecorator', ->
  class App.BaseDecorator

    @DECORATED_ASSOCIATIONS: []

    @decorate_association: (name)->
      @DECORATED_ASSOCIATIONS.push name

    constructor: (@object)->
      @_delegate_methods()
      @_decorate_associations()
      @after_init()

    after_init: ->

    _delegate_methods: ->
      for own key, value of @object
        # dont override methods of the decorator
        unless @[key]
          if angular.isFunction(value)
            @[key] = -> @object[key]
          else
            @[key] = -> @object[key]()

    _decorate_associations: ->
      for relation in @constructor.DECORATED_ASSOCIATIONS
        continue unless @object[relation]
        if angular.isArray @object[@relation]
          @[relation] = _.map( @object[@relation], (element)->(element.decorator()) )
        else
          @[relation] = @object[@relation].decorator()
