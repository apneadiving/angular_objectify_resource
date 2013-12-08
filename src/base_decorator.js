(function() {
  var __hasProp = {}.hasOwnProperty;

  angular.module('angular_objectify_resource').factory('aor.BaseDecorator', function() {
    return App.BaseDecorator = (function() {
      BaseDecorator.DECORATED_ASSOCIATIONS = [];

      BaseDecorator.decorate_association = function(name) {
        return this.DECORATED_ASSOCIATIONS.push(name);
      };

      function BaseDecorator(object) {
        this.object = object;
        this._delegate_methods();
        this._decorate_associations();
        this.after_init();
      }

      BaseDecorator.prototype.after_init = function() {};

      BaseDecorator.prototype._delegate_methods = function() {
        var key, value, _ref, _results;
        _ref = this.object;
        _results = [];
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          if (!this[key]) {
            if (angular.isFunction(value)) {
              _results.push(this[key] = function() {
                return this.object[key];
              });
            } else {
              _results.push(this[key] = function() {
                return this.object[key]();
              });
            }
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
          if (!this.object[relation]) {
            continue;
          }
          if (angular.isArray(this.object[this.relation])) {
            _results.push(this[relation] = _.map(this.object[this.relation], function(element) {
              return element.decorator();
            }));
          } else {
            _results.push(this[relation] = this.object[this.relation].decorator());
          }
        }
        return _results;
      };

      return BaseDecorator;

    })();
  });

}).call(this);
