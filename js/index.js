/**
メインとなる処理を記述するjsファイル。キーボードから受けた処理などを記述している。結果の表示などはviewresult.jsにて
**/

/**
 * !!!!!!!このコードを見ている人へ!!!!!!!
 * このファイルを含め、「平均値を求めるアプリjs版」アプリに関わるコード全ては"著作権フリー"です。参考にしてパクってもらって構いませんが、自作発言だけはしないようお願いします。
 * また、このアプリのプログラムの著作権は全て製作者が保有しています。
 * なお、このアプリのコードはなるべくコメントをして、初心者にもわかりやすいようにしています。本来コードを書く上でこんなコード必要ないとは思いますが、念のため書いています。参考までに。
**/

var input_number =[];       //ユーザーが入力している数
var ctrl_switch = false;        //ctrlキーを押されたか
var view = 0;       //表示している値（入力値）
var view_str = "";      //表示する専用の文字列
var confirm_list = [];      //ユーザが確定した数値の配列
var choice_point = -1;      //削除するデータのindex
var change = false;
var stack = 0;
var move = false;
var delete_num = -1;
var all_delete = false;
var is_decimal = false;
var once = false;
var decimal_index = 0;
var view_digit = false;
var push_button = false;

function handleTouchMove(event) {       //ディスプレイに関するイベント
    event.preventDefault();
}

function ViewError(comment){        //何かしらのエラーが出た際、UIによってユーザに伝える必要がある場合の関数
    document.getElementById("error_co").innerHTML = comment;        //引数のコメントの表示
    setTimeout(function(){
        document.getElementById("error_co").innerHTML = "";     //3000msたったら元に戻す
    },3000);        //3000ミリ秒（3秒）間表示
}

function ViewAtt(comment){      //何かしらの例外処理が出た際、UIによってユーザに伝える必要がある場合の関数
    document.getElementById("error_att").innerHTML = comment;        //引数のコメントの表示
    setTimeout(function(){
        document.getElementById("error_att").innerHTML = "";     //10000msたったら元に戻す
    },10000);        //10000ミリ秒（10秒）間表示
}

function CheckNum(number){      //入力値が適切か判断し、コードを返す関数
/*
1~：何かしらのエラー
0：正常
1~9：正常ではあるが何かしらの対処をしなくてはエラーを出しかねない場合
*/
    if(decimal_index == 0){     //もしも小数点が打たれていなかったら（＝もしも整数のみだったら）
        if(input_number.length >= 7){       //長さが7桁以上なら
            return 11;      //エラーコードを返す
        }
    }else{      //もしも小数があったら
        if(input_number.slice(decimal_index + 1).length >= 4){      //もしも小数部分の長さが4桁以上なら
            return 11;      //エラーコードを返す
        }
    }
    if(number == "." && input_number.length == 0){      //もしも最初が小数点の場合
        return 1;       //何かしらの対処をする
    }
    if(number == "." && input_number.indexOf(".") != -1){       //もしも既に小数点があるのにさらに入力したら
        return 12;
    }
    if(number == 0 && input_number.length == 0){        //もしも最初から0を押したら
        return 2;
    }
    if(input_number[0] == 0 && number != "." && input_number.indexOf(".") == -1){       //もしも最初に0があるのに数字を打とうとしたら
        return 3;
    }
    return 0;       //その他の場合は正常
}

