angular.module('angular_objectify_resource')

.factory 'aor.BaseModel', ['aor.utils', (utils)->
  class BaseModel
    @HAS_ONE_RELATIONS:  []
    @HAS_MANY_RELATIONS: []
    @DECORATOR: undefined

    @has_many: (name, options)->
      @HAS_MANY_RELATIONS.push(angular.extend({ name: name }, options))

    @has_one: (name, options)->
      @HAS_ONE_RELATIONS.push(angular.extend({ name: name }, options))

    @decorator: (klass)->
      @DECORATOR = klass

    constructor: (resource)->
      angular.extend(@, resource)
      @_extend_children()
      @_convert_dates()
      @after_init()

    after_init: ->

    decorator: ->
      @_decorator ?= new (@constructor.DECORATOR)(@)

    _convert_dates: ->
      for own key, value of @
        if ! angular.isFunction(value) && utils.string_ends_with(key, '_at')
          @[key] = @_convert_date(value)

    _convert_date: (date)->
      return null unless date
      new Date(date)

    _extend_children: ->
      for relation in @constructor.HAS_MANY_RELATIONS
        relation_name = relation.name
        camelized_relation_name = utils.camelize(utils.singularize(relation_name))
        build_method_name = "build#{ camelized_relation_name }"

        @[build_method_name] = @_build_method(relation)

        if @[relation_name]
          add_method_name = "add#{ camelized_relation_name }"
          # example for has_many 'foos'
          # creates method addFoo
          that = @
          @[add_method_name] = ((local_relation_name, local_build_method_name)->
            (raw_object)->
              object = that[local_build_method_name](raw_object)
              that[local_relation_name].push object
              object
          )(relation_name, build_method_name)

          @[relation_name] = _.map @[relation_name], @[build_method_name]

      for relation in @constructor.HAS_ONE_RELATIONS
        relation_name     = relation.name
        build_method_name = "build#{ utils.camelize(relation_name) }"
        # example for has_one 'foo'
        # creates method buildFoo
        @[build_method_name] = @_build_method(relation)

        if @[relation_name]
          @[relation_name] = @[build_method_name] @[relation_name]

    _build_method: (relation)->
      (raw_object)=>
        temp =  if (raw_object instanceof relation.class)
                  raw_object
                else
                  new relation.class(raw_object)

        temp._parent = @
        temp[relation.foreign_key] = @id if relation.foreign_key
        temp

    _get_parent: ->
      @_parent
]
