export function credit(input) {
    var angka = 0
    var output = 0
    var  y= input
    var a
    do {
        a = y%(10)
        var b
        y = (y-a)/10
        if(angka%2==1){
            a*=2
            if(a>9 ){
                b = a%10
                output += (b+1)
            } else {
                output += a
            }
        } else {
            output += a
        }
        angka++
    } while (y > 0);

    if(output%10 == 0) {
      return true
    } else {
        return false
    } 
  }