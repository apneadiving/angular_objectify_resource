describe "BaseModel", ->

  baseModel = subject = resource = null
  created_at = new Date('Wed, 28 Jul 1999 15:15:20 GMT')
  created_at_string = "2013-12-16T15:31:53+0000"

  object    =
    id:   'id'
    foo:  'foo'
    created_at:         created_at_string
    skipped_created_at:  created_at_string
    bars: [
        bar: 'bar'
    ]
    baz:
      bazz: 'bazz'

  beforeEach module('angular_objectify_resource')

  beforeEach ->
    inject ($injector)->
      baseModel = $injector.get('aor.BaseModel')
      resource =
        create:  jasmine.createSpy('create')
        update:  jasmine.createSpy('update')
        destroy: jasmine.createSpy('destroy')

  describe "base features", ->
    beforeEach ->
      subject = new baseModel(object, resource)

    it "extends object passed in arg", ->
      expect(subject.foo).toEqual  object.foo
      expect(subject.bars).toEqual object.bars
      expect(subject.baz).toEqual  object.baz

    describe "_is_persisted", ->
      it "object with id is considered persisted", ->
        expect(subject._is_persisted()).toBeTruthy()

      it "by default, object without id is considered not persisted", ->
        subject.id = null
        expect(subject._is_persisted()).toBeFalsy()

    describe "toParams", ->
      it "only returns attributes, not including _", ->
        subject._private = true
        expect(_.keys(subject.toParams())).toEqual _.keys(object)

    describe "_base_routing_params", ->
      it "when persisted", ->
        expect(subject._base_routing_params()).toEqual { id: subject.id }

      it "when not persisted", ->
        subject.id = null
        expect(subject._base_routing_params()).toEqual { }

    describe "save context", ->
      beforeEach ->
        subject._params_key = -> 'param_key'

      describe "_params", ->
        it "merges routing params and real params", ->
          result = subject._params()
          expect(_.keys(result)).toEqual ['id', 'param_key']
          expect(_.keys(result.param_key)).toEqual _.keys(object)

        it "adds additional routing params", ->
          result = subject._params({ parent_id: 'id' })
          expect(_.keys(result)).toEqual ['id', 'parent_id', 'param_key']

      describe "_params stubbed", ->
        beforeEach ->
          subject._params = (arg)-> arg
          @on_success = jasmine.createSpy('on_success')
          @on_error   = jasmine.createSpy('on_error')

        describe "save", ->

          describe "when persisted", ->

            it "without additional routing keys", ->
              subject.save(@on_success, @on_error)
              expect(resource.update).toHaveBeenCalledWith({}, @on_success, @on_error)

            it "with additional routing keys", ->
              subject.save({parent_id: 'id'}, @on_success, @on_error)
              expect(resource.update).toHaveBeenCalledWith({parent_id: 'id'}, @on_success, @on_error)

          describe "when not persisted", ->
            beforeEach ->
              subject.id = undefined

            it "without additional routing keys", ->
              subject.save(@on_success, @on_error)
              expect(resource.create).toHaveBeenCalledWith({}, @on_success, @on_error)

            it "with additional routing keys", ->
              subject.save({parent_id: 'id'}, @on_success, @on_error)
              expect(resource.create).toHaveBeenCalledWith({parent_id: 'id'}, @on_success, @on_error)

        describe "destroy", ->

          describe "when persisted", ->

            it "without additional routing keys", ->
              subject.destroy(@on_success, @on_error)
              expect(resource.destroy).toHaveBeenCalledWith({}, @on_success, @on_error)

            it "with additional routing keys", ->
              subject.destroy({parent_id: 'id'}, @on_success, @on_error)
              expect(resource.destroy).toHaveBeenCalledWith({parent_id: 'id'}, @on_success, @on_error)

          describe "when not persisted", ->
            beforeEach ->
              subject.id = undefined

            it "without additional routing keys", ->
              subject.destroy(@on_success, @on_error)
              expect(@on_success).toHaveBeenCalled()
              expect(resource.destroy).not.toHaveBeenCalled()

            it "with additional routing keys", ->
              subject.destroy({parent_id: 'id'}, @on_success, @on_error)
              expect(@on_success).toHaveBeenCalled()
              expect(resource.destroy).not.toHaveBeenCalled()


  describe "inheritance", ->
    Foo = Bar = Baz = child = decorator = null

    beforeEach ->
      decorator = jasmine.createSpy('decorator')
      class Bar extends baseModel
      class Baz extends baseModel
      class Foo extends baseModel
        @has_many 'bars', class: Bar, foreign_key: 'foo_id'
        @has_one  'baz',  class: Baz, foreign_key: 'foo_id'
        @decorator decorator
        @skip_date_conversion 'skipped_created_at'

        beginned_at: ->
          created_at_string

      subject = new Foo(object)

    describe "base behaviour", ->
      it "creates top level object", ->
        expect(subject instanceof Foo).toBeTruthy()

      it "convert keys finishing by _at to dates", ->
        expect(angular.isDate(subject.created_at)).toBeTruthy()
        expect(subject.created_at).toEqual( moment(created_at_string, 'YYYY-MM-DDTHH:mm:ssZZ').toDate() )

      it "doesnt convert keys finishing by _at to dates when they are functions", ->
        expect(subject.beginned_at()).toEqual created_at_string

      it "doesnt convert keys finishing by _at when explicitly skipped", ->
        expect(subject.skipped_created_at).toEqual created_at_string

      it "decorator", ->
        subject.decorator()
        expect(decorator).toHaveBeenCalledWith(subject)

    describe "has many", ->
      beforeEach -> child = subject.bars[0]

      it "base class not spoiled by children", ->
        expect(baseModel.HAS_MANY_RELATIONS).toBeUndefined()
        expect(Bar.HAS_MANY_RELATIONS.length).toEqual 0
        expect(Baz.HAS_MANY_RELATIONS.length).toEqual 0
        expect(Foo.HAS_MANY_RELATIONS.length).toEqual 1

      it "creates has many association", ->
        expect(child instanceof Bar).toBeTruthy()

      it "sets foreign_key on association", ->
        expect(child.foo_id).toEqual subject.id

      it "sets parent in children", ->
        expect(child._get_parent()).toBe subject

      it "creates method buildBar", ->
        expect(subject.buildBar).toBeDefined()

      describe "addBar", ->
        bar =
          bar:  'bar'
          bar2: 'bar2'

        it "is defined", ->
          expect(subject.addBar).toBeDefined()

        it "adds another Bar instance", ->
          result = subject.addBar(bar)
          expect(result instanceof Bar).toBeTruthy()

        it "returns freshly created instance", ->
          result = subject.addBar(bar)
          expect(result).toBe subject.bars[(subject.bars.length - 1)]

    describe "has one", ->
      beforeEach -> child = subject.baz

      it "base class not spoiled by children", ->
        expect(baseModel.HAS_ONE_RELATIONS).toBeUndefined()
        expect(Bar.HAS_ONE_RELATIONS.length).toEqual 0
        expect(Baz.HAS_ONE_RELATIONS.length).toEqual 0
        expect(Foo.HAS_ONE_RELATIONS.length).toEqual 1

      it "creates has one association", ->
        expect(child instanceof Baz).toBeTruthy()

      it "sets foreign_key on association", ->
        expect(child.foo_id).toEqual subject.id

      it "sets parent in children", ->
        expect(child._get_parent()).toBe subject

      it "creates method buildBaz", ->
        expect(subject.buildBaz).toBeDefined()


