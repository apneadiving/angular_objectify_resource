(function() {
  angular.module('angular_objectify_resource').factory('aor.BaseDecorator', function() {
    var BaseDecorator;
    return BaseDecorator = (function() {
      BaseDecorator.decorate_association = function(name) {
        if (this.DECORATED_ASSOCIATIONS == null) {
          this.DECORATED_ASSOCIATIONS = [];
        }
        return this.DECORATED_ASSOCIATIONS.push(name);
      };

      function BaseDecorator(_object) {
        this._object = _object;
        this._delegate_methods();
        this._decorate_associations();
        this.after_init();
      }

      BaseDecorator.prototype.after_init = function() {};

      BaseDecorator.prototype._delegate_methods = function() {
        var closure, key, value, _ref, _results;
        _ref = this._object;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          if (!this[key]) {
            closure = angular.isFunction(value) ? function(local_object, local_key) {
              return function() {
                return local_object[local_key]();
              };
            } : function(local_object, local_key) {
              return function() {
                return local_object[local_key];
              };
            };
            _results.push(this[key] = closure(this._object, key));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      BaseDecorator.prototype._decorate_associations = function() {
        var closure, relation, _base, _i, _len, _ref, _results;
        if ((_base = this.constructor).DECORATED_ASSOCIATIONS == null) {
          _base.DECORATED_ASSOCIATIONS = [];
        }
        _ref = this.constructor.DECORATED_ASSOCIATIONS;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          relation = _ref[_i];
          if (!this._object[relation]) {
            continue;
          }
          closure = angular.isArray(this._object[relation]) ? function(local_object, local_relation) {
            return function() {
              return _.map(local_object[local_relation], function(element) {
                return element.decorator();
              });
            };
          } : function(local_object, local_relation) {
            return function() {
              return local_object[local_relation].decorator();
            };
          };
          _results.push(this[relation] = closure(this._object, relation));
        }
        return _results;
      };

      return BaseDecorator;

    })();
  });

}).call(this);
