var questSettings = {};
questSettings.man = [
  "blue_pests"
]
quests = {
  "blue_pests": {
    "texts": [
      "Hello, I have some troubles with snakes. Can u help me?",
      "Can u kill 10 snakes. I will give u some gold for it",
      "U killed 10 snakes?",
      "Thanks, take it [20 gold]"
    ],
    "info": {
      name: "blue_pests",
      progress: {
        "snake": 0
      }
    },
    "conditions": function(progress) {
      return (progress.snake >= 10);
    },
    "reward": function() {
      game.storage.refresh("coins", game.storage.getField("coins"), 20)
    }
  }
}


function Quests() {
  if (!game.storage.getField("quests")) {
    game.storage.setField("quests", []);
  };
  this.questArray = game.storage.getField("quests");

  this.addProgress = function(monsterName) {
    for (var i = 0; i < this.questArray.length; i++) {
      this.questArray[i].progress[monsterName] = this.questArray[i].progress[monsterName] + 1;
      console.log(this.questArray[i].progress[monsterName]);
      game.storage.setField("quests", this.questArray)
    };
  };

  this.checkForComplete = function() {
  };
};
