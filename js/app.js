const cardModel = {
    cardArray: [
        'fa-anchor',
        'fa-anchor',
        'fa-bicycle',
        'fa-bicycle',
        'fa-bolt',
        'fa-bolt',
        'fa-bomb',
        'fa-bomb',
        'fa-cube',
        'fa-cube',
        'fa-diamond',
        'fa-diamond',
        'fa-leaf',
        'fa-leaf',
        'fa-paper-plane-o',
        'fa-paper-plane-o'
    ],
    click: 0,
    wait: null,
    now: null,
    openCard: [],
    timer:null,
    move: 0,
    match: 0
};


const control = {
    init() {
        cardView.init();
        scoreBoardView.init();
    },
    // 洗牌函数来自于 http://stackoverflow.com/a/2450976
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    // 生成li
    showCardLi(card) {
        const that = this;
        let cards = that.shuffle(card);
        const result = document.createDocumentFragment();
        for (let icon of cards) {
            let li = document.createElement('li');
            li.className = "card";
            li.innerHTML = `<i class="fa ${icon}"></i>`;
            result.appendChild(li);
        }
        return result;
    },
    // 显示卡牌
    clickCard(card) {
        card.classList.add('show', 'open');
    },
    // 加入open 数组
    pushOpenArray(card) {
        // (card.classList.contains('open')) && (cardModel.openCard.push(card));
        cardModel.openCard[(cardModel.click + 1) % 2] = card.childNodes[0].className;
    },
    // 清除数组数据
    clearOpenArray() {
        (cardModel.openCard.length === 2) && (cardModel.openCard = []);
    },
    // 匹配卡牌
    testMatchCard(card, array) {
        let className1, className2;
        if (array.length === 2 && card.localName === "li") {
            cardModel.now = card;
            if (array[0] === array[1]) {
                cardModel.now.className = "card show match";
                cardModel.wait.className = "card show match";
                cardModel.match++;
            } else {
                cardModel.now.className = "card show dismatch";
                cardModel.wait.className = "card show dismatch";
                if (card.className.includes('dismatch')) {
                    let out1 = cardModel.now;
                    let out2 = cardModel.wait;
                    setTimeout(() => {
                        out1.className = "card";
                        out2.className = "card";
                    }, 500)
                }
            }
        } else if (array.length === 1 && card.localName === "li") {
            cardModel.wait = card;
        }
    },
    // 步数
    addMoves() {
        const move = document.getElementsByClassName('moves');
        move[0].textContent++;
        move[1].textContent++;
        cardModel.move++;

    },
    // 开始计时
    starTimer() {
        const time = document.getElementsByClassName('seconds');
        cardModel.timer = setInterval(() => {
            time[0].textContent++;
            time[1].textContent++;
        },1000)
    },
    // 加减星星
    removeStar() {
        const starts = document.getElementsByClassName('stars');
        starts[0].removeChild(starts[0].childNodes[0]);
        starts[1].removeChild(starts[1].childNodes[0])
    },
    gameComplete() {
        const result = document.getElementsByClassName('result');
        setTimeout(() => {
            result[0].style.top = "30%";
        },500)
    }



};


const cardView = {
    init() {
        this.view = document.getElementsByClassName('deck');
        this.render();
    },
    render() {
        // 将对象生成li数组
        const allLi = control.showCardLi(cardModel.cardArray);
        // 将卡牌数组写入页面
        this.view[0].appendChild(allLi);

        document
            .querySelector('.deck')
            .addEventListener('click', function (e) {
                const card = e.target;
                if (card.localName === 'li' && card.className === "card") {
                    // 计数
                    cardModel.click++;
                    // 点击显示卡片
                    control.clickCard(card);
                    // 清空open组
                    control.clearOpenArray();
                    // 加入open组
                    control.pushOpenArray(card);
                    // 匹配卡牌
                    control.testMatchCard(card, cardModel.openCard);
                }
            })
    }
};


const scoreBoardView = {
  init() {
      this.restart = document.getElementsByClassName('restart');
      this.playAgain = document.getElementsByClassName('play-again');

      this.render();

      this.restart[0].onclick = () => {location.reload()};
      this.playAgain[0].onclick = () => {location.reload()};

  },
  render() {
      document
          .querySelector('.deck')
          .addEventListener('click', function () {
              // 开始时间
              if (cardModel.click === 1) {
                  control.starTimer();
              }
              // 计算步数
              if (cardModel.click % 2 === 0) {
                  control.addMoves();
              }
              // 根据步数扣除星星
              (cardModel.move === 3) && (control.removeStar());
              (cardModel.move === 5) && (control.removeStar());
              // 全部匹配后
              if (cardModel.match === 8) {
                  clearInterval(cardModel.timer);
                  control.gameComplete();
              }
          })

  }
};


control.init();
