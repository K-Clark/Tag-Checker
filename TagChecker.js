 /* 
The purpose of this code is to check that all tags 
for a given piece of text are:
a) Correctly nested
b) Not missing or containing extra tags 

If the paragraph is correctly tagged, then output is:
	Correctly tagged paragraph

If the paragraph is incorrectly tagged, then out put is:
	Expected <expected> found <unexpected>
    If either of these is the end of the paragraph, 
    then tag is replaced by # 
*/

// Reading a file 

var SentenceLine; // wanting to split text into array portions
var textPgraph;
var freq = [];
var tagList = [];
var checkLine = [];
var refinedList = [];
var resPara;

function readText(e) { // Portion of code reading and displaying contents of file
    var textFile = e.target.files[0]; //This creates an array to store the text 
    if (!textFile) { return; }

    var textReader = new FileReader(); // Creates a file reader to read array
    textReader.onload = function(e){
        var fileText = e.target.result; // fileText being defined 
        SentenceLine = fileText;
        textPgraph = fileText.split("\r\n\r\n"); // Separates file text by paragraphs
            // calling functions
            displayText(fileText);  
            countTag(freq);
            orderTags(tagList);
            refiningTags(refinedList);
            listResults(checkLine);
            resultOutput(resPara);
            // The following console.log() functions are to check output and accuracy of functions
            console.log(SentenceLine); //Running correctly
            console.log(freq);  //Running correctly
            console.log(tagList);  //Running correctly
            console.log(refinedList); //Running correctly
            console.log(checkLine); //Running correctly
            console.log(resPara);
    };

    textReader.onerror = function(e){ // Error output
        console.error("file could not be read \n Code: " + event.target.error.code);
    };

    textReader.readAsText(textFile);
};

// Portion of code displaying contents of text file
function displayText(fileText){
    document.getElementById('file-output').textContent = fileText; // fileText is already defined 
    console.log(fileText);
};
// Portion of code to select text file
document.getElementById('file-input')
    .addEventListener('change', readText, false);


//This is to count the number of tags(<x>) in the string
function countTag(freq){ 

    for(k=0;k<textPgraph.length;k++){
        var _freq = 0;
        SentenceLine = textPgraph[k];
        for(i=0;i<SentenceLine.length;i++){
        var SentChar=SentenceLine.substr(i,1);
            if(SentChar.includes("<")==true){
            _freq++;
            }
        }
    freq[k] = _freq;
    }
};

//This is to order the tags into an array
function orderTags(tagList){
var startTag = "<";
var tagInitPlace;
for(k=0;k<textPgraph.length;k++){
var n=0;
var _tagList = [];
SentenceLine = textPgraph[k];
tagInitPlace = SentenceLine.indexOf(startTag);
    for(i=0; i<freq[k]; i++){
        if(SentenceLine.substr(tagInitPlace+1,1)=="/"){
        _tagList[n] = SentenceLine.substr(tagInitPlace,4); 
        n++;
        }
        else if(SentenceLine.substr(tagInitPlace,1)==startTag){
        _tagList[n] = SentenceLine.substr(tagInitPlace,3);
        n++;
        }
        tagList[k]=_tagList;
    tagInitPlace = SentenceLine.indexOf(startTag,tagInitPlace+1);
    }
}
};



//This is to correct array from any tag structures that aren't B or C tags
function refiningTags(refinedList){
var _refinedList = []; 
    for(row=0;row<tagList.length;row++){ // Searches array's rows
    var n = 0;
    var tagListRow= tagList[row];
    var _refinedListInner = [];
        for(col=0;col<tagListRow.length;col++){ // Searches columns of each row
        tagListRow= tagList[row];
            if(tagListRow[col]=="<B>"){
            _refinedListInner[n] = "<B>";
            n++;
            }
            else if(tagListRow[col]=="</B>"){
            _refinedListInner[n] = "</B>";
            n++;
            }
            else if(tagListRow[col]=="<C>"){
            _refinedListInner[n] = "<C>";
            n++;
            }
            else if(tagListRow[col]=="</C>"){
            _refinedListInner[n] = "</C>";
            n++;
            }       
        }
        refinedList[row]=_refinedListInner;
    }
}; 

