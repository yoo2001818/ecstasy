var EntityTemplate = {};

// We should use json for this; I'm just writing in js file for testing.

EntityTemplate = {
  "BaseEntity": {
    "OwnerComponent": {},
    "InfoComponent": {
      type: "unit",
      name: "Unknown"
    },
    "PositionComponent": {}
  },
  "TestEntity": {
    "prototype": "BaseEntity",
    "InfoComponent": {
      type: "unit",
      name: "테스트용 엔티티"
    },
    "MoveComponent": {
      step: 2
    }
  }
}



if(typeof module !== 'undefined') {
  module.exports = EntityTemplate;
}
