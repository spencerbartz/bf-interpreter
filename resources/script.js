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
        intrpOutputArea = null,
        convOutputArea = null,
        stack = [],
        support  = true,
        bfSymbols = [">", "<", ".", ",", "+", "-", "[", "]", "#"],
        curChar = "",
        curCharPos = 0,
        inputText = "",
        curInputLine = 0
        
	self.initialize = function(totalCells, intrpOutputEl, convOutputEl) {
            cells = Array.apply(null, Array(totalCells)).map(Number.prototype.valueOf,0);
            intrpOutputArea = _el(intrpOutputEl);
            convOutputArea = _el(convOutputEl);
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
        
        getFactors = function(number) {
            var factors = [];
            
            //find two numbers that will divide into "number"
            for(var i = number - 1; i > 0; i--)
            {
                if(number % i === 0)
                {
                    //try to find the closest factor "f" such that f x i == number
                    for(var j = i - 1; j > 0; j--)
                    {
                        if(number % j === 0 && (j * i === number))
                        {
                            factors.push([i, j, i - j]);
                        }
                    }
                }
            }
            
            if(factors.length > 0)
            {
                var minDiffCell = -1;
                var min = number - 1; //upper bound of what the factors could possibly be
                
                for(var i = 0; i < factors.length; i++)
                {
                    if(factors[i][2] < min)
                    {
                        min = factors[i][2];
                        minDiffCell = i;
                    }
                }
                
                return [factors[minDiffCell][0], factors[minDiffCell][1]];
            }
            else
            {
                return [number, 1];                
            }
        },
        
        self.asciiToBF = function(convInput) {
            var asciiText = _el(convInput).value;
            var bfOutput = "[-]>[-]<\n";
            var lastChar = "\0";
            var codeDiff = 0; //difference in ascii code from last char read
            
            for(var i = 0; i < asciiText.length; i++)
            {
                codeDiff = asciiText.charCodeAt(i) - lastChar.charCodeAt(0);
                
                if(codeDiff === 0)
                {
                    bfOutput += ">.<\n";
                    continue;
                }
                
                var factors = getFactors(Math.abs(codeDiff));
            
                //Set loop counter for block
                for(var j = 0; j < factors[0]; j++)
                {
                    bfOutput += "+";
                }
                
                //start loop block
                bfOutput += "[>";
                
                for(var j = 0; j < factors[1]; j++)
                {
                    if(codeDiff > 0)
                    {
                        bfOutput += "+";
                    }
                    else if(codeDiff < 0)
                    {
                        bfOutput += "-";
                    }
                }
                
                bfOutput += "<-]>.<\n";
                lastChar = asciiText.charAt(i);
            }
            convOutputArea.value = bfOutput;
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
            intrpOutputArea.value = "";
            convOutputArea.value = "";
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
                    //TODO: show lightbox with dialog and allow user input
                    //showOverlay();
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
            intrpOutputArea.value = intrpOutputArea.value + String.fromCharCode(cells[currentCell]);
        },
        
        lbr = function(text) {
            stack.push({lbrace: "[", current: curCharPos});
            if(stack.length % 500 == 0)
            {       
                if (confirm("Your program is now 500 levels deep in scope. You may have an unmatched brace somewhere. Skip ahead?"))
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
                
                if(loopCount % 500 == 0)
                {
                    self.debug();
                    if (confirm("Your program has executed the same loop 500 times. It may be a bug in your code. Skip ahead?"))
                    {
                        var skipAheadPos = findMatchingBracePos(text.substr(stack.pop().current));
                        reset(10);
                        loopCount = 0;
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

function clearTextArea(textAreaEl)
{
    var textArea = _el(textAreaEl).value = "";
}

function _el(elem)
{
    return document.getElementById(elem);
}

/******************************************************************
 * showOverlay(): Dims the screen for light box windows
 * @return  void
 *******************************************************************/
function showOverlay()
{
    var overlay = $('#overlay');
    overlay.fadeIn()
}
    
$(document).ready(function() {
    var overlay = $('#overlay');
    overlay.css({'display' : 'none'});
});