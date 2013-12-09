(function() {
  var __hasProp = {}.hasOwnProperty;

  angular.module('angular_objectify_resource').factory('aor.BaseModel', [
    'aor.utils', function(utils) {
      var BaseModel;
      return BaseModel = (function() {
        BaseModel.HAS_ONE_RELATIONS = [];

        BaseModel.HAS_MANY_RELATIONS = [];

        BaseModel.DECORATOR = void 0;

        BaseModel.has_many = function(name, options) {
          return this.HAS_MANY_RELATIONS.push(angular.extend({
            name: name
          }, options));
        };

        BaseModel.has_one = function(name, options) {
          return this.HAS_ONE_RELATIONS.push(angular.extend({
            name: name
          }, options));
        };

        BaseModel.decorator = function(klass) {
          return this.DECORATOR = klass;
        };

        function BaseModel(resource) {
          angular.extend(this, resource);
          this._extend_children();
          this._convert_dates();
          this.after_init();
        }

        BaseModel.prototype.after_init = function() {};

        BaseModel.prototype.decorator = function() {
          return this._decorator != null ? this._decorator : this._decorator = new this.constructor.DECORATOR(this);
        };

        BaseModel.prototype._convert_dates = function() {
          var key, value, _results;
          _results = [];
          for (key in this) {
            if (!__hasProp.call(this, key)) continue;
            value = this[key];
            if (!angular.isFunction(value) && utils.string_ends_with(key, '_at')) {
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
          return new Date(date);
        };

        BaseModel.prototype._extend_children = function() {
          var add_method_name, build_method_name, camelized_relation_name, relation, relation_name, that, _i, _j, _len, _len1, _ref, _ref1, _results;
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
            temp = raw_object instanceof relation["class"] ? raw_object : new relation["class"](raw_object);
            temp._parent = _this;
            if (relation.foreign_key) {
              temp[relation.foreign_key] = _this.id;
            }
            return temp;
          };
        };

        BaseModel.prototype._get_parent = function() {
          return this._parent;
        };

        return BaseModel;

      })();
    }
  ]);

}).call(this);
