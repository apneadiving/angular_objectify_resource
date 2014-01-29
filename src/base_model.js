(function() {
  var __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  angular.module('angular_objectify_resource').factory('aor.BaseModel', [
    'aor.utils', function(utils) {
      var BaseModel;
      return BaseModel = (function() {
        BaseModel.has_many = function(name, options) {
          if (this.HAS_MANY_RELATIONS == null) {
            this.HAS_MANY_RELATIONS = [];
          }
          return this.HAS_MANY_RELATIONS.push(angular.extend({
            name: name
          }, options));
        };

        BaseModel.has_one = function(name, options) {
          if (this.HAS_ONE_RELATIONS == null) {
            this.HAS_ONE_RELATIONS = [];
          }
          return this.HAS_ONE_RELATIONS.push(angular.extend({
            name: name
          }, options));
        };

        BaseModel.decorator = function(klass) {
          return this.DECORATOR = klass;
        };

        BaseModel.skip_date_conversion = function() {
          var keys;
          keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return this.SKIP_DATE_CONVERSION = keys;
        };

        function BaseModel(resource, _resource) {
          this._resource = _resource != null ? _resource : null;
          angular.extend(this, resource);
          this.before_init();
          this._extend_children();
          this._convert_dates();
          this.after_init();
        }

        BaseModel.prototype.before_init = function() {};

        BaseModel.prototype.after_init = function() {};

        BaseModel.prototype.decorator = function() {
          return this._decorator != null ? this._decorator : this._decorator = new this.constructor.DECORATOR(this);
        };

        BaseModel.prototype.toParams = function() {
          var result;
          result = {};
          _.forIn(this, function(value, key) {
            if (!(utils.string_starts_with(key, '_') || angular.isFunction(value))) {
              return result[key] = value;
            }
          });
          return result;
        };

        BaseModel.prototype._params = function(additional_routing_params) {
          var result;
          if (additional_routing_params == null) {
            additional_routing_params = {};
          }
          result = _.extend({
            id: this.id
          }, additional_routing_params);
          result[this._params_key] = this.toParams();
          return result;
        };

        BaseModel.prototype.save = function() {
          var args, argz;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          argz = utils.extract_params(args);
          if (this._is_persisted()) {
            return this._resource.update(this._params(argz.routing_params), argz.on_success, argz.on_error);
          } else {
            return this._resource.create(this._params(argz.routing_params), argz.on_success, argz.on_error);
          }
        };

        BaseModel.prototype.destroy = function() {
          var args, argz;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          argz = utils.extract_params(args);
          return this._resource.destroy(this._params(argz.routing_params), argz.on_success, argz.on_error);
        };

        BaseModel.prototype._is_persisted = function() {
          return _.has(this, 'id');
        };

        BaseModel.prototype._convert_dates = function() {
          var key, value, _results;
          _results = [];
          for (key in this) {
            if (!__hasProp.call(this, key)) continue;
            value = this[key];
            if (this._is_date_to_convert(key, value)) {
              _results.push(this[key] = this._convert_date(value));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };

        BaseModel.prototype._convert_date = function(date) {
          if (!date) {
            return null;
          }
          return moment(date, 'YYYY-MM-DDTHH:mm:ssZZ').toDate();
        };

        BaseModel.prototype._convert_date_to_time_zone = function(date, local_offset_in_seconds) {
          date = this._convert_date(date);
          date.setSeconds(date.getSeconds() + local_offset_in_seconds);
          return date;
        };

        BaseModel.prototype._extend_children = function() {
          var add_method_name, build_method_name, camelized_relation_name, relation, relation_name, that, _base, _base1, _i, _j, _len, _len1, _ref, _ref1, _results;
          if ((_base = this.constructor).HAS_MANY_RELATIONS == null) {
            _base.HAS_MANY_RELATIONS = [];
          }
          _ref = this.constructor.HAS_MANY_RELATIONS;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            relation = _ref[_i];
            relation_name = relation.name;
            camelized_relation_name = utils.camelize(utils.singularize(relation_name));
            build_method_name = "build" + camelized_relation_name;
            this[build_method_name] = this._build_method(relation);
            if (this[relation_name]) {
              add_method_name = "add" + camelized_relation_name;
              that = this;
              this[add_method_name] = (function(local_relation_name, local_build_method_name) {
                return function(raw_object) {
                  var object;
                  object = that[local_build_method_name](raw_object);
                  that[local_relation_name].push(object);
                  return object;
                };
              })(relation_name, build_method_name);
              this[relation_name] = _.map(this[relation_name], this[build_method_name]);
            }
          }
          if ((_base1 = this.constructor).HAS_ONE_RELATIONS == null) {
            _base1.HAS_ONE_RELATIONS = [];
          }
          _ref1 = this.constructor.HAS_ONE_RELATIONS;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            relation = _ref1[_j];
            relation_name = relation.name;
            build_method_name = "build" + (utils.camelize(relation_name));
            this[build_method_name] = this._build_method(relation);
            if (this[relation_name]) {
              _results.push(this[relation_name] = this[build_method_name](this[relation_name]));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };

        BaseModel.prototype._build_method = function(relation) {
          var _this = this;
          return function(raw_object) {
            var temp;
            raw_object._parent = _this;
            if (relation.foreign_key) {
              raw_object[relation.foreign_key] = _this.id;
            }
            temp = raw_object instanceof relation["class"] ? raw_object : new relation["class"](raw_object);
            return temp;
          };
        };

        BaseModel.prototype._is_date_to_convert = function(key, value) {
          return angular.isString(value) && utils.string_ends_with(key, '_at') && !_.contains(this.constructor.SKIP_DATE_CONVERSION, key);
        };

        BaseModel.prototype._get_parent = function() {
          return this._parent;
        };

        return BaseModel;

      })();
    }
  ]);

}).call(this);
