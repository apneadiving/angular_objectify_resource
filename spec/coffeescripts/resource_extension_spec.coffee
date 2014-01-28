describe "ResourceExtension", ->

  subject  = service = null
  resource = jasmine.createSpy('resource')
  response = jasmine.createSpy('response')
  klass    = jasmine.createSpy('model')
  resource = jasmine.createSpy('resource')
  callback = jasmine.createSpy('callback')
  options  =
    model:     klass
    namespace: 'foos'
    resource:  resource
  dependency = null

  beforeEach module('angular_objectify_resource')

  beforeEach ->
    inject ($injector)->
      dependency = $injector.get('aor.ResourceExtension')
      service    = dependency.get options

  describe "resource_build_method", ->
    it "calls expected class", ->
      service.resource_build_method(resource)
      expect(klass).toHaveBeenCalledWith(resource, resource)

  describe "build_object", ->
    beforeEach -> spyOn(service, 'resource_build_method').andReturn(resource)

    it "calls resource_build_method with response", ->
      service.build_object(callback)(response)
      expect(service.resource_build_method).toHaveBeenCalledWith response

    describe "with callback", ->

      it "callback called with resource", ->
        service.build_object(callback)(response)
        expect(callback).toHaveBeenCalledWith resource

    describe "without callback", ->

      it "callback called with resource", ->
        result = service.build_object()(response)
        expect(result).toBe resource

  describe "build_nested_collection", ->
    beforeEach ->
      spyOn(service, 'resource_build_method').andReturn(resource)
      callback =
        method: (object)-> object
      spyOn(callback, 'method').andCallThrough()

    describe "response is an array", ->
      action = -> service.build_nested_collection(callback.method)([ jasmine.createSpy('response') ])

      it "calls resource_build_method with array elements", ->
        action()
        expect(service.resource_build_method).toHaveBeenCalled()

      it "returns expected result", ->
        result = action()
        expect(result).toEqual [resource]

    describe "response is an object", ->
      action = -> service.build_nested_collection(callback.method)({ foos: [ jasmine.createSpy('response') ] })

      it "calls resource_build_method with array elements", ->
        action()
        expect(service.resource_build_method).toHaveBeenCalled()

      it "returns expected result", ->
        result = action()
        expect(result.foos).toEqual [resource]
