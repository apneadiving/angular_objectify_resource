describe "BaseModel", ->

  baseModel = subject = null
  created_at = new Date('Wed, 28 Jul 1999 15:15:20 GMT')
  created_at_string = "2013-12-04T13:24:41Z"
  object    =
    foo:  'foo'
    created_at: created_at_string
    bars: [
        bar: 'bar'
    ]
    baz:
      bazz: 'bazz'

  beforeEach module('angular_objectify_resource')

  beforeEach ->
    inject ($injector)->
      baseModel = $injector.get('aor.BaseModel')

  describe "base features", ->
    beforeEach -> subject = new baseModel(object)

    it "extends object passed in arg", ->
      expect(subject.foo).toEqual  object.foo
      expect(subject.bars).toEqual object.bars
      expect(subject.baz).toEqual  object.baz

  describe "inheritance", ->
    Foo = Bar = Baz = child = decorator = null

    beforeEach ->
      decorator = jasmine.createSpy('decorator')
      class Bar extends baseModel
      class Baz extends baseModel
      class Foo extends baseModel
        @has_many 'bars', class: Bar
        @has_one  'baz',  class: Baz
        @decorator decorator

        beginned_at: ->
          created_at_string

      subject = new Foo(object)

    describe "base behaviour", ->
      it "creates top level object", ->
        expect(subject instanceof Foo).toBeTruthy()

      it "convert keys finishing by _at to dates", ->
        expect(angular.isDate(subject.created_at)).toBeTruthy()
        expect(subject.created_at).toEqual( new Date(created_at_string) )

      it "doesnt convert keys finishing by _at to dates when they are functions", ->
        expect(subject.beginned_at()).toEqual created_at_string

      it "decorator", ->
        subject.decorator()
        expect(decorator).toHaveBeenCalledWith(subject)

    describe "has many", ->
      beforeEach -> child = subject.bars[0]

      it "creates has many association", ->
        expect(child instanceof Bar).toBeTruthy()

      it "sets parent in children", ->
        expect(child._get_parent()).toBe subject

      it "creates method addBar", ->
        expect(subject.addBar).toBeDefined()

      it "creates method buildBar", ->
        expect(subject.buildBar).toBeDefined()

    describe "has one", ->
      beforeEach -> child = subject.baz

      it "creates has one association", ->
        expect(child instanceof Baz).toBeTruthy()

      it "sets parent in children", ->
        expect(child._get_parent()).toBe subject

      it "creates method buildBaz", ->
        expect(subject.buildBaz).toBeDefined()
