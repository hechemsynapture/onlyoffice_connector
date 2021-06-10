s = "[[]]";

symetric = (s) => {
    nbouvrantes = 0;
    nbfermantes = 0;
    len = s.length;
    for (let  i = 0; i < len ; i++ ){
        if (s.charAt(i) === "]" && nbfermantes +1 > nbouvrantes){
            return false;
        } else if (s.charAt(i) === "["){
            nbouvrantes ++;
        } else {
            nbfermantes ++;
        }
    }
    return nbouvrantes == nbfermantes;
}

console.log(symetric(s));