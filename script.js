"use strict";
// Selectors
const game = document.querySelector(".game");
const points = document.querySelector(".points");
const playerHealth = document.querySelector(".health");
const shop = document.querySelector(".shop");
const shopMenu = document.querySelector(".shop--menu");
const playerDamage = document.querySelector(".damage");
const start = document.querySelector(".start");
const wave = document.querySelector(".wave");
const ready = document.querySelector(".ready");
const waveTimer = document.querySelector(".wave--timer");

class App {
  #waveOnGoing = false;
  #id = 0;
  #wave = 1;
  #damage = 5;
  #health = 100;
  #points = 0;
  #hpMultiplier = 1;
  #dmgMultiplier = 1;
  constructor() {
    this.enemies = [];
    this.enemyClasses = [];
    this.props = [];
    playerDamage.textContent = `Damage: ${this.#damage}`;
    playerHealth.textContent = `Health: ${this.#health}`;
  }

  // Checking if player is dead
  checkPlayerHealth() {
    if (this.#health <= 0) {
      console.log("You lost");
      this.#damage = 0;
      const intervalId = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);

      for (let i = 1; i < intervalId; i++) {
        window.clearInterval(i);
      }
    }
  }

  // Clearing all intervals
  clearIntervals() {
    const intervalId = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);

    for (let i = 1; i < intervalId; i++) {
      window.clearInterval(i);
    }
  }

  // Preparing props automatically
  prepareProp(classes) {
    let prop = document.createElement("div");
    classes.map((el) => prop.classList.add(el));
    game.append(prop);
    this.props.push(prop);
    return prop;
  }

  // Props removing function
  removeProps() {
    this.props.forEach((el) => {
      el.remove();
    });
    this.props = [];
  }
  // Creating props for other functions purposes
  prepareEnemyClasses() {
    // Basic enemy
    let basicProp = this.prepareProp(["basic", "prop"]);
    // Tank enemy
    let tankProp = this.prepareProp(["tank", "prop"]);

    // Creating enemy classlist with props
    this.enemyClasses = [
      {
        class: "Basic",
        width: basicProp.clientWidth,
        height: basicProp.clientHeight,
        health: 20,
        damage: 8,
        attackSpeed: 3,
        value: 4,
      },
      {
        class: "Tank",
        width: tankProp.clientWidth,
        height: tankProp.clientHeight,
        health: 35,
        damage: 9,
        attackSpeed: 5,
        value: 5,
      },
    ];
    // Removing props from game
    this.removeProps();
  }
  fixPropStats() {
    for (let i = 0; i < rpgGame.enemyClasses.length; i++) {
      let prop = rpgGame.enemyClasses[i];
      prop.health *= this.#hpMultiplier;
      prop.damage *= this.#dmgMultiplier;
      prop.health = +prop.health.toFixed(1);
      prop.damage = +prop.damage.toFixed(1);
    }
  }
  // Position generation function
  genPosition(chosenClass) {
    let margin = 5;
    let selectedClass = this.enemyClasses.find((el) => el.class === chosenClass);
    let width = Math.trunc(Math.random() * (window.innerWidth - selectedClass.height - margin - 5 + 1) + 5);
    let height = Math.trunc(Math.random() * (window.innerHeight - selectedClass.width - margin - 40 + 1) + 5);
    return [height, width];
  }
  // Enemy creation function
  createEnemy(enemyClass) {
    // Configuring enemy
    let selectedClass = this.enemyClasses.find((el) => el.class === enemyClass);
    let enemyData = JSON.parse(JSON.stringify(selectedClass));
    let enemy = document.createElement("div");

    const timer = document.createElement("p");
    timer.classList.add(`timer`);
    // ${enemyData.class.toLowerCase()}--
    timer.textContent = `  `;

    const health = document.createElement("p");
    health.classList.add(`healthPoints`);
    // ${enemyData.class.toLowerCase()}--
    health.textContent = `${selectedClass.health.toFixed(1)}/${enemyData.health.toFixed(1)}`;

    enemy.dataset.id = this.#id;
    enemyData.id = +enemy.dataset.id;
    this.#id++;

    // Damaging player
    enemyData.attack = setInterval(() => {
      if (this.#health > 0) {
        this.#health -= enemyData.damage;
        playerHealth.textContent = `Health: ${this.#health.toFixed(2)}`;
        this.checkPlayerHealth();
      }
    }, 1000 * enemyData.attackSpeed);

    enemyData.seconds = selectedClass.attackSpeed;
    let seconds = selectedClass.attackSpeed;

    // Casting shadow when enemy is close to attack
    enemyData.attackTimer = setInterval(() => {
      seconds -= 0.1;
      timer.textContent = seconds.toFixed(1);
      if (seconds <= enemyData.attackSpeed / 2) {
        document.querySelector(`[data-id="${enemyData.id}"]`).style.boxShadow = "0px 0px 7px 3px red";
      } else if (seconds > enemyData.attackSpeed / 2) {
        document.querySelector(`[data-id="${enemyData.id}"]`).style.boxShadow = "";
      }
    }, 100);

    enemyData.resetTimer = setInterval(() => {
      seconds = enemyData.attackSpeed;
    }, 1000 * enemyData.attackSpeed);

    enemy.classList.add(enemyClass.toLowerCase());

    // Setting enemy position
    let pos = this.genPosition(enemyClass);
    enemy.style.top = `${pos[0]}px`;
    enemy.style.left = `${pos[1]}px`;

    // Pushing data about enemy to enemy array
    this.enemies.push(enemyData);

    // Displaying enemy on screen
    enemy.append(health);
    enemy.append(timer);
    game.append(enemy);
  }
  // Attacking enemy function
  attackEnemy(id) {
    let attackedEnemy = rpgGame.enemies.find((el) => el.id == id);
    if (attackedEnemy == undefined) return;

    let attackedEnemyHP = document.querySelector(`[data-id="${attackedEnemy.id}"]`).firstChild;
    let enemyData = this.enemyClasses.find((enemy) => enemy.class === attackedEnemy.class);
    let maxHP = enemyData.health;

    // Damaging enemy
    if (attackedEnemy.health > 0) {
      attackedEnemy.health -= this.#damage;
      attackedEnemyHP.textContent = `${attackedEnemy.health.toFixed(1)}/${maxHP.toFixed(1)}`;
    }
    // Killing enemy mechanics
    if (attackedEnemy.health <= 0) {
      this.#points += +attackedEnemy.value;
      points.textContent = `Points: ${this.#points}`;
      clearInterval(this.enemies[this.enemies.indexOf(attackedEnemy)].attack);
      clearInterval(this.enemies[this.enemies.indexOf(attackedEnemy)].attackTimer);
      clearInterval(this.enemies[this.enemies.indexOf(attackedEnemy)].resetTimer);
      this.enemies = this.enemies.filter((el) => el.id !== attackedEnemy.id);
      document.querySelector(`[data-id="${attackedEnemy.id}"]`).remove();
    }
  }
  // Shop toggling function
  toggleShop() {
    if (this.#waveOnGoing) return;
    shopMenu.classList.toggle("hidden");
  }

  // Destroying all enemies that are stil alive
  killAllEnemies() {
    for (let i = 0; i < rpgGame.enemies.length; i++) {
      let enemy = rpgGame.enemies[i];
      clearInterval(this.enemies[this.enemies.indexOf(enemy)].attack);
      clearInterval(this.enemies[this.enemies.indexOf(enemy)].attackTimer);
      clearInterval(this.enemies[this.enemies.indexOf(enemy)].resetTimer);
      document.querySelector(`[data-id="${enemy.id}"]`).remove();
    }
    this.enemies = [];
  }
  startWave() {
    // Wave timer
    let time = 30;
    waveTimer.textContent = `Wave  ${this.#wave}  ending in: ${time}`;
    waveTimer.classList.toggle("hidden");

    let waveTimerInterval = setInterval(() => {
      waveTimer.textContent = `Wave  ${this.#wave}  ending in: ${time - 1}`;
      time--;
    }, 1000);

    this.#waveOnGoing = true;
    start.remove();

    // Summoning enemies during wave
    let available = [];
    for (let i = 0; i < rpgGame.enemyClasses.length; i++) {
      available.push(rpgGame.enemyClasses[i].class);
    }

    let amountOfSummoned = 2;
    if (this.#wave % 25 === 0) {
      amountOfSummoned++;
    }

    // Summoning enemies while wave is running
    let summoningTimer = setInterval(() => {
      if (+Math.random().toFixed(1) === 0.5) {
        for (let i = 0; i < amountOfSummoned; i++) {
          setTimeout(() => {
            this.createEnemy("Basic");
            this.createEnemy("Tank");
          }, 500 * Math.random() * 2);
        }
      } else {
        for (let i = 0; i < amountOfSummoned; i++) {
          setTimeout(() => {
            this.createEnemy(available[Math.trunc(Math.random() * (1 - 0 + 1) + 0)]);
          }, 500 * Math.random() * 2);
        }
      }
    }, (time * 1000) / 10);

    // Ending wave
    let timer = setTimeout(() => {
      this.killAllEnemies();
      this.clearIntervals();
      // clearInterval(summoningTimer);
      // clearInterval(waveTimerInterval);
      waveTimer.classList.toggle("hidden");
      this.#waveOnGoing = false;
      ready.classList.toggle("hidden");
      this.#wave++;
    }, time * 1000);
  }

  readyForWave() {
    if (this.#waveOnGoing) return;
    // Game scalling with time
    if (this.#wave % 5 === 0) {
      this.#dmgMultiplier += 0.05;
      this.#hpMultiplier += 0.1;
      this.#dmgMultiplier = +this.#dmgMultiplier.toFixed(2);
      this.#hpMultiplier = +this.#hpMultiplier.toFixed(2);
      this.fixPropStats();
    }

    ready.classList.toggle("hidden");
    this.#waveOnGoing = true;

    // Disabling shop during wave
    if (!shopMenu.classList.contains("hidden")) {
      shopMenu.classList.toggle("hidden");
    }

    // Start timer
    let time = 5;
    waveTimer.textContent = `Wave  ${this.#wave}  starting in: ${time}`;
    waveTimer.classList.toggle("hidden");
    let waveTimerInterval = setInterval(() => {
      waveTimer.textContent = `Wave  ${this.#wave}  starting in: ${time - 1}`;
      time--;
    }, 1000);

    // Starting next wave
    setTimeout(() => {
      clearInterval(waveTimerInterval);
      waveTimer.classList.toggle("hidden");
      wave.textContent = `Current wave: ${this.#wave}`;
      this.startWave();
    }, 5000);
  }
}

const rpgGame = new App();

window.addEventListener("click", function (e) {
  // console.log(e.target.classList.contains("healthPoints"));
  if (e.target.dataset.id) {
    rpgGame.attackEnemy(e.target.dataset.id);
  } else if (e.target.classList.contains("healthPoints") || e.target.classList.contains("timer")) {
    rpgGame.attackEnemy(e.target.closest("div").dataset.id);
  }
});

let summonGroup = function (basicAmount, tankAmount) {
  for (let i = 0; i < basicAmount; i++) {
    setTimeout(() => {
      rpgGame.createEnemy("Basic");
    }, 1000 * (Math.random() * 2));
  }
  for (let i = 0; i < tankAmount; i++) {
    setTimeout(() => {
      rpgGame.createEnemy("Tank");
    }, 1000 * (Math.random() * 2));
  }
};

shop.addEventListener("click", rpgGame.toggleShop.bind(rpgGame));
ready.addEventListener("click", rpgGame.readyForWave.bind(rpgGame));
////////////////////////////////////////////////////////////////

// let seconds = 1;

start.addEventListener("click", function () {
  rpgGame.prepareEnemyClasses();
  rpgGame.startWave();

  // setInterval(() => {
  //   summonGroup(Math.trunc(Math.random() * (5 - 0 + 1) + 0), Math.trunc(Math.random() * (5 - 0 + 1) + 0));
  // }, 3500);
});

rpgGame.prepareEnemyClasses();

let x = () => {
  summonGroup(1, 1);
};
