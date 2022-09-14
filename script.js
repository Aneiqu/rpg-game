"use strict";
const game = document.querySelector(".game");
const points = document.querySelector(".points");
const playerHealth = document.querySelector(".health");
const shop = document.querySelector(".shop");
const shopMenu = document.querySelector(".shop--menu");
const playerDamage = document.querySelector(".damage");
const start = document.querySelector(".start");
const wave = document.querySelector(".wave");
const ready = document.querySelector(".ready");
class App {
  #waveOnGoing = false;
  #id = 0;
  #wave = 1;
  #damage = 100;
  #health = 100;
  #points = 0;
  #hpMultiplier = 1.05;
  #dmgMultiplier = 1.05;
  constructor() {
    this.enemies = [];
    this.enemyClasses = [];
    this.props = [];
    playerDamage.textContent = `Damage: ${this.#damage}`;
    playerHealth.textContent = `Health: ${this.#health}`;
  }

  checkPlayerHealth() {
    if (this.#health <= 0) {
      console.log("You lost");
      this.#damage = 100;
      const intervalId = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);

      for (let i = 1; i < intervalId; i++) {
        window.clearInterval(i);
      }
    }
  }
  clearIntervals() {
    const intervalId = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);

    for (let i = 1; i < intervalId; i++) {
      window.clearInterval(i);
    }
  }

  prepareProp(classes) {
    let prop = document.createElement("div");
    classes.map((el) => prop.classList.add(el));
    game.append(prop);
    this.props.push(prop);
    return prop;
  }
  removeProps() {
    this.props.forEach((el) => {
      el.remove();
    });
    this.props = [];
  }
  prepareEnemyClasses() {
    // Basic enemy
    let basicProp = this.prepareProp(["basic", "prop"]);
    // Tank enemy
    let tankProp = this.prepareProp(["tank", "prop"]);
    this.enemyClasses = [
      {
        class: "Basic",
        width: basicProp.clientWidth,
        height: basicProp.clientHeight,
        health: 100 * this.#hpMultiplier,
        damage: 8 * this.#dmgMultiplier,
        attackSpeed: 3,
        value: 10,
      },
      {
        class: "Tank",
        width: tankProp.clientWidth,
        height: tankProp.clientHeight,
        health: 160 * this.#hpMultiplier,
        damage: 9 * this.#dmgMultiplier,
        attackSpeed: 5,
        value: 12,
      },
    ];
    this.removeProps();
  }
  genPosition(chosenClass) {
    let margin = 5;
    let selectedClass = this.enemyClasses.find((el) => el.class === chosenClass);
    let width = Math.trunc(Math.random() * (window.innerWidth - selectedClass.height - margin - 5 + 1) + 5);
    let height = Math.trunc(Math.random() * (window.innerHeight - selectedClass.width - margin - 40 + 1) + 5);
    return [height, width];
  }
  createEnemy(enemyClass) {
    let selectedClass = this.enemyClasses.find((el) => el.class === enemyClass);
    let enemyData = JSON.parse(JSON.stringify(selectedClass));
    let enemy = document.createElement("div");

    const timer = document.createElement("p");
    timer.classList.add("timer");

    timer.textContent = `  `;

    const health = document.createElement("p");
    health.classList.add("healthPoints");

    health.textContent = `${selectedClass.health}/${enemyData.health}`;

    enemy.dataset.id = this.#id;
    enemyData.id = +enemy.dataset.id;
    this.#id++;

    enemyData.attack = setInterval(() => {
      if (this.#health > 0) {
        this.#health -= enemyData.damage;
        playerHealth.textContent = `Health: ${this.#health.toFixed(2)}`;
        this.checkPlayerHealth();
      }
    }, 1000 * enemyData.attackSpeed);

    enemyData.seconds = selectedClass.attackSpeed;
    let seconds = selectedClass.attackSpeed;

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

    let pos = this.genPosition(enemyClass);
    enemy.style.top = `${pos[0]}px`;
    enemy.style.left = `${pos[1]}px`;

    this.enemies.push(enemyData);
    enemy.append(timer);
    enemy.append(health);
    game.append(enemy);
  }
  attackEnemy(id) {
    let attackedEnemy = rpgGame.enemies.find((el) => el.id == id);
    if (attackedEnemy == undefined) return;

    let attackedEnemyHP = document.querySelector(`[data-id="${attackedEnemy.id}"]`).lastChild;
    let enemyData = this.enemyClasses.find((enemy) => enemy.class === attackedEnemy.class);
    let maxHP = enemyData.health;

    if (attackedEnemy.health > 0) {
      attackedEnemy.health -= this.#damage;
      attackedEnemyHP.textContent = `${attackedEnemy.health}/${maxHP}`;
    } else if (attackedEnemy.health <= 0) {
      this.#points += +attackedEnemy.value;
      points.textContent = this.#points;
      clearInterval(this.enemies[this.enemies.indexOf(attackedEnemy)].attack);
      this.enemies = this.enemies.filter((el) => el.id !== attackedEnemy.id);
      document.querySelector(`[data-id="${attackedEnemy.id}"]`).remove();
    }
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
  toggleShop() {
    if (this.#waveOnGoing) return;
    shopMenu.classList.toggle("hidden");
  }
  startWave() {
    start.remove();
    this.#waveOnGoing = true;
    let time = 5;
    let timer = setTimeout(() => {
      this.#waveOnGoing = false;
    }, time * 1000);
  }
  readyForWave() {
    setTimeout(() => {
      console.log("Brake ended");
      if (!shopMenu.classList.contains("hidden")) {
        shopMenu.classList.toggle("hidden");
      }
      this.#wave++;
      wave.textContent = `Wave: ${this.#wave}`;
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
