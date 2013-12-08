(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("BaseDecorator", function() {
    var Bar, BarDecorator, Baz, BazDecorator, Foo, FooDecorator, decorator, object, subject;
    Bar = Baz = Foo = BarDecorator = BazDecorator = FooDecorator = null;
    subject = decorator = object = null;
    beforeEach(module('angular_objectify_resource'));
    beforeEach(function() {
      object = {
        foo: 'foo',
        foo2: 'foo2',
        bars: [
          {
            bar: 'bar'
          }
        ],
        bars2: [
          {
            bar: 'bar'
          }
        ],
        baz: {
          bazz: 'bazz'
        },
        baz2: {
          bazz: 'bazz'
        }
      };
      return inject(function($injector) {
        var baseDecorator, baseModel, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        baseModel = $injector.get('aor.BaseModel');
        baseDecorator = $injector.get('aor.BaseDecorator');
        FooDecorator = (function(_super) {
          __extends(FooDecorator, _super);

          function FooDecorator() {
            _ref = FooDecorator.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          FooDecorator.decorate_association('baz');

          FooDecorator.decorate_association('bars');

          FooDecorator.prototype.method2 = jasmine.createSpy('decorator method2');

          return FooDecorator;

        })(baseDecorator);
        BarDecorator = (function(_super) {
          __extends(BarDecorator, _super);

          function BarDecorator() {
            _ref1 = BarDecorator.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          return BarDecorator;

        })(baseDecorator);
        BazDecorator = (function(_super) {
          __extends(BazDecorator, _super);

          function BazDecorator() {
            _ref2 = BazDecorator.__super__.constructor.apply(this, arguments);
            return _ref2;
          }

          return BazDecorator;

        })(baseDecorator);
        Bar = (function(_super) {
          __extends(Bar, _super);

          function Bar() {
            _ref3 = Bar.__super__.constructor.apply(this, arguments);
            return _ref3;
          }

          Bar.decorator(BarDecorator);

          return Bar;

        })(baseModel);
        Baz = (function(_super) {
          __extends(Baz, _super);

          function Baz() {
            _ref4 = Baz.__super__.constructor.apply(this, arguments);
            return _ref4;
          }

          Baz.decorator(BazDecorator);

          return Baz;

        })(baseModel);
        Foo = (function(_super) {
          __extends(Foo, _super);

          function Foo() {
            _ref5 = Foo.__super__.constructor.apply(this, arguments);
            return _ref5;
          }

          Foo.has_many('bars', {
            "class": Bar
          });

          Foo.has_one('baz', {
            "class": Baz
          });

          Foo.decorator(FooDecorator);

          Foo.prototype.method = jasmine.createSpy('method');

          Foo.prototype.method2 = jasmine.createSpy('method2');

          return Foo;

        })(baseModel);
        subject = new Foo(object);
        return decorator = subject.decorator();
      });
    });
    return describe("base features", function() {
      it("decorator object is initial object", function() {
        return expect(decorator._object).toBe(subject);
      });
      it('creates functions out of object keys', function() {
        var keys;
        keys = ['foo', 'foo2', 'bars2', 'baz2'];
        return _.each(keys, function(key) {
          expect(decorator[key]).toBeDefined();
          expect(angular.isFunction(decorator[key])).toBeTruthy();
          return expect(decorator[key]()).toEqual(subject[key]);
        });
      });
      it('forwards calls to object functions', function() {
        decorator.method();
        return expect(subject.method).toHaveBeenCalled();
      });
      it("doesnt override methods existing in the decorator", function() {
        decorator.method2();
        expect(decorator.method2).toHaveBeenCalled();
        return expect(subject.method).not.toHaveBeenCalled();
      });
      it("if object property changes, decorator should return updated version", function() {
        expect(decorator.foo()).toEqual('foo');
        subject.foo = 'bar';
        return expect(decorator.foo()).toEqual('bar');
      });
      return describe("decorated associations", function() {
        it("not wrapped in functions", function() {
          expect(angular.isFunction(decorator.bars)).toBeFalsy();
          return expect(angular.isFunction(decorator.baz)).toBeFalsy();
        });
        return it("returns decorators", function() {
          expect(decorator.bars[0] instanceof BarDecorator).toBeTruthy();
          return expect(decorator.baz instanceof BazDecorator).toBeTruthy();
        });
      });
    });
  });

}).call(this);
