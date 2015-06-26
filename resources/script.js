/*
|------------------------------------------------
| script.js
|------------------------------------------------
|
| JavaScript functions for the Brainfuck interpreter
|
| @author     Spencer Bartz
| @version    1.0
| @copyright  Copyright 2015 Spencer Bartz
| @license    The unlicense
|
| @link       http://www.spencerbartz.com
|
*/

window.BFI = (new (function(window, undefined) {
	
	var
	self     = this,
	cells    = null,
        currentCell = 0,
	win      = window,
	doc      = win.document,
        outputArea = null,
        contextStack = [],
        support  = true,
        debugStr = "",
        bfSymbols = [">", "<", ".", ",", "+", "-", "[", "]"]
        
	self.initialize = function(totalCells, outputEl) {
            cells = Array.apply(null, Array(totalCells)).map(Number.prototype.valueOf,0);
            outputArea = document.getElementById(outputEl);
        },
        
        self.printCells = function() {
            var str = ""
            for (var i = 0; i < cells.length; i++)
            {
                str += "" + cells[i] + " ";
            }
            console.log(str);
        },
        
        self.interpret = function(textArea) {
            text = document.getElementById(textArea).value;
            parse(text);
        },
        
        parse = function(text) {
            for(var i = 0; i < text.length; i++)
            {
                curChar = text.charAt(i);
                
                if(curChar === " ")
                {
                    continue;
                }
                else if(curChar === "+")
                {
                    add();
                }
                else if(curChar === "-")
                {
                    sub();
                }
                else if(curChar === ">")
                {
                    mvr();
                }
                else if(curChar === "<")
                {
                    mvl();
                }
                else if(curChar === ".")
                {
                    put();
                }
                else if(curChar === ",")
                {
                
                }
                else if(curChar === "[")
                {
                }
                else if(curChar === "]")
                {
                }
                
                debugStr += curChar;
            }
            console.log("DEBUG STRING: " + debugStr);
        },
        
        self.printOutput = function() {
        }
        
        mvr = function() {
            currentCell++;
        },
        
        mvl = function() {
            currentCell--;
        },
        
        get = function(character) {
            cells[currentCell] = character.charCodeAt(0);
        },
        
        put = function() {
            outputArea.value = outputArea.value + String.fromCharCode(cells[currentCell]);
        },
        
        rbr = function() {
            sub();
        },
        
        lbr = function() {
            while(cells[currentCell] > 0) {
                parse
            }
        },
        
        add = function() {
            cells[currentCell]++;
        },
        
        sub = function() {
            cell[currentCell]--;
        }
        
})(window));

function clearTextArea(textAreaEl) {
    var textArea = document.getElementById(textAreaEl).value = "";
}