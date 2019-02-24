// 卡牌数据
const cardModel = {
    cardArray: [
        'fa-anchor', 'fa-anchor',
        'fa-bicycle', 'fa-bicycle',
        'fa-bolt', 'fa-bolt',
        'fa-bomb', 'fa-bomb',
        'fa-cube', 'fa-cube',
        'fa-diamond', 'fa-diamond',
        'fa-leaf', 'fa-leaf',
        'fa-paper-plane-o', 'fa-paper-plane-o'
    ],
    openCard: [],
    clickCount: 0,
    card1: null,
    card2: null,
    name1: null,
    name2: null,
    timer: null,
    match: 0,
    move: 0
};
// 章鱼
const gameControl = {
    init() {
        cardView.init();
        cardScoringView.init();
    },
    // 洗牌
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
    // 初始化卡牌到界面
    initCard(cardArray, view) {
        for (let card of cardArray) {
            let li = document.createElement('li');
            li.innerHTML = `<i class="fa ${card}"></i>`;
            li.className = "card";
            view.appendChild(li);
        }
    },
    // 显示开牌 状态 open
    showCard(card) {
        card.className === 'card' ? card.className = "card show open" : false;
    },
    // 点击的开牌加入数组中做检查
    addArray(card) {
        cardModel.openCard[(cardModel.clickCount + 1) % 2] = card.childNodes[0].className;
    },
    // 当数组中有2个清空数组
    clearOpenCard() {
        (cardModel.openCard.length === 2) && (cardModel.openCard = []);
    },
    // 测试卡牌是否匹配 匹配则加入类 match， 不匹配则加入类dismatch
    testCard(card,) {
        const open = cardModel.openCard;
        if (open.length === 2 && card.nodeName === 'LI') {
            cardModel.card2 = card;
            cardModel.name2 = card.childNodes[0].className;
            if (cardModel.name1 === cardModel.name2) {
                cardModel.card1.className = "card show match";
                cardModel.card2.className = "card show match";
                cardModel.match++;
            } else {
                cardModel.card1.className = "card show dismatch";
                cardModel.card2.className = "card show dismatch";
                if (card.className.includes("dismatch")) {
                    let out1 = cardModel.card1;
                    let out2 = cardModel.card2;
                    setTimeout(function () {
                        out1.className = "card";
                        out2.className = "card";
                    }, 1000)
                }
            }
        } else if (open.length === 1 && card.nodeName === 'LI') {
            cardModel.card1 = card;
            cardModel.name1 = card.childNodes[0].className;
        }
    },
    // 计时开始
    starTime(time, num) {
        if (cardModel.clickCount === num) {
            cardModel.timer = setInterval(function () {
                const view = document.querySelectorAll('.seconds');
                view[0].innerText++;
                view[1].innerText++;
            }, 1000)
        }
    },
    // 计算步数 点2下为1步，以此类推
    moveStep(move) {
        move.innerText++;
    },
    // 删除星星 14扣1星， 20步在扣一星，默认最低剩下一颗星
    removeStar(moves,start) {
        if (moves.innerText === '14') {
            start.removeChild(start.childNodes[0])
        } else if (moves.innerText === "20"){
            start.removeChild(start.childNodes[0])
        }
    },
    // 重置游戏
    resetGame(reset) {
        reset.onclick = () => location.reload();
    },
    // 游戏结束界面
    gameCompletion() {
        setTimeout(function () {
            const result = document.querySelector(".result");
            result.style.top = "30%";
        }, 500)
    }
};

// 计分板界面
const cardScoringView = {
    init() {
        this.time = cardModel.timer;
        this.move = cardModel.move;
        this.restart = document.querySelector('.restart');
        this.playAgain = document.querySelector(".play-again");
        this.render();
        // 重置游戏
        gameControl.resetGame(this.restart);
        gameControl.resetGame(this.playAgain);
    },
    render() {
        const moves = document.querySelectorAll('.moves');
        const stars = document.querySelectorAll('.stars');
        document
            .querySelector(".deck")
            .addEventListener("click", function () {
                //开始计算时间
                gameControl.starTime(this.time, 1);
                // 2下为1步。以此类推
                if (cardModel.clickCount % 2 === 0 ) {
                    gameControl.moveStep(moves[0]);
                    gameControl.moveStep(moves[1]);
                    this.move++;
                }
                // 根据规则扣除星星
                gameControl.removeStar(moves[0],stars[0]);
                gameControl.removeStar(moves[1],stars[1]);
                // 当全部匹配完之后
                if (cardModel.match === cardModel.cardArray.length / 2) {
                    clearInterval(cardModel.timer);
                    gameControl.gameCompletion();
                }
            })
    }
};
// 卡牌界面
const cardView = {
    init() {
        this.view = document.querySelector(".deck");
        this.cardArray = gameControl.shuffle(cardModel.cardArray);
        this.render();
    },
    render() {
        // 初始化卡牌
        gameControl.initCard(this.cardArray, this.view);
        document
            .querySelector('.deck')
            .addEventListener('click', (e) => {
                if (e.target.className === 'card') {
                    console.log(e.target);
                    const card = e.target;
                    cardModel.clickCount++;
                    // 显示卡牌
                    gameControl.showCard(card);
                    // 清空卡牌
                    gameControl.clearOpenCard();
                    // 将点击的卡牌加入 openCard数组中
                    gameControl.addArray(card);
                    // 检查卡牌是否匹配
                    gameControl.testCard(card);
                }
            })
    }
};


gameControl.init();
