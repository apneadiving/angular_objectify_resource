(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("BaseModel", function() {
    var baseModel, created_at, created_at_string, object, resource, subject;
    baseModel = subject = resource = null;
    created_at = new Date('Wed, 28 Jul 1999 15:15:20 GMT');
    created_at_string = "2013-12-16T15:31:53+0000";
    object = {
      id: 'id',
      foo: 'foo',
      created_at: created_at_string,
      skipped_created_at: created_at_string,
      bars: [
        {
          bar: 'bar'
        }
      ],
      baz: {
        bazz: 'bazz'
      }
    };
    beforeEach(module('angular_objectify_resource'));
    beforeEach(function() {
      return inject(function($injector) {
        baseModel = $injector.get('aor.BaseModel');
        return resource = {
          create: jasmine.createSpy('create'),
          update: jasmine.createSpy('update'),
          destroy: jasmine.createSpy('destroy')
        };
      });
    });
    describe("base features", function() {
      beforeEach(function() {
        return subject = new baseModel(object, resource);
      });
      it("extends object passed in arg", function() {
        expect(subject.foo).toEqual(object.foo);
        expect(subject.bars).toEqual(object.bars);
        return expect(subject.baz).toEqual(object.baz);
      });
      describe("_is_persisted", function() {
        it("object with id is considered persisted", function() {
          return expect(subject._is_persisted()).toBeTruthy();
        });
        return it("by default, object without id is considered not persisted", function() {
          subject.id = null;
          return expect(subject._is_persisted()).toBeFalsy();
        });
      });
      describe("toParams", function() {
        return it("only returns attributes, not including _", function() {
          subject._private = true;
          return expect(_.keys(subject.toParams())).toEqual(_.keys(object));
        });
      });
      describe("_base_routing_params", function() {
        it("when persisted", function() {
          return expect(subject._base_routing_params()).toEqual({
            id: subject.id
          });
        });
        return it("when not persisted", function() {
          subject.id = null;
          return expect(subject._base_routing_params()).toEqual({});
        });
      });
      return describe("save context", function() {
        beforeEach(function() {
          return subject._params_key = function() {
            return 'param_key';
          };
        });
        describe("_params", function() {
          it("merges routing params and real params", function() {
            var result;
            result = subject._params();
            expect(_.keys(result)).toEqual(['id', 'param_key']);
            return expect(_.keys(result.param_key)).toEqual(_.keys(object));
          });
          return it("adds additional routing params", function() {
            var result;
            result = subject._params({
              parent_id: 'id'
            });
            return expect(_.keys(result)).toEqual(['id', 'parent_id', 'param_key']);
          });
        });
        return describe("_params stubbed", function() {
          beforeEach(function() {
            subject._params = function(arg) {
              return arg;
            };
            this.on_success = jasmine.createSpy('on_success');
            return this.on_error = jasmine.createSpy('on_error');
          });
          describe("save", function() {
            describe("when persisted", function() {
              it("without additional routing keys", function() {
                subject.save(this.on_success, this.on_error);
                return expect(resource.update).toHaveBeenCalledWith({}, this.on_success, this.on_error);
              });
              return it("with additional routing keys", function() {
                subject.save({
                  parent_id: 'id'
                }, this.on_success, this.on_error);
                return expect(resource.update).toHaveBeenCalledWith({
                  parent_id: 'id'
                }, this.on_success, this.on_error);
              });
            });
            return describe("when not persisted", function() {
              beforeEach(function() {
                return subject.id = void 0;
              });
              it("without additional routing keys", function() {
                subject.save(this.on_success, this.on_error);
                return expect(resource.create).toHaveBeenCalledWith({}, this.on_success, this.on_error);
              });
              return it("with additional routing keys", function() {
                subject.save({
                  parent_id: 'id'
                }, this.on_success, this.on_error);
                return expect(resource.create).toHaveBeenCalledWith({
                  parent_id: 'id'
                }, this.on_success, this.on_error);
              });
            });
          });
          return describe("destroy", function() {
            describe("when persisted", function() {
              it("without additional routing keys", function() {
                subject.destroy(this.on_success, this.on_error);
                return expect(resource.destroy).toHaveBeenCalledWith({}, this.on_success, this.on_error);
              });
              return it("with additional routing keys", function() {
                subject.destroy({
                  parent_id: 'id'
                }, this.on_success, this.on_error);
                return expect(resource.destroy).toHaveBeenCalledWith({
                  parent_id: 'id'
                }, this.on_success, this.on_error);
              });
            });
            return describe("when not persisted", function() {
              beforeEach(function() {
                return subject.id = void 0;
              });
              it("without additional routing keys", function() {
                subject.destroy(this.on_success, this.on_error);
                expect(this.on_success).toHaveBeenCalled();
                return expect(resource.destroy).not.toHaveBeenCalled();
              });
              return it("with additional routing keys", function() {
                subject.destroy({
                  parent_id: 'id'
                }, this.on_success, this.on_error);
                expect(this.on_success).toHaveBeenCalled();
                return expect(resource.destroy).not.toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
    return describe("inheritance", function() {
      var Bar, Baz, Foo, child, decorator;
      Foo = Bar = Baz = child = decorator = null;
      beforeEach(function() {
        var _ref, _ref1, _ref2;
        decorator = jasmine.createSpy('decorator');
        Bar = (function(_super) {
          __extends(Bar, _super);

          function Bar() {
            _ref = Bar.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          return Bar;

        })(baseModel);
        Baz = (function(_super) {
          __extends(Baz, _super);

          function Baz() {
            _ref1 = Baz.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          return Baz;

        })(baseModel);
        Foo = (function(_super) {
          __extends(Foo, _super);

          function Foo() {
            _ref2 = Foo.__super__.constructor.apply(this, arguments);
            return _ref2;
          }

          Foo.has_many('bars', {
            "class": Bar,
            foreign_key: 'foo_id'
          });

          Foo.has_one('baz', {
            "class": Baz,
            foreign_key: 'foo_id'
          });

          Foo.decorator(decorator);

          Foo.skip_date_conversion('skipped_created_at');

          Foo.prototype.beginned_at = function() {
            return created_at_string;
          };

          return Foo;

        })(baseModel);
        return subject = new Foo(object);
      });
      describe("base behaviour", function() {
        it("creates top level object", function() {
          return expect(subject instanceof Foo).toBeTruthy();
        });
        it("convert keys finishing by _at to dates", function() {
          expect(angular.isDate(subject.created_at)).toBeTruthy();
          return expect(subject.created_at).toEqual(moment(created_at_string, 'YYYY-MM-DDTHH:mm:ssZZ').toDate());
        });
        it("doesnt convert keys finishing by _at to dates when they are functions", function() {
          return expect(subject.beginned_at()).toEqual(created_at_string);
        });
        it("doesnt convert keys finishing by _at when explicitly skipped", function() {
          return expect(subject.skipped_created_at).toEqual(created_at_string);
        });
        return it("decorator", function() {
          subject.decorator();
          return expect(decorator).toHaveBeenCalledWith(subject);
        });
      });
      describe("has many", function() {
        beforeEach(function() {
          return child = subject.bars[0];
        });
        it("base class not spoiled by children", function() {
          expect(baseModel.HAS_MANY_RELATIONS).toBeUndefined();
          expect(Bar.HAS_MANY_RELATIONS.length).toEqual(0);
          expect(Baz.HAS_MANY_RELATIONS.length).toEqual(0);
          return expect(Foo.HAS_MANY_RELATIONS.length).toEqual(1);
        });
        it("creates has many association", function() {
          return expect(child instanceof Bar).toBeTruthy();
        });
        it("sets foreign_key on association", function() {
          return expect(child.foo_id).toEqual(subject.id);
        });
        it("sets parent in children", function() {
          return expect(child._get_parent()).toBe(subject);
        });
        it("creates method buildBar", function() {
          return expect(subject.buildBar).toBeDefined();
        });
        return describe("addBar", function() {
          var bar;
          bar = {
            bar: 'bar',
            bar2: 'bar2'
          };
          it("is defined", function() {
            return expect(subject.addBar).toBeDefined();
          });
          it("adds another Bar instance", function() {
            var result;
            result = subject.addBar(bar);
            return expect(result instanceof Bar).toBeTruthy();
          });
          return it("returns freshly created instance", function() {
            var result;
            result = subject.addBar(bar);
            return expect(result).toBe(subject.bars[subject.bars.length - 1]);
          });
        });
      });
      return describe("has one", function() {
        beforeEach(function() {
          return child = subject.baz;
        });
        it("base class not spoiled by children", function() {
          expect(baseModel.HAS_ONE_RELATIONS).toBeUndefined();
          expect(Bar.HAS_ONE_RELATIONS.length).toEqual(0);
          expect(Baz.HAS_ONE_RELATIONS.length).toEqual(0);
          return expect(Foo.HAS_ONE_RELATIONS.length).toEqual(1);
        });
        it("creates has one association", function() {
          return expect(child instanceof Baz).toBeTruthy();
        });
        it("sets foreign_key on association", function() {
          return expect(child.foo_id).toEqual(subject.id);
        });
        it("sets parent in children", function() {
          return expect(child._get_parent()).toBe(subject);
        });
        return it("creates method buildBaz", function() {
          return expect(subject.buildBaz).toBeDefined();
        });
      });
    });
  });

}).call(this);
