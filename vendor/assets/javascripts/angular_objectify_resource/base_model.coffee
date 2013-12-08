angular.module('angular_objectify_resource')

.factory 'aor.BaseModel', ->
  class App.BaseModel
    @HAS_ONE_RELATIONS:  []
    @HAS_MANY_RELATIONS: []
    @DECORATOR: undefined

    @has_many: (name, options)->
      @HAS_MANY_RELATIONS.push(angular.extend({ name: name }, options))

    @has_one: (name, options)->
      @HAS_ONE_RELATIONS.push(angular.extend({ name: name }, options))

    @decorator: (klass)->
      @DECORATOR = klass

    @string_ends_with: (string, suffix)->
      string.indexOf(suffix, string.length - suffix.length) != -1

    constructor: (resource)->

      _.extend(@, resource)
      @_extend_children()
      @_convert_dates()
      @after_init()

    after_init: ->

    decorator: ->
      @_decorator ?= new (@constructor.DECORATOR)(@)

    _convert_dates: ->
      for own key, value of @
        if ! angular.isFunction(value) && @constructor.string_ends_with(key, '_at')
          @[key] = @_convert_date(value)

    _convert_date: (epoch)->
      return null if _.is_blank(epoch) || epoch is 0
      new Date(epoch * 1000)

    _extend_children: ->
      for relation in @constructor.HAS_MANY_RELATIONS
        continue unless @[relation_name]

        relation_name = relation.name
        @[relation_name] = _.map @[relation_name], (child)=>
          @_extend_child child, relation.class
        # example for has_many 'foos'
        # creates method addFoo
        @["add#{ relation_name.singularize().camelize() }"] = (raw_object)=>
          object = @_extend_child(raw_object, relation.class)
          @[relation_name].push object
          object

      for relation in @constructor.HAS_ONE_RELATIONS
        continue unless @[relation_name]

        relation_name = relation.name
        @[relation.name] = @_extend_child @[relation.name], relation.class

        # example for has_one 'foo'
        # creates method buildFoo
        @["build#{ relation_name.camelize() }"] = (raw_object)=>
          object = @_extend_child(raw_object, relation.class)
          @[relation_name] = object
          object

    _extend_child: (raw_child, klass)->
      raw_child._parent = @
      new klass(raw_child)

    _get_parent: ->
      @_parent