// This checks tag list for errors and outputs result
function listResults(checkLine){
var _checkLine = null;
var checkLineArray = [];
var tagCase = null; // False if text is short or extra a tag
var spareTag = null; // Holds missing/extra tag
    for(k=0;k<refinedList.length;k++){
    var listLength = refinedList[k].length;
    var refinedRow = refinedList[k];
        if((listLength%2)!=0){ //Case for missing/extra tags
            for(i=0;i<listLength;i++){
                // For missing tags
                if(refinedRow[i]=="<B>"){
                tagCase = refinedRow.includes("</B>");
                    if(tagCase==false){
                    spareTag = "</B>";
                    _checkLine = "Expected "+spareTag+" found #";
                    }
                }
                else if(refinedRow[i]=="<C>"){
                tagCase = refinedRow.includes("</C>");
                    if(tagCase==false){
                    spareTag = "</C>";
                    _checkLine = "Expected "+spareTag+" found #";
                    }
                }
                // For extra tags
                if(refinedRow[i]=="</B>"){
                tagCase = refinedRow.includes("<B>");
                    if(tagCase==false){
                    spareTag = "</B>";
                    _checkLine = "Expected # found "+spareTag;
                    }
                }    
                if(refinedRow[i]=="</C>"){
                tagCase = refinedRow.includes("<C>");
                    if(tagCase==false){
                    spareTag = "</C>";
                    _checkLine = "Expected # found "+spareTag;
                    }
                }        
            }
        }
        // Following portion is tags incorrectly ordered
        else if(listLength==2){_checkLine = "Correctly tagged paragraph";}
        else{ // Assuming only C and B tags are present
        if(refinedRow[0]=="<B>"){
            tagCase = refinedRow[(listLength-1)]; // As arrays count from 0
                if(tagCase!="</B>"){ // Case: <B>...</C> -Assuming C tags are in correct order
                    if(refinedRow[1]=="</B>"){ // Case: <B> is immediately followed by </B>
                    _checkLine = "Correctly tagged paragraph";     
                    }
                    else if(refinedRow[1]=="<C>"){ // Case: <B><C></B></C>
                    spareTag = refinedRow[(listLength-2)];
                    _checkLine = "Expected "+tagCase+" found "+spareTag;
                    }
                }      
                else if(tagCase=="</B>"){ // Case: <B>...</B> - Assuming C tags are in correct order
                _checkLine = "Correctly tagged paragraph";  
                }
            }
            if(refinedRow[0]=="<C>"){
            tagCase = refinedRow[(listLength-1)]; 
                if(tagCase!="</C>"){ // Case <C> ... </B> -Assuming B tags are in correct order
                    if(refinedRow[1]=="</C>"){ //Case: <C> is immediately followed by </C>
                    _checkLine = "Correctly tagged paragraph";     
                    }
                    else if(refinedRow[1]=="<B>"){ //Case <C><B></B></C>
                    spareTag = refinedRow[(listLength-2)];
                    _checkLine = "Expected "+tagCase+" found "+spareTag;
                    }
                }   
                else if(tagCase=="</C>"){ // Case <C>...</C> - Assuming B tags are in correct order
                _checkLine = "Correctly tagged paragraph";  
                }
            }
        } 
    checkLine[k] = _checkLine;
    }  
};

// This is to correctly display all of the results
function resultOutput(resPara){
var _resPara = checkLine[0].toString()+("\r\n\r\n");
    for(i=1;i<checkLine.length;i++){
    _resPara = _resPara+checkLine[i].toString()+("\r\n\r\n");
    }
document.getElementById('line-results').textContent = _resPara;
};
