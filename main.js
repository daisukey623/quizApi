const getquizNum = document.getElementById('quizNum');
const getcategory = document.getElementById('category');
const getdifficulty = document.getElementById('difficulty');
const getquestion = document.getElementById('question');
const getanswers = document.getElementById('answers').children;

// スタート画面表示の関数
const getStart = () => {
  getquizNum.innerHTML = 'ようこそ';
  getcategory.innerHTML = '';
  getdifficulty.innerText = '';
  getquestion.innerHTML = '以下のボタンをクリック';
  getanswers[0].innerHTML = '開始';
  getanswers[1].style.display = 'none';
  getanswers[2].style.display = 'none';
  getanswers[3].style.display = 'none';

  document.getElementById('startClick').addEventListener('click', async (e) => {
    document.getElementById('startClick').removeAttribute('id');
    getanswers[0].style.display = 'none';
    waitApi();
    await getQuizArray();
  });
};

// スタート後、非同期処理中の表示の関数
const waitApi = () => {
  getquizNum.innerHTML = '取得中';
  getanswers[1].style.display = 'none';
  getcategory.innerHTML = '';
  getdifficulty.innerText = '';
  getquestion.innerHTML = '少々お待ちください';
};

// クイズ終了後、スタート画面表示の関数
const resetQuiz = () => {
  getquizNum.innerHTML = 'ようこそ';
  getcategory.innerHTML = '';
  getdifficulty.innerText = '';
  getquestion.innerHTML = '以下のボタンをクリック';
  getanswers[1].innerHTML = '開始';
  getanswers[1].setAttribute('id', 'resetClick');
  getanswers[1].style.display = 'block';
  getanswers[0].style.display = 'none';
  getanswers[2].style.display = 'none';
  getanswers[3].style.display = 'none';

  document.getElementById('resetClick').addEventListener('click', async (e) => {
    document.getElementById('resetClick').removeAttribute('id');
    getanswers[0].style.display = 'none';
    console.log('idをとります');
    waitApi();
    await getQuizArray();
  });
};

// クイズデータ取得
const getQuizArray = async () => {
  const url = 'https://opentdb.com/api.php?amount=10';
  let data;
  try {
    data = await (await fetch(url)).json();
  } catch (error) {
    console.log(`失敗しました => {error}`);
  }

  // クラス生成
  class Quiz {
    constructor() {
      this.quizIndex = 0;
      this.correctIndex = 0;
      this.quizArray = data.results;
      this.quizLength = data.results.length;
      this.quizNum = document.getElementById('quizNum');
      this.category = document.getElementById('category');
      this.difficulty = document.getElementById('difficulty');
      this.question = document.getElementById('question');
      this.answers = document.getElementById('answers').children;
    }
    // クイズセット
    setQuiz() {
      //  問題番号の書き換え
      this.quizNum.innerHTML = `問題${quiz.quizIndex + 1}`;
      //  ジャンルの書き換え
      this.category.innerHTML = `【ジャンル】${
        this.quizArray[quiz.quizIndex].category
      }`;
      //  難易度の書き換え
      this.difficulty.innerHTML = `【難易度】${
        this.quizArray[quiz.quizIndex].difficulty
      }`;
      //  質問の書き換え
      this.question.innerHTML = this.quizArray[quiz.quizIndex].question;
      //  答えの書き換え
      this.correct_answer = this.quizArray[quiz.quizIndex].correct_answer;
      this.incorrect_answers = this.quizArray[quiz.quizIndex].incorrect_answers;

      // anwer配列を一旦作る
      this.answersArray = [];
      for (let i = 0; i < this.answers.length; i++) {
        this.answersArray.push(
          this.quizArray[quiz.quizIndex].incorrect_answers[i]
        );
      }
      this.answersArray.splice(3, 1);
      this.answersArray.push(this.quizArray[quiz.quizIndex].correct_answer);
      this.fillteredArray = this.answersArray.filter((filteredAnswer) => {
        return filteredAnswer !== undefined;
      });
      this.shuffleArray = quiz.arrayShuffle(quiz.answersArray);

      // answerを整理して表示させる（answer数によって表示調整）
      for (let i = 0; i < quiz.shuffleArray.length; i++) {
        this.answers[i].style.display = 'block';
        this.answers[i].innerHTML = quiz.shuffleArray[i];
        if (this.answers[i].innerHTML === 'undefined') {
          this.answers[i].style.display = 'none';
        }
      }
    }

    // answer配列の中身をシャッフル関数
    arrayShuffle(array) {
      for (let i = array.length - 1; 0 < i; i--) {
        // 0〜(i+1)の範囲で値を取得
        let r = Math.floor(Math.random() * (i + 1));
        // 要素の並び替えを実行
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
      }
      return array;
    }

    // クイズ結果の表示
    quizResult() {
      getquizNum.innerHTML = `あなたの正解数は${quiz.correctIndex}です！！`;
      getcategory.innerHTML = '';
      getdifficulty.innerText = '';
      getquestion.innerHTML = '再度チャレンジしたい場合は以下をクリック！！';
      getanswers[0].innerHTML = 'ホームに戻る';

      getanswers[0].style.display = 'block';
      getanswers[1].style.display = 'none';
      getanswers[2].style.display = 'none';
      getanswers[3].style.display = 'none';

      getanswers[0].addEventListener('click', (e) => {
        console.log('リセットクリック');
        resetQuiz();
      });
    }

    // クリック発生すれば、次のイベントへ進む
    buttonClick = () => {
      document.getElementById('answers').addEventListener('click', (e) => {
        const target = e.target.innerHTML;
        if (target === quiz.quizArray[quiz.quizIndex].correct_answer) {
          console.log('正解');
          quiz.correctIndex++;
        } else {
          console.log('不正解');
        }
        quiz.quizIndex++;
        if (quiz.quizIndex < quiz.quizLength) {
          quiz.setQuiz();
        } else {
          console.log('クイズ終わり');
          quiz.quizResult();
        }
      });
    };
  }

  // インスタンス生成
  const quiz = new Quiz();
  // クイズをセットし、表示させる
  quiz.setQuiz();
  quiz.buttonClick();
};

getStart();
