const AllClear = document.querySelector(".AllClear");
const del = document.querySelector(".del");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");

const previousText = document.querySelector(".previus");
const currentText = document.querySelector(".current");

class Calculator {
    constructor(PreviousText, CurrentText) {
        this.PreviousText = PreviousText;
        this.CurrentText = CurrentText;
    };


    Clear() {
        this.CurrentText = "0";
        this.PreviousText = "";
    };

    Update() {
        previousText.innerHTML = this.PreviousText;
        currentText.innerHTML = this.CurrentText;
    };


    Delete() {
        if(this.CurrentText != "0") {
            this.CurrentText = this.CurrentText.toString().slice(0, -1);
        }
        if(this.CurrentText == "") {
            this.CurrentText = "0";
        }
        else return;
        
    };
    
    AddNumber(Number) {
        if(this.CurrentText === "0") {
            this.CurrentText = Number;
        } else {
            this.CurrentText = `${this.CurrentText}${Number}`;
        }
    };

    Operate(OperatorList) {
        switch(OperatorList[2]) {
            case "plus":
                this.CurrentText = `${this.CurrentText} <i class="fa-solid fa-plus size-small"></i> `;
                break;

            case "minus":
                this.CurrentText = `${this.CurrentText} <i class="fa-solid fa-minus size-small"></i> `;
                break;

            case "multiply":
                this.CurrentText = `${this.CurrentText} <i class="fa-solid fa-xmark size-small"></i> `;
                break;

            case "divide":
                this.CurrentText = `${this.CurrentText} <i class="fa-solid fa-divide size-small"></i> `;
                break;
            case "equal":
                this.PreviousText = this.CurrentText
                this.equal();
                break;
        }
    
    }

    equal() {
        let SplitCurrentText = this.CurrentText.split(" ");
        let ConvertedCurrentText = [];
        for(let i = 0; i < SplitCurrentText.length; i++) {
            if(!isNaN(parseInt(SplitCurrentText[i]))) {
                ConvertedCurrentText.push(SplitCurrentText[i]);     
            }
            else if(SplitCurrentText[i] == "fa-plus") {
                ConvertedCurrentText.push("+");
            }
            else if(SplitCurrentText[i] == "fa-minus") {
                ConvertedCurrentText.push("-");
            }
            else if(SplitCurrentText[i] == "fa-xmark") {
                ConvertedCurrentText.push("*");
            }
            else if(SplitCurrentText[i] == "fa-divide") {
                ConvertedCurrentText.push("/");
            }
        }

        let joinedCurrentText = ConvertedCurrentText.join(" ");
        let result = eval(joinedCurrentText);
        this.CurrentText = result.toFixed(2).toString();
        console.log(this.CurrentText);  
        
        
    }


}

// calculator reference
let calc = new Calculator("", "5335");


// allclear
AllClear.addEventListener("click", () => {
    calc.Clear();
    calc.Update();
});

// delete
del.addEventListener("click", () => {
    calc.Delete();
    calc.Update();
});

// addnumbers
numbers.forEach((number) => {
    number.addEventListener("click", () => {
        calc.AddNumber(number.innerText);
        calc.Update();
    });
});


// operators
operators.forEach((operator) => {
    operator.addEventListener("click", () => {
        calc.Operate(operator.classList);
        calc.Update();
        console.log(calc.CurrentText);
        
    });
});




