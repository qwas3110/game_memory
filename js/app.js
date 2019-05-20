
// 游戏数据属性
const model = {
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
    open: null,
    moves: 0,
    currentClick: 0,
    sivId: null,
    match: 0
};


// 控制--方法
const control = {
    //初始化
    init() {
        model.open = document.getElementsByClassName('open');
        view.init();
    },
    //洗牌
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
    // 渲染到页面
    displayCards(location) {
        let shuffleCard = this.shuffle(model.cardArray); // 洗牌
        let fragment = document.createDocumentFragment(); // 创建文档片段
        for (let card of shuffleCard) {
            let li = document.createElement('li');
            li.className = "card";
            li.innerHTML = `<i class="fa ${card}"></i>`;
            fragment.appendChild(li);
        }
        location.appendChild(fragment);
    },
    // 显示卡片的符号
    flipCarp(current) {
        let name = current.nodeName;
        let open = current.classList.contains('open');
        let match = current.classList.contains('match');
        model.open = document.getElementsByClassName('open');
        if (name === "LI" && !open && !match && model.open.length === 0) {
            current.classList.add('open','show');
            // 增加步数
            this.stepMoves();
            // 开始计时
            // this.calculatingTime();
        }
        else if (model.open.length === 1 && name === 'LI') {
            if (!match) {
                current.classList.add('open','show');
                this.stepMoves();
                // 检查是否匹配
                this.checkMatch()
            }
        }
    },
    // 步数计算
    stepMoves() {
        let moves = document.getElementsByClassName('moves');
        model.moves++;
        if (model.moves % 2 === 0) {
            moves[0].textContent++;
            moves[1].textContent++;
        }
    },
    // 检查是否匹配
    checkMatch() {
        if (model.open.length >= 2) {
            let card1 = model.open[0].childNodes[0].className;
            let card2 = model.open[1].childNodes[0].className;
            if (card1 === card2) {
                model.open[0].className = "card match";
                model.open[0].className = "card match";
                // 计算匹配成功次数
                model.match++;
            } else {
                model.open[0].classList.add('dismatch');
                model.open[1].classList.add('dismatch');
                setTimeout(() => {
                    model.open[0].className = "card";
                    model.open[0].className = "card";
                },500);
            }
        }
    },
    // 计算时间
    calculatingTime() {
        if (model.moves === 1) {
            model.sivId = setInterval(function () {
                let seconds = document.getElementsByClassName('seconds');
                seconds[0].textContent++;
                seconds[1].textContent++;
            },1000)
        }
        // 全部匹配则结束计时
        if (model.match === 8) {
            clearInterval(model.sivId);
        }
    },
    // 计算星星
    displayStars() {
         const startsArea = document.getElementsByClassName('stars');
         if (model.moves === 16 ) {
             startsArea[0].children[0].style.display = "none";
             startsArea[1].children[0].style.display = "none";
         }
         if (model.moves === 24) {
             startsArea[0].children[1].style.display = "none";
             startsArea[1].children[1].style.display = "none";

         }
         if (model.moves === 32) {
             startsArea[0].children[2].style.display = "none";
             startsArea[1].children[2].style.display = "none";

         }

    },
    // 重置游戏 - 刷新
    resetGame() {
        const reset = document.getElementsByClassName('restart');
        reset[0].onclick = () => location.reload();
        reset[1].onclick = () => location.reload();
    },
    // 完成游戏通知
    gameResult() {
        const result = document.getElementsByClassName('result');
        if (model.match === 8) {
            console.log("hello world");
            setTimeout(() => {
                result[0].style.top = '50%'
            },500)
        }
    }
};

// 游戏视图
const view = {
    init() {
        this.deck = document.getElementsByClassName('deck')[0];
        this.render();
    },
    render() {
        // 渲染到指定类
        control.displayCards(this.deck);
        this.deck
            .addEventListener('click', function (e) {
                // 显示卡牌
                control.flipCarp(e.target);
                // 计时
                control.calculatingTime();
                // 计算星星
                control.displayStars();
                // 游戏结束
                control.gameResult();
            });
        //重置游戏
        control.resetGame();
    }
};


// 运行
control.init();
