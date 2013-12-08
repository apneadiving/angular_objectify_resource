angular.module('angular_objectify_resource')

.factory 'aor.BaseDecorator', ->
  class BaseDecorator

    @DECORATED_ASSOCIATIONS: []

    @decorate_association: (name)->
      @DECORATED_ASSOCIATIONS.push name

    constructor: (@_object)->
      @_delegate_methods()
      @_decorate_associations()
      @after_init()

    after_init: ->

    _delegate_methods: ->
      for key, value of @_object
        # dont override methods of the decorator
        unless @[key]
          if angular.isFunction(value)
            closure = (local_key)->
              -> @_object[local_key]()
          else
            closure = (local_key)->
              ->
                console.log local_key
                @_object[local_key]
           @[key] = closure(key)

    _decorate_associations: ->
      for relation in @constructor.DECORATED_ASSOCIATIONS
        continue unless @_object[relation]
        if angular.isArray @_object[relation]
          @[relation] = _.map( @_object[relation], (element)->(element.decorator()) )
        else
          @[relation] = @_object[relation].decorator()
