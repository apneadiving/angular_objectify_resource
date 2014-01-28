(function() {
  describe("ResourceExtension", function() {
    var callback, dependency, klass, options, resource, response, service, subject;
    subject = service = null;
    resource = jasmine.createSpy('resource');
    response = jasmine.createSpy('response');
    klass = jasmine.createSpy('model');
    resource = jasmine.createSpy('resource');
    callback = jasmine.createSpy('callback');
    options = {
      model: klass,
      namespace: 'foos',
      resource: resource
    };
    dependency = null;
    beforeEach(module('angular_objectify_resource'));
    beforeEach(function() {
      return inject(function($injector) {
        dependency = $injector.get('aor.ResourceExtension');
        return service = dependency.get(options);
      });
    });
    describe("resource_build_method", function() {
      return it("calls expected class", function() {
        service.resource_build_method(resource);
        return expect(klass).toHaveBeenCalledWith(resource, resource);
      });
    });
    describe("build_object", function() {
      beforeEach(function() {
        return spyOn(service, 'resource_build_method').andReturn(resource);
      });
      it("calls resource_build_method with response", function() {
        service.build_object(callback)(response);
        return expect(service.resource_build_method).toHaveBeenCalledWith(response);
      });
      describe("with callback", function() {
        return it("callback called with resource", function() {
          service.build_object(callback)(response);
          return expect(callback).toHaveBeenCalledWith(resource);
        });
      });
      return describe("without callback", function() {
        return it("callback called with resource", function() {
          var result;
          result = service.build_object()(response);
          return expect(result).toBe(resource);
        });
      });
    });
    return describe("build_nested_collection", function() {
      beforeEach(function() {
        spyOn(service, 'resource_build_method').andReturn(resource);
        callback = {
          method: function(object) {
            return object;
          }
        };
        return spyOn(callback, 'method').andCallThrough();
      });
      describe("response is an array", function() {
        var action;
        action = function() {
          return service.build_nested_collection(callback.method)([jasmine.createSpy('response')]);
        };
        it("calls resource_build_method with array elements", function() {
          action();
          return expect(service.resource_build_method).toHaveBeenCalled();
        });
        return it("returns expected result", function() {
          var result;
          result = action();
          return expect(result).toEqual([resource]);
        });
      });
      return describe("response is an object", function() {
        var action;
        action = function() {
          return service.build_nested_collection(callback.method)({
            foos: [jasmine.createSpy('response')]
          });
        };
        it("calls resource_build_method with array elements", function() {
          action();
          return expect(service.resource_build_method).toHaveBeenCalled();
        });
        return it("returns expected result", function() {
          var result;
          result = action();
          return expect(result.foos).toEqual([resource]);
        });
      });
    });
  });

}).call(this);
