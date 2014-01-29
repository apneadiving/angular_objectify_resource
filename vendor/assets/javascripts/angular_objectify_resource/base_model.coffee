angular.module('angular_objectify_resource')

.factory 'aor.BaseModel', ['aor.utils', (utils)->
  class BaseModel

    @has_many: (name, options)->
      @HAS_MANY_RELATIONS ?= []
      @HAS_MANY_RELATIONS.push(angular.extend({ name: name }, options))

    @has_one: (name, options)->
      @HAS_ONE_RELATIONS ?= []
      @HAS_ONE_RELATIONS.push(angular.extend({ name: name }, options))

    @decorator: (klass)->
      @DECORATOR = klass

    @skip_date_conversion: (keys...)->
      @SKIP_DATE_CONVERSION = keys

    constructor: (resource, @_resource = null)->
      angular.extend(@, resource)
      @before_init()
      @_extend_children()
      @_convert_dates()
      @after_init()

    before_init: ->

    after_init: ->

    decorator: ->
      @_decorator ?= new (@constructor.DECORATOR)(@)

    toParams: ->
      result = {}
      _.forIn @, (value, key)->
        result[key] = value unless utils.string_starts_with(key, '_') || angular.isFunction(value)
      result

    _base_routing_params: ->
      if @_is_persisted then { id: @id } else { }

    _params: (additional_routing_params = {})->
      result = _.extend @_base_routing_params, additional_routing_params
      result[@_params_key()] = @toParams()
      result

    # define _params_key
    save: (args...)->
      argz = utils.extract_params(args)
      if @_is_persisted()
        @_resource.update(@_params(argz.routing_params), argz.on_success, argz.on_error)
      else
        @_resource.create(@_params(argz.routing_params), argz.on_success, argz.on_error)

    # define _params_key
    destroy: (args...)->
      argz = utils.extract_params(args)
      @_resource.destroy(@_params(argz.routing_params), argz.on_success, argz.on_error)

    _is_persisted: ->
      _.has(@, 'id')

    _convert_dates: ->
      for own key, value of @
        @[key] = @_convert_date(value) if @_is_date_to_convert(key, value)

    _convert_date: (date)->
      return null unless date
      moment(date, 'YYYY-MM-DDTHH:mm:ssZZ').toDate()

    _convert_date_to_time_zone: (date, local_offset_in_seconds)->
      date = @_convert_date(date)
      date.setSeconds(date.getSeconds() + local_offset_in_seconds)
      date

    _extend_children: ->
      @constructor.HAS_MANY_RELATIONS ?= []
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

      @constructor.HAS_ONE_RELATIONS ?= []
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
        raw_object._parent = @
        raw_object[relation.foreign_key] = @id if relation.foreign_key
        temp =  if (raw_object instanceof relation.class)
                  raw_object
                else
                  new relation.class(raw_object)
        temp

    _is_date_to_convert: (key, value)->
      angular.isString(value) &&
      utils.string_ends_with(key, '_at') &&
      !_.contains(@constructor.SKIP_DATE_CONVERSION, key)

    _get_parent: ->
      @_parent
]
