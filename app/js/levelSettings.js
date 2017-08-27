var levelSettings = {};
levelSettings.home = {
  type: "home",
  //bgColor: default,
  //bgImage: null,
  decor: [{
      name: "portal",
      x: 100,
      y: 100,
      options: {
        target: "home"
      }
    },
    {
      name: "weaponShop",
      x: 200,
      y: 100
    },
    {
      name: "potionShop",
      x: 200,
      y: 400
    }
  ]
};
levelSettings.farm1 = {
  type: "farm",
  decor: [{
    name: "portal",
    x: 1,
    y: 1,
    options: {
      target: "home"
    }
  }]
}