describe "BaseDecorator", ->

  Bar = Baz = Foo = BarDecorator = BazDecorator = FooDecorator = null
  subject = decorator = object = null

  beforeEach module('angular_objectify_resource')

  beforeEach ->
    object  =
      foo:  'foo'
      foo2: 'foo2'
      bars: [
          bar: 'bar'
      ]
      bars2: [
          bar: 'bar'
      ]
      baz:
        bazz: 'bazz'
      baz2:
        bazz: 'bazz'

    inject ($injector)->
      baseModel     = $injector.get('aor.BaseModel')
      baseDecorator = $injector.get('aor.BaseDecorator')

      class FooDecorator extends baseDecorator
        @decorate_association 'baz'
        @decorate_association 'bars'
        method2: jasmine.createSpy('decorator method2')

      class BarDecorator extends baseDecorator
      class BazDecorator extends baseDecorator

      class Bar extends baseModel
        @decorator BarDecorator

      class Baz extends baseModel
        @decorator BazDecorator

      class Foo extends baseModel
        @has_many 'bars', class: Bar
        @has_one  'baz',  class: Baz
        @decorator FooDecorator

        method:  jasmine.createSpy('method')
        method2: jasmine.createSpy('method2')

      subject   = new Foo(object)
      decorator = subject.decorator()

  describe "base features", ->
    it "decorator object is initial object", ->
      expect(decorator._object).toBe subject

    it 'creates functions out of object keys', ->
      keys = ['foo', 'foo2', 'bars2', 'baz2']
      _.each keys, (key)->
        expect(decorator[key]).toBeDefined()
        expect(angular.isFunction(decorator[key])).toBeTruthy()
        expect(decorator[key]()).toEqual subject[key]

    it 'forwards calls to object functions', ->
      decorator.method()
      expect(subject.method).toHaveBeenCalled()

    it "doesnt override methods existing in the decorator", ->
      decorator.method2()
      expect(decorator.method2).toHaveBeenCalled()
      expect(subject.method).not.toHaveBeenCalled()

    it "if object property changes, decorator should return updated version", ->
      expect(decorator.foo()).toEqual 'foo'
      subject.foo = 'bar'
      expect(decorator.foo()).toEqual 'bar'


    describe "decorated associations", ->

      it "returns decorators (has many)", ->
        expect(decorator.bars()[0] instanceof BarDecorator).toBeTruthy()

      it "returns decorators (has one)", ->
        window.g = decorator
        expect(decorator.baz() instanceof BazDecorator).toBeTruthy()







