(function() {
  angular.module('angular_objectify_resource').factory('aor.BaseDecorator', function() {
    var BaseDecorator;
    return BaseDecorator = (function() {
      BaseDecorator.DECORATED_ASSOCIATIONS = [];

      BaseDecorator.decorate_association = function(name) {
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
            if (angular.isFunction(value)) {
              closure = function(local_key) {
                return function() {
                  return this._object[local_key]();
                };
              };
            } else {
              closure = function(local_key) {
                return function() {
                  console.log(local_key);
                  return this._object[local_key];
                };
              };
            }
            _results.push(this[key] = closure(key));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      BaseDecorator.prototype._decorate_associations = function() {
        var relation, _i, _len, _ref, _results;
        _ref = this.constructor.DECORATED_ASSOCIATIONS;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          relation = _ref[_i];
          if (!this._object[relation]) {
            continue;
          }
          if (angular.isArray(this._object[relation])) {
            _results.push(this[relation] = _.map(this._object[relation], function(element) {
              return element.decorator();
            }));
          } else {
            _results.push(this[relation] = this._object[relation].decorator());
          }
        }
        return _results;
      };

      return BaseDecorator;

    })();
  });

}).call(this);
