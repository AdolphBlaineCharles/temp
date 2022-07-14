var current='C';
function startCompare(type){
    var snum = new Array();　//選擇球碼的數組形式
    var snum_str = ""; //選擇球碼的字符串形式
    var award = new Array(7);
    var award_str = new Array(7);
 
    for(var i=0;i<7;i++){     
       award[i]=0;
       award_str[i]="";
    }
    i=0;
    for(var j=0;j<document.all.nums.length;j++){          
      if(document.all.nums[j].checked==true){
          snum[i] = document.all.nums[j].value;
          snum_str+=snum[i]+",";
          i++;
      }else{
         continue;
      }	 
    }   
    if(snum.length<3){
       alert('最少要選擇三個球!');
       return ;
    }
    for(var m=0;m<ball.length;m++){
       var tmpNums = ball[m][1].split(",");	  
       switch(compare_to(type,tmpNums,snum)){
           case 1:
                award[0]++;
                award_str[0]+=m+";";
                break;
           case 2:
                award[1]++;
                award_str[1]+=m+";";
                break;			   
           case 3:
                award[2]++;
                award_str[2]+=m+";";
                break;			   
           case 4:
                award[3]++;
                award_str[3]+=m+";";
                break;			   
           case 5:
                award[4]++;
                award_str[4]+=m+";";
                break;			   
           case 6:
                award[5]++;
                award_str[5]+=m+";";
                break;			   
           case 7:
                award[6]++;
                award_str[6]+=m+";";			   			   
                break;			   
       }
   }
   //生成結果  
   result_str.innerHTML = "<b>對比的結果：(共<b>"+ball.length+"</b>期)</b><hr>";
   result_str.innerHTML += "中<b><font color=003366>6</font></b>碼 <b><font color=red>"+award[0]+"</font></b> 次　　　　　　<a href='javascript:' onClick=\"displyHistory("+type+",'"+award_str[0]+"','"+snum_str+"');\">〔顯示歷史開獎〕</a><br>";
   result_str.innerHTML += "中<b><font color=003366>5</font></b>碼＋特別號 <b><font color=red>"+award[1]+"</font></b> 次　　<a href='javascript:' onClick=\"displyHistory("+type+",'"+award_str[1]+"','"+snum_str+"');\">〔顯示歷史開獎〕</a><br>";
   result_str.innerHTML += "中<b><font color=003366>5</font></b>碼 <b><font color=red>"+award[2]+"</font></b> 次　　　　　　<a href='javascript:' onClick=\"displyHistory("+type+",'"+award_str[2]+"','"+snum_str+"');\">〔顯示歷史開獎〕</a><br>";
   result_str.innerHTML += "中<b><font color=003366>4</font></b>碼＋特別號 <b><font color=red>"+award[3]+"</font></b> 次　　<a href='javascript:' onClick=\"displyHistory("+type+",'"+award_str[3]+"','"+snum_str+"');\">〔顯示歷史開獎〕</a><br>";
   result_str.innerHTML += "中<b><font color=003366>4</font></b>碼 <b><font color=red>"+award[4]+"</font></b> 次　　　　　　<a href='javascript:' onClick=\"displyHistory("+type+",'"+award_str[4]+"','"+snum_str+"');\">〔顯示歷史開獎〕</a><br>";
   result_str.innerHTML += "中<b><font color=003366>3</font></b>碼＋特別號 <b><font color=red>"+award[5]+"</font></b> 次　　<a href='javascript:' onClick=\"displyHistory("+type+",'"+award_str[5]+"','"+snum_str+"');\">〔顯示歷史開獎〕</a><br>";
   result_str.innerHTML += "中<b><font color=003366>3</font></b>碼 <b><font color=red>"+award[6]+"</font></b> 次　　　　　 <a href='javascript:' onClick=\"displyHistory("+type+",'"+award_str[6]+"','"+snum_str+"');\">〔顯示歷史開獎〕</a><br>";    
 }

function choosefile(x){
    document.getElementById('inputfile')
        .addEventListener('change', function() {
            
        var fr=new FileReader();
        fr.onload=function(){
            document.getElementById('output')
                    .textContent=fr.result;
            console.log(fr.result);
            var arr = parseCSV(fr.result);
            console.log(arr.length);
            console.log(arr[0][0]);
            console.log(arr[1][0]);
            var length = arr.length;
            for(var i = 1;i < length;i++){
                var todos = firebase.database().ref(arr[i][1]);
                todos.set({num1: arr[i][6],
                        num2: arr[i][7],
                        num3: arr[i][8],
                        num4: arr[i][9],
                        num5: arr[i][10],
                        num6: arr[i][11],
                        special: arr[i][12]
                    });
            }
        }
            
        fr.readAsText(this.files[0]);
    })
}

function parseCSV(str){
    console.log(str);
    var arr = [];
    var quote = false;  // 'true' means we're inside a quoted field

    // Iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

function startCompare(type){

}