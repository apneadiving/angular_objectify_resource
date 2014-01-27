angular.module('angular_objectify_resource')

.factory 'aor.BaseDecorator', ->
  class BaseDecorator

    @decorate_association: (name)->
      @DECORATED_ASSOCIATIONS ?= []
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
          closure = if angular.isFunction(value)
                      (local_object, local_key)->
                        -> local_object[local_key]()
                    else
                      (local_object, local_key)->
                        -> local_object[local_key]
          @[key] = closure(@_object, key)

    _decorate_associations: ->
      @constructor.DECORATED_ASSOCIATIONS ?= []
      for relation in @constructor.DECORATED_ASSOCIATIONS
        continue unless @_object[relation]
        closure = if angular.isArray @_object[relation]
                    (local_object, local_relation)->
                      ->
                        _.map local_object[local_relation], (element)-> element.decorator()
                  else
                    (local_object, local_relation)->
                      -> local_object[local_relation].decorator()
        @[relation] = closure(@_object, relation)