function NumberView(){      //入力値の表示を行う関数
    console.log(input_number);
    var len = input_number.length;      //入力された数値の長さ
    var decimal = 0;        //小数部分の長さ
    view = 0;       //ユーザの入力値（数値）
    view_str = "";      //ユーザの入力値（文字列）
    var decimal_list = [];      //小数部分の数をいれる配列
    for(i = 0;i < len;i++){     //表示する桁に変換
        if(input_number[i] == "."){     //もしiが小数点だったら
            console.log("ここ通過");
            is_decimal = true;      //小数がある
            decimal_list = input_number.slice(i + 1);       //input_numberから小数点よりあとの数値（＝小数部分）をdecimal_listに代入
            decimal_index = i;      //小数点があるindexを記憶
            view_str = view_str + ".";      //小数点を追加
            continue;
        }
        if(is_decimal　&& i >= decimal_index){     //もし小数が含まれていてかつiが小数点位置より後なら（＝小数部分なら）
            k = i - (decimal_index + 1);        //k＝input_numberのindexから小数点位置+1を引いた差（＝decimal_listのindex）
            decimal += decimal_list[k] * (10 ** (-(k + 1)));        //桁揃え
            view_str = view_str + decimal_list[k];      //数値を追加
        }else{      //もし整数ならば
            view += input_number[i] * (10 ** (len - (i + 1)));     //桁揃え
            view_str = view_str + input_number[i];      //数値を追加
        }
    }
    if(input_number.indexOf(".") != -1){        //もし入力値に小数点が含まれていたら
        var decimal_len = len - input_number.indexOf(".");      //小数部分の長さ
        for(i = 0;i < decimal_len;i++){     //小数部分の長さを考慮して小数部分だけ0.1かける
            view *= 0.1;
        }
    }
    var digit_view = 4;     //小数第4位を四捨五入する
    decimal = Math.round(decimal * Math.pow(10,digit_view)) / Math.pow(10,digit_view);
    view += decimal;      //整数部分と小数部分を足す
    if(view_str == ""){     //もしもview_strが空なら
        view_str = "0";     //0を表示
    }
    document.getElementById("view_count").innerHTML = view_str;     //表示
    is_decimal = false;     //元に戻す
}

function ClickNum(number){      //入力される数値をinput_numberに入れる関数
    push_button = true;     //ボタンが押されたのでtrue
    var check_result = CheckNum(number);        //コードを取得
    if(check_result == 0){      //もしも正常なら
        input_number.push(number);      //ユーザーが入力した値をinput_numberに追加
        NumberView();       //入力値の表示
    }else if(check_result >= 10){       //もしも不正な操作なら
        if(check_result == 11){     //もしも11（桁の超過）なら
            var error_massage = "桁が超えています";
        }else if(check_result == 12){       //もしも12（小数の連続押し）なら
            var error_massage = "小数点は既にあります";
        }
        ViewError(error_massage);       //エラーメッセージの表示
    }else if(check_result == 1){        //もしも最初が小数点なら
        input_number.push(0);       //0をいれる
        input_number.push(".");     //そのあとに小数点をいれる
        NumberView();       //入力値の表示
    }else if(check_result == 3){        //もしも最初が0でそのあと数字を打つようなら
        input_number.shift();       //最初の要素（0）を消す
        input_number.push(number);      //ユーザが入力した値をinput_numberに追加
        NumberView();
    }
}

function ResetInput(){      //入力値のリセットを行う関数
    input_number = [];      //入力している値を空にする
    push_button = false;        //ボタン操作を初期化する
    document.getElementById("view_count").innerHTML = "0";        //表示を0にする
}

function BackInput(){       //数字を減らす処理を行う関数（笑）
    input_number.pop();     //入力値をポップ
    NumberView();       //更新した入力値をUIに反映
}

function DeleteNum(index){      //指定した箇所の部分を削除
    view = 0;       //入力してる数を0に
    view_str = "";
    input_number = [];      //入力している値を空に
    delete_num = index;     //グローバル変数にローカル変数の値を代入
    confirm_list.splice(delete_num,1);      //指定したindexの部分を削除
    Confirm();      //もう一度平均値を求め直す
}

