(function() {
  var __hasProp = {}.hasOwnProperty;

  angular.module('angular_objectify_resource').factory('aor.BaseModel', function() {
    return App.BaseModel = (function() {
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

      BaseModel.string_ends_with = function(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
      };

      function BaseModel(resource) {
        _.extend(this, resource);
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
          if (!angular.isFunction(value) && this.constructor.string_ends_with(key, '_at')) {
            _results.push(this[key] = this._convert_date(value));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      BaseModel.prototype._convert_date = function(epoch) {
        if (_.is_blank(epoch) || epoch === 0) {
          return null;
        }
        return new Date(epoch * 1000);
      };

      BaseModel.prototype._extend_children = function() {
        var relation, relation_name, _i, _j, _len, _len1, _ref, _ref1, _results,
          _this = this;
        _ref = this.constructor.HAS_MANY_RELATIONS;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          relation = _ref[_i];
          if (!this[relation_name]) {
            continue;
          }
          relation_name = relation.name;
          this[relation_name] = _.map(this[relation_name], function(child) {
            return _this._extend_child(child, relation["class"]);
          });
          this["add" + (relation_name.singularize().camelize())] = function(raw_object) {
            var object;
            object = _this._extend_child(raw_object, relation["class"]);
            _this[relation_name].push(object);
            return object;
          };
        }
        _ref1 = this.constructor.HAS_ONE_RELATIONS;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          relation = _ref1[_j];
          if (!this[relation_name]) {
            continue;
          }
          relation_name = relation.name;
          this[relation.name] = this._extend_child(this[relation.name], relation["class"]);
          _results.push(this["build" + (relation_name.camelize())] = function(raw_object) {
            var object;
            object = _this._extend_child(raw_object, relation["class"]);
            _this[relation_name] = object;
            return object;
          });
        }
        return _results;
      };

      BaseModel.prototype._extend_child = function(raw_child, klass) {
        raw_child._parent = this;
        return new klass(raw_child);
      };

      BaseModel.prototype._get_parent = function() {
        return this._parent;
      };

      return BaseModel;

    })();
  });

}).call(this);
