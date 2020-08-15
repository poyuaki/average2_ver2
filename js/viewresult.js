function ConfirmView(){     //データのリストを表示する関数
    var confirm_with_tag = [];      //タグを含めた表示するデータを格納する配列
    var add_inner = "";     //表示する文字列（タグ含める）
    var len = confirm_list.length;      //データの数
    console.log(confirm_list.length);
    for(i = 0;i < len;i++){     //データ分繰り返す
        /* タグの作成 */
        var add_tag = "<div class='con_line' id='all_list_"+ i +"'><p id='num_"+ i +"' class='number'>" + confirm_list[i] + "</p><button id='delete_"+ i +"' class='delete' onclick='DeleteNum("+ i +")'>削除</button></div>";
        confirm_with_tag.push(add_tag);     //タグを配列にプッシュ
    }
    for(i = 0; i < len;i++){        //データ分繰り返し
        add_inner = add_inner + confirm_with_tag[i];        //add_innerにタグを追加
    }
    document.getElementById("list_num").innerHTML = add_inner;      //add_innerの表示
}

function CalcAve(){     //平均値を求める関数
    var sum = 0;        //合計値
    var len = confirm_list.length;      //データの数
    if(view_digit){
        var digit = 4;
    }else{
        var digit = 2;
    }
    for(i = 0;i < len;i++){
        sum += confirm_list[i];     //総和を求める
    }
    if(sum != 0){
        var result = Math.round((sum / len) * Math.pow(10,digit)) / Math.pow(10,digit);     //平均値を求める（digitの値によって四捨五入する桁数が変化）
        document.getElementById("view_sum").innerHTML = sum;
    }else{
        var result = 0;
        document.getElementById("view_sum").innerHTML = 0;
    }
    if(isNaN(result)){      //もしもresultになにかしらのエラーが発生したら
        result = 0;     //もうデバッグがめんどくさいんで強制的に0に変えますごめんね
        ViewAtt("内部で例外処理が行われました。エラーコードを記載の上、GitHub、またはTwitterにて報告してくださると助かります<br>エラーコード：v-35");
    }
    document.getElementById("view_ave").innerHTML = result;     //平均値の表示
}

function Confirm(){     //ユーザーがデータを追加した時の総合的な関数
    if(change){     //選択したデータを変更する場合は
        console.log("ここ通過アイうおえかきうk");
        confirm_list[choice_point] = view;      //選択した値を現在の入力値に変える
    }else{
        if(delete_num < 0 && !all_delete){      //もしも全削除ではなく、かつindex操作による削除でない場合
            console.log("!!!I'm here!!!!" + view_str);
            confirm_list.unshift(view);     //データをエンキュー
        }
    }
    ConfirmView();      //データのリストを表示する関数
    ResetInput();       //入力値の表示をリセットする
    view = 0;
    view_str = "";
    if(delete_num >= 0){        //もしもindex操作による削除の場合
        console.log("ここ通過");
        delete_num = -1;        //元に戻す
    }
    if(change){     //もしも数の移動が行われていたら
        choice_point = -1;      //最初に戻す
        PushInputNumber(stack);     //最初の保存してた数をinput_numberにいれる
        NumberView();       //表示
        change = false;     //初期化
        move = false;
    }
    CalcAve();      //平均値を求める関数
    document.getElementById("view_list_count").innerHTML = confirm_list.length;     //データの長さを表示
    if(all_delete){     //もしも全削除なら
        all_delete = false;
    }
}