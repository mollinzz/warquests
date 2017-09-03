  var questSettings = {};
questSettings.man = [
  "blue_pests"
]
quests = {
  "blue_pests": {
    "info": [
      "Hello, I have some troubles with snakes. Can u help me?",
      "Can u kill 10 snakes. I will give u some gold for it",
      "Thanks, take it [10 gold]"
    ],
    "conditions": function() {
      return (game.storage.getField("killedSnakes") >= 10);
    },
    "reward": function() {
      game.storage.refreshItem("coins", game.storage.getField("coins"), 20)
    }
  }
}
