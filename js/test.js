//卡片数组
var cardArray = [
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
];

//指定DOM
const deck = document.querySelector('.deck');
const moves = document.querySelectorAll('.moves');
const seconds = document.querySelectorAll('.seconds');
const restart = document.querySelector('.restart');
const result = document.querySelector('.result');
const playAgain = document.querySelector('.play-again');
let stars = document.querySelectorAll('.stars');

//临时存放两个对比卡片
let openCard = [];
//点击次数
let currentClick = 0;
//存放计时器setInterval的ID
let sivId;
//匹配次数；
let cardMatch = 0;

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//创建卡片元素，随机
function displayCard(card) {
    const cardList = shuffle(card);
    for(let x = 0; x < cardList.length; x++) {
        let li = document.createElement('li');
        li.className = 'card';
        li.innerHTML = `<i class="fa ${cardList[x]}"></i>`;
        deck.appendChild(li);
    }
}

//创建卡牌匹配事件

function clickCard() {
    //创建变量，作为对比开牌是否匹配
    let card1, card2;
    //创建变量，对比类名
    let cardName1, cardName2;
    const cardLi = deck.querySelectorAll('.card');
    for(let x = 0; x < cardLi.length; x++){
        cardLi[x].onclick = function () {
            if(this.className === 'card'){
                currentClick++;
                //开始计时
                if(currentClick === 1){
                    sivId = setInterval(function () {
                        seconds[0].innerText++;
                    },1000)
                }
                //点击超过14则2星，超过20下则只得1星，14下以内则3星
                if(moves[0].innerText === '14'){
                    removeStars(stars[0]);
                    removeStars(stars[1]);
                }else if(moves[0].innerText === '20'){
                    removeStars(stars[0]);
                    removeStars(stars[1])
                }
                //将目标加入 正确的类中
                this.className = 'card show open';
                //当数组中超过两个的时候清空，
                if(openCard.length === 2) {
                    openCard = [];

                }
                //点击2下为1步
                if(currentClick % 2 === 0) {
                    moves[0].innerText = currentClick / 2 ;
                    moves[1].innerText = currentClick / 2 ;
                }
                openCard[(currentClick + 1) % 2] = this.childNodes[0];
                //创建Card2 和 Card1，进行对比
                if(openCard.length === 2){
                    card2 = this;
                    cardName2 = this.childNodes[0].className.substr(3);
                    if(cardName1 === cardName2){
                        card1.className = 'card show match';
                        card2.className = 'card show match';
                        cardMatch++;
                        //当达到匹配次数则结束游戏
                        if(cardMatch === cardArray.length / 2){
                            if(sivId){
                                clearInterval(sivId);
                                seconds[1].innerText = seconds[0].innerText;
                            }
                            setTimeout(function () {
                                result.style.top = "30%";
                            },500)
                        }
                    }else {
                        card1.className = 'card show dismatch';
                        card2.className = 'card show dismatch';
                        if(this.className.includes('dismatch')){
                            let out1 = card1;
                            let out2 = card2;
                            setTimeout(function () {
                                out1.className = 'card';
                                out2.className = 'card';
                            },1000)
                        }
                    }
                    //创建 变量 Card1
                }else if(openCard.length === 1){
                    card1 = this;
                    cardName1 = this.childNodes[0].className.substr(3);
                }
            }
        }
    }
}

//重置游戏
function restartGame(button) {
    button.onclick = function () {
        location.reload();
    }
}
//移除星星
function removeStars(star) {
    star.removeChild(star.childNodes[0]);
}

//调用函数
displayCard(cardArray);
clickCard();
restartGame(restart);

// 游戏结束后弹窗
playAgain.onclick = function () {
    location.reload();
    setTimeout(function () {
        result.style.top = "-2000px";
    },1000)
};




