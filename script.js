// グローバル変数
let firstNumber; // 最初の数
let secondNumber; // 2番目の数
let operator; // 演算子（+または-）
let correctAnswer; // 正解
let correctCount = 0; // 正解数カウンター

// 電車のフィルター用の値の配列
const trainFilters = [
    'hue-rotate(0deg)',    // 通常色
    'hue-rotate(60deg)',   // 黄色っぽい
    'hue-rotate(120deg)',  // 緑っぽい
    'hue-rotate(180deg)',  // 青緑っぽい
    'hue-rotate(240deg)',  // 青っぽい
    'hue-rotate(300deg)',  // 紫っぽい
    'saturate(2)',         // 彩度を上げる
    'brightness(1.2)',     // 明るめ
    'brightness(0.8) hue-rotate(30deg)', // 暗めでちょっと色変化
    'contrast(1.2) hue-rotate(330deg)'   // コントラスト高めで色変化
];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // 最初の問題を生成
    generateProblem();
    
    // 「次の問題」ボタンのイベントリスナー
    document.getElementById('nextButton').addEventListener('click', function() {
        // ボタンクリックエフェクト
        this.classList.add('button-click');
        setTimeout(() => {
            this.classList.remove('button-click');
        }, 200);
        
        // 次の問題を生成
        generateProblem();
    });
});

// 問題を生成する関数
function generateProblem() {
    // フィードバックをクリア
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    // ランダムに演算子を選択（+または-）
    operator = Math.random() < 0.5 ? '+' : '-';
    
    if (operator === '+') {
        // 足し算の問題
        firstNumber = Math.floor(Math.random() * 5) + 1; // 1〜5
        secondNumber = Math.floor(Math.random() * 5) + 1; // 1〜5
        correctAnswer = firstNumber + secondNumber;
    } else {
        // 引き算の問題（答えが負にならないように）
        firstNumber = Math.floor(Math.random() * 5) + 5; // 5〜9
        secondNumber = Math.floor(Math.random() * firstNumber); // 0〜firstNumber-1
        correctAnswer = firstNumber - secondNumber;
    }
    
    // 画面に問題を表示
    document.getElementById('firstNumber').textContent = firstNumber;
    document.getElementById('operator').textContent = operator;
    document.getElementById('secondNumber').textContent = secondNumber;
    document.getElementById('operatorVisual').textContent = operator;
    
    // 電車イラストを表示
    displayTrains();
    
    // 選択肢を生成
    generateOptions();
}

// 電車イラストを表示する関数
function displayTrains() {
    const firstTrainGroup = document.getElementById('firstTrainGroup');
    const secondTrainGroup = document.getElementById('secondTrainGroup');
    
    // 既存の電車をクリア
    firstTrainGroup.innerHTML = '';
    secondTrainGroup.innerHTML = '';
    
    // ランダムなフィルターを選択
    const firstFilter = trainFilters[Math.floor(Math.random() * trainFilters.length)];
    const secondFilter = trainFilters[Math.floor(Math.random() * trainFilters.length)];
    
    // 1つ目の数の電車を表示
    for (let i = 0; i < firstNumber; i++) {
        const train = createTrainElement(firstFilter);
        train.classList.add('train-animation');
        // アニメーションを少しずらして連なって表示されるように
        train.style.animationDelay = `${i * 0.1}s`;
        firstTrainGroup.appendChild(train);
    }
    
    // 2つ目の数の電車を表示
    for (let i = 0; i < secondNumber; i++) {
        const train = createTrainElement(secondFilter);
        train.classList.add('train-animation');
        train.style.animationDelay = `${i * 0.1}s`;
        secondTrainGroup.appendChild(train);
    }
}

// 電車の要素を作成する関数
function createTrainElement(filter) {
    const train = document.createElement('img');
    train.setAttribute('class', 'train');
    train.setAttribute('src', 'images/train.svg');  // SVG形式の画像を使用
    train.setAttribute('alt', '電車');
    train.style.filter = filter;
    
    return train;
}

// 選択肢を生成する関数
function generateOptions() {
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // 既存の選択肢をクリア
    
    // 選択肢の配列を作成（正解を含む）
    let options = [correctAnswer];
    
    // 正解の近い数字を選択肢に入れる（より子供向け）
    while (options.length < 4) {
        // -1, +1, -2, +2 などの近い数字を選択肢に
        let offset = Math.floor(Math.random() * 5) - 2; // -2〜2のランダムな数
        let newOption = correctAnswer + offset;
        
        // 0以上10未満で、まだ選択肢にない数字のみ追加
        if (newOption >= 0 && newOption < 10 && !options.includes(newOption) && newOption !== correctAnswer) {
            options.push(newOption);
        }
    }
    
    // 選択肢をシャッフル
    options = shuffleArray(options);
    
    // 選択肢をボタンとして表示
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option-button';
        
        // クリックイベント
        button.addEventListener('click', function() {
            // ボタンクリックエフェクト
            this.classList.add('button-click');
            setTimeout(() => {
                this.classList.remove('button-click');
            }, 200);
            
            checkAnswer(option);
        });
        
        optionsContainer.appendChild(button);
    });
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 回答をチェックする関数
function checkAnswer(selectedAnswer) {
    const feedback = document.getElementById('feedback');
    
    if (selectedAnswer === correctAnswer) {
        // 正解の場合
        feedback.textContent = 'せいかい！';
        feedback.className = 'feedback correct';
        
        // 正解音を再生
        const correctSound = document.getElementById('correctSound');
        correctSound.currentTime = 0; // 音声を最初から再生
        correctSound.play();
        
        // 正解カウントを増やす
        correctCount++;
        document.getElementById('correctCount').textContent = correctCount;
        
        // 電車を喜ばせるアニメーション
        const trains = document.querySelectorAll('.train');
        trains.forEach((train, index) => {
            setTimeout(() => {
                train.style.animation = 'bounce 0.8s ease';
            }, index * 50);
        });
        
        // 1.5秒後に次の問題へ
        setTimeout(generateProblem, 1500);
    } else {
        // 不正解の場合
        feedback.textContent = 'ざんねん...もういちど！';
        feedback.className = 'feedback incorrect';
        
        // 不正解音を再生
        const incorrectSound = document.getElementById('incorrectSound');
        incorrectSound.currentTime = 0; // 音声を最初から再生
        incorrectSound.play();
        
        // 電車を悲しませるアニメーション
        const trains = document.querySelectorAll('.train');
        trains.forEach(train => {
            train.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                train.style.animation = '';
            }, 500);
        });
    }
}
