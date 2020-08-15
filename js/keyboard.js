/**
キーボードからの入力に対応するjsファイル。キーボードそれぞれの処理自体はindex.jsに記述
**/

var ctrl_key_id = ["17","67","40","38","68","75"];      //ctrlキーを押したことで動作するキーコード一覧
function SetCtrl(){     //ctrlが押された時の処理。on/offの切り替え
    if(!ctrl_switch){
        ctrl_switch = true;
        document.getElementById("ctrl_on").innerHTML = "on";
    }else{
        ctrl_switch = false;
        document.getElementById("ctrl_on").innerHTML = "off";
    }
}

function KeyInput(event){       //keyCodeに対応するイベントを記述
    var key = event.keyCode;
    if((key >= 48 && key <= 57) || (key >= 96 && key <= 105)){
        switch(key){
            case 48:
            case 96:
                ClickNum(0);
                break;
            case 49:
            case 97:
                ClickNum(1);
                break;
            case 50:
            case 98:
                ClickNum(2);
                break;
            case 51:
            case 99:
                ClickNum(3);
                break;
            case 52:
            case 100:
                ClickNum(4);
                break;
            case 53:
            case 101:
                ClickNum(5);
                break;
            case 54:
            case 102:
                ClickNum(6);
                break;
            case 55:
            case 103:
                ClickNum(7);
                break;
            case 56:
            case 104:
                ClickNum(8);
                break;
            case 57:
            case 105:
                ClickNum(9);
                break;
        }
    }else{
        switch(key){
            case 8:
                BackInput();
                break;
            case 17:
                SetCtrl()
                break;
            case 13:
                Confirm();
                break;
            case 110:
            case 190:
                ClickNum(".");
                break;
        }
        if(ctrl_key_id.indexOf(key)){
            Ctrl_command(key,event);
        }
    }
}

document.addEventListener('keydown',(event) => KeyInput(event));