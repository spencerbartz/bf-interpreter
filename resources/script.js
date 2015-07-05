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
        stack = [],
        support  = true,
        bfSymbols = [">", "<", ".", ",", "+", "-", "[", "]", "#"],
        curChar = "",
        curCharPos = 0,
        inputText = "",
        curInputLine = 0,
        jump = false
        
	self.initialize = function(totalCells, outputEl) {
            cells = Array.apply(null, Array(totalCells)).map(Number.prototype.valueOf,0);
            outputArea = document.getElementById(outputEl);
        },
        
        self.debug = function() {
            self.printCells();
            self.printCurCell();
            self.printCurChar();
            self.printCurCharPos();
            self.printStack();
            self.printStackLength();
        },
        
        self.printCells = function() {
            var str = ""
            for (var i = 0; i < cells.length; i++)
            {
                str += "" + cells[i] + " ";
            }
            console.log("CELLS: " + str);
        },
        
        self.printCurChar = function() {
            console.log("CUR_CHAR: " + curChar);    
        },
        
        self.printCurCharPos = function() {
            console.log("CUR_CHAR_POS: " + curCharPos);  
        },
        
        self.printCurCell = function() {
            console.log("CUR_CELL: " + currentCell);
        },
        
        self.printStack = function() {
            var str = ""
            for (var i = 0; i < stack.length; i++)
            {
                str += "[" + stack[i]["current"] + "] ";
            }
            console.log("STACK_CONTENTS: " + str);
        },
        
        self.printStackLength = function() {
            console.log("STACK.LENGTH: " + stack.length);
        },
        
        self.interpret = function(textArea) {
            reset(cells.length);
            inputText = document.getElementById(textArea).value;
            parse(inputText);
        },
        
        self.testFind = function(text) {
            return findMatchingBracePos( text);    
        },
        
        //start at left brace and find matching right brace position
        findMatchingBracePos = function(text) {      
            var mystack = [];
            var i = 0;
        
            mystack.push("[");
        
            while(mystack.length > 0 && i < text.length - 1)
            {
                i++;
                if(text.charAt(i) === "[")
                {
                    mystack.push("[");
                }
                else if(text.charAt(i) === "]")
                {
                    mystack.pop();
                }
            }
            
            if(mystack.length > 0)
            {
                throw "Unmatched brace";
            }
            else
            {
                return i;
            }
        },
        
        reset = function(totalCells) {
            cells = Array.apply(null, Array(totalCells)).map(Number.prototype.valueOf, 0);
            currentCell = 0,
            stack = [],
            debugStr = "",
            curChar = "",
            curCharPos = 0,
            inputText = "",
            curInputLine = 0
            outputArea.value = "";
        },
        
        parse = function(text) {
            debugStr = "";
            var startPos = 0;
            
            for(curCharPos = 0; curCharPos < text.length; curCharPos++)
            {   
                curChar = text.charAt(curCharPos);
                    
                //Ignore all non brainfuck symbols for now
                if(curChar === "\n")
                {
                    curInputLine++;
                    continue;
                }
                else if(bfSymbols.indexOf(curChar) < 0)
                {
                    continue;
                }
                else if(curChar === ">")
                {
                    mvr();
                }
                else if(curChar === "<")
                {
                    mvl();
                }
                else if(curChar === ",")
                {
                
                }
                else if(curChar === ".")
                {
                    put();
                }
                else if(curChar === "[")
                {
                    lbr(text);
                }
                else if(curChar === "]")
                {
                    rbr();
                }
                else if(curChar === "+")
                {
                    add();
                }
                else if(curChar === "-")
                {
                    sub();
                }
                else if(curChar === "#")
                {
                    dbg();
                }

                debugStr += curChar;
            }
            //console.log("PARSE STRING: " + debugStr);
        },
        
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
        
        lbr = function(text) {
            stack.push({lbrace: "[", current: curCharPos});
            if (stack.length == 500)
            {       
                if (confirm("You're in a little deep, maybe an infinite loop. Would you like to exit?"))
                {
                    reset(10);
                    curCharaPos = findMatchingBracePos(text.substr(stack.pop().current));
                    return;
                }
            }
            
            //remaining input to read
            var newContext = text.substring(curCharPos);
            
            var matchingRBPos = findMatchingBracePos(newContext);
            
            //isolate this block (cut off  brackets from the start and end of the string)
            var newBlock = newContext.substring(1, matchingRBPos);
            
            var loopCount = 0;
            
            while(cells[currentCell] > 0)
            {
                    loopCount++;
                    parse(newBlock);
                   // cells[currentCell]--;
                if(loopCount % 500 == 0)
                {
                    self.debug();
                    if (confirm("You're in a little deep (I know I tried!), maybe an infinite loop. Would you like to exit?"))
                    {
                        var skipAheadPos = findMatchingBracePos(text.substr(stack.pop().current));
                        reset(10);
                        curCharPos = skipAheadPos;
                        return;
                    }
                }
            }
            
            curCharPos = matchingRBPos + (text.length - newContext.length);
        },
        
        rbr = function() {
        }
        
        add = function() {
            cells[currentCell]++;
        },
        
        sub = function() {
            cells[currentCell]--;
        },
        
        dbg = function() {
            self.debug();
            alert("Debug");
        }
        
})(window));

function clearTextArea(textAreaEl) {
    var textArea = document.getElementById(textAreaEl).value = "";
}