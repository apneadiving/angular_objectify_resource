(function() {
  describe("BaseModel", function() {
    var subject;
    angular.module('testApp', ['angular_objectify_resource']);
    subject = angular.module('testApp').factory('testModel', ['aor.BaseModel', function(baseModel) {}]);
    it("works?", function() {});
    return describe("description", function() {
      return it("foo", function() {});
    });
  });

}).call(this);