function PushInputNumber(num){      //引数numをinput_numberに置き換えするための関数
    var integer = Math.floor(num);      //整数部分を作る（＝小数第一位を切り捨て）
    var decimal = num - integer;        //小数 = 元の数 - 整数部分
    input_number = [];      //初期化
    integer = String(integer);      //文字列に変換する
    if(decimal != 0){       //もしも小数があるようならば
        var digit_view = 4;     //小数第4位から四捨五入
        var zero_counter = 0;       //ゼロがいくつあるか
        decimal = Math.round((decimal) * Math.pow(10,digit_view)) / Math.pow(10,digit_view);        //四捨五入
        decimal = String(decimal);      //文字列に変換
        decimal = decimal.substring(2);     //0.部分をなくす
        for(i = decimal.length - 1;i >= 0;i--){     //後ろから順に繰り返し
            if(decimal.substring(i,i+1) == "0"){        //もしも0なら
                zero_counter++;     //ゼロの個数を増やす
            }
        }
        if(zero_counter >= 1 && decimal.substring(decimal.length -1,decimal.length) == "0"){        //もしも0が一個以上あってdecimalの最後が0ならば
            decimal = decimal.substring(0,decimal.length - zero_counter);       //0を除いた数を抜き取る
        }
    }
    var len = integer.length;       //整数の長さを変数に代入
    if(decimal != 0){       //もしも整数じゃないなら
        len += (decimal.length + 1);        //小数部分の長さと小数点を足す（＝lenは全ての範囲の数値の長さ）
    }
    for(i = 0; i < len;i++){        //数の長さ分だけ繰り返す
        if(i == integer.length){        //もしもiが小数点の位置なら
            input_number.push(".")      //小数点をプッシュ
            continue;       //最初へ
        }
        if(i <= integer.length - 1){        //整数ならば
            var string = integer.substring(i,i+1);      //整数の1文字を切り取り
            string = Number(string);        //それを数値に変換
            input_number.push(string);      //プッシュ！！！！！！！（深夜テンション）
        }else if(i >= integer.length + 1){      //小数ならば
            var k = i - (integer.length + 1);       //小数版ループ変数の生成
            var string = decimal.substring(k,k+1);      //一文字を切り取り
            string = Number(string);        //それを数値に変換
            input_number.push(string);      //それをプッシュ
        }
    }
}

function SetInput(key){     //ユーザの操作によってデータの表示、値が変わるようにする関数
    var choice_num = 0;
    if((choice_point >= confirm_list.length-1 && key == "down") || (choice_point <= 0 && key == "up" && !move)){
        //一番上または一番下なのにさらに押された時の処理。とは言っても特にやることないのでコメントで埋めてますかわいそうに
    }else if(choice_point - 1 < 0 && key == "up" && move){     //上ボタンが押されて保存されていた入力値を表示する必要がある場合
        PushInputNumber(stack);     //保存してた数値をinput_numberにいれる
        NumberView();       //表示
        choice_point--;     //choice_pointを-1減らす（choice_point=-1）
        move = false;       //初期化
        change = false;
    }else{
        input_number = [];      //入力値の初期化
        if(key == "down"){      //もしも下矢印を押されたら
            if(choice_point == -1){     //もしも一番上からの操作なら
                stack = view;       //stackにviewを代入
                move = true;        //動作したのでtrueに
            }
            change = true;      //変わったからtrue
            choice_point++;     //選択中のindexを1増やす
            choice_num = confirm_list[choice_point];        //choice_numに選択中のデータの値を代入
        }else if(key == "up"){      //もしも上矢印を押されたら
            move = true;        //動作したのでtrueに
            choice_point--;     //選択中のindexを1減らす
            choice_num = confirm_list[choice_point];        //choice_numに選択中のデータの値を代入
        }
        PushInputNumber(choice_num);        //選択した数値をinput_numberに
        NumberView();       //表示
    }
}

function DeleteAll(){       //データを全削除する関数
    var res = confirm("データを全削除します。よろしいですか？");        //確認のメッセージを出現。resは論理型
    if(res){        //もしも「はい」が押されたら
        ResetInput();       //入力中の値を初期化
        confirm_list = [];      //データの全削除
        all_delete = true;      //全削除をtrueに
        Confirm();      //念のため集計
    }
}

function ViewDigit(){       //表示桁数の設定を行う関数（小数点）
    if(!view_digit){        //もしもデフォなら
        view_digit = true;      //反転
        document.getElementById("digit_count").innerHTML = "4";     //4と表示
    }else{      //デフォじゃないなら
        view_digit = false;     //反転
        document.getElementById("digit_count").innerHTML = "2";     //2と表示
    }
    CalcAve();      //平均を求める（今回は入力値をいじらないのでこの関数のみでOK）
}

function Ctrl_command(command,event){       //Ctrlキーが押された時のコマンドキーのそれぞれの関数を示す関数
    //ヘッヘッヘッ....keyCodeがどんなキーを表してるのか、忘れたぜ....ってかコマンドモードとか深夜テンションで作った黒歴史だし....
    if(ctrl_switch){
        if(command == "67"){
            ResetInput();
        }else if(command == "40"){
            event.preventDefault();
            SetInput("down");
        }else if(command == "38"){
            event.preventDefault();
            SetInput("up");
        }else if(command == "68"){
            DeleteNum(view);
        }else if(command == "75"){
            DeleteAll();
        }
    }
}
