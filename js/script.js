/*
File: script.js
GUI Assignment: Homework 4 Part 1
Jacob Ouellet, UMass Lowell Computer Science, jacob_ouellet@student.uml.edu
Copyright (c) 2021 by Jacob Ouellet. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by Jacob Ouellet on Aug 5, 2021 at 7:06 PM
*/

// class that contains methods pertaining to the Table Parameters
class Table_Params{

    // constructor for class. Class contains values row_start, row_end, column_start, column_end
    constructor(rowStart, rowEnd, columnStart, columnEnd) {
        this.row_start = rowStart;
        this.row_end = rowEnd;
        this.column_start = columnStart;
        this.column_end = columnEnd;
    }

    // take the row and column values and multiply together to build the calculation table
    calculate_table(){
        const x_axis = [];
        const y_axis = [];
        const results = []; // results of each computation in linear array
        var i;
        
        // init each array with the range
        if(this.row_end < this.row_start){  // if the row end index is smaller than the start index then init the array backwards
            i = this.row_start;
            while(i >= this.row_end){ // while i (row start) is not less than row_end add each value between the row start and end to the x axis list
                x_axis.push(i);
                i--;
            }
        }
        else{  // if start index is larger than the end index then count upwards like normal
            i = this.row_start;
            while(i <= this.row_end){ // while i (row start) is not greater than row_end add each value between the row start and end to the x axis list
                x_axis.push(i);
                i++;
            }
        }

        if(this.column_end < this.column_start){ // if the column end index is smaller than the start index then init the array backwards
            i = this.column_start;
            var j = x_axis.length;
            while(i >= this.column_end){
                y_axis.push(i); // add the column value to the y axis 
                for(var x = 0; x < j; x++){ // for each value in the row (x_axis) multiply it by the current column we just got and add each resulting value to the result array 
                    results.push(i * x_axis[x])
                }
                i--;
            }
        }
        else{ // if start index is larger than the end index then count upwards like normal
            i = this.column_start;
            var j = x_axis.length;
            while(i <= this.column_end){
                y_axis.push(i); // add the column value to the y axis 
                for(var x = 0; x < j; x++){
                    results.push(i * x_axis[x]) // for each value in the row (x_axis) multiply it by the current column we just got and add each resulting value to the result array 
                }
                i++;
            }
        }
        return this._construct_html_table(x_axis, y_axis, results); // returns the html formatted table with the x axis y axis and results for each row col pair
    }

    // builds the html text for the table
    _construct_html_table(x_axis, y_axis, results){
        var text = '<tr><td></td>'; // first table column/row is empty so emprt <td></td>
        for(var x = 0; x < x_axis.length; x++){ // add all the x_axis elements to the first row in the table
            text += '<td>' + x_axis[x] + '</td>';
        }
        text += '</tr>';    // close the first row
        
        var offset = x_axis.length; // offset used to seperate the values in the results array since it is a linear array not 2d
        var result_index = 0;
        for(var y = 0; y < y_axis.length; y++){ // now add each row starting with the y axis (column index) and all its coresponding calulation from result array
            text += '<tr>';
            text += '<td>' + y_axis[y] + '</td>';   // add in the y axis (first column value)
            while(result_index < offset){   // add in all the calulation values for that row from the result table
                text += '<td>' + results[result_index] + '</td>';
                result_index++;
            }
            result_index = offset;  // increment the result index up to get the next row of table calulations
            offset = offset + x_axis.length;
            text += '</tr>';    // close the row
        }
        return text;    // return the text html table
    }
}

// jquery that handles validation/rules/messages etc.
$(function(){
    $("#input_form").validate({
        // if invalid do not focus on any specific element
        focusInvalid: false,
        rules:{
            rowstart:{
                required: true, // make field required
                range: [-100, 100],   // range for which values must be
                step: 1,     // make sure the value is an integer and not a decimal
            },
            rowend:{
                required: true,
                range: [-100, 100],
                step: 1,
            },
            columnstart:{
                required: true,
                range: [-100, 100],
                step: 1
            },
            columnend:{
                required: true,
                range: [-100, 100],
                step: 1
            },
        },
        messages:{
            // error messages for each attribute to be validated
            rowstart:{
                required: "row start index is required",
                range: "row start index must be between -9999 and 9999",
                step: "row start must be a whole number",
            },
            rowend:{
                required: "row end index is required",
                range: "row end index must be between -9999 and 9999",
                step: "row end must be a whole number",
            },
            columnstart:{
                required: "column start index is required",
                range: "column start index must be between -9999 and 9999",
                step: "column start must be a whole number",
            },
            columnend:{
                required: "column end index is required",
                range: "column end index must be between -9999 and 9999",
                step: "column end must be a whole number",
            }
        }
    })
});

// jquery ui that sets up the sliders for input and two way binds them to the input text boxes
$(function(){
    //set the slider options for each of the four sliders
    var slideOpts = {
        min: -100,
        max: 100,
        step: 1,    // makes sure it is an integer
        value: 0,
        change: function(e, ui) {   // if the slider changes
            $("#rowstart").val(ui.value);    // set the rowstart text box value to the one from the slider
            var isvalid = $("#input_form").valid();  // check if entire table is valid valid
            if (isvalid) { 
                process_table(); // process the table. dynamically updates table if it is valid
            }
        },
        slide: function(e, ui) {    // while sliding the slider update the value in the text box to reflect it
            $("#rowstart").val(ui.value);
        }
    }
    var slide2Opts = {
        min: -100,
        max: 100,
        step: 1,
        value: 0,
        change: function(e, ui) {
            $("#rowend").val(ui.value);
            var isvalid = $("#input_form").valid();  // check if valid
            if (isvalid) { 
                process_table(); // process the table if it is
            }
        },
        slide: function(e, ui) {
            $("#rowend").val(ui.value);
        }
    }
    var slide3Opts = {
        min: -100,
        max: 100,
        step: 1,
        value: 0,
        change: function(e, ui) {
            $("#columnstart").val(ui.value);
            var isvalid = $("#input_form").valid();  // check if valid
            if (isvalid) { 
                process_table(); // process the table if it is
            }
        },
        slide: function(e, ui) {
            $("#columnstart").val(ui.value);
        }
    }
    var slide4Opts = {
        min: -100,
        max: 100,
        step: 1,
        value: 0,
        change: function(e, ui) {
            $("#columnend").val(ui.value);
            var isvalid = $("#input_form").valid();  // check if valid
            if (isvalid) { 
                process_table(); // process the table if it is
            }
        },
        slide: function(e, ui) {
            $("#columnend").val(ui.value);
        }
    }

    // initialize each slider with the slider options
    $("#slide").slider(slideOpts);
    $("#slide2").slider(slide2Opts);
    $("#slide3").slider(slide3Opts);
    $("#slide4").slider(slide4Opts);

    // used to make sure if the row or column index changes then the difference must be revalidated by making row/col difference empty
    $("#rowstart").change(function(){   // if text box value changes
        if(Number.isInteger(parseInt($(this).val()))){  // if its a number 
            $("#slide").slider("value", $(this).val());     // set the slider to that value. If its greater then slider will go to its max then set text box to sliders max
        }
    })
    $("#rowend").change(function(){
        if(Number.isInteger(parseInt($(this).val()))){
            $("#slide2").slider("value", $(this).val());
        }
    })
    $("#columnstart").change(function(){
        if(Number.isInteger(parseInt($(this).val()))){
            $("#slide3").slider("value", $(this).val());
        }
    })
    $("#columnend").change(function(){
        if(Number.isInteger(parseInt($(this).val()))){
            $("#slide4").slider("value", $(this).val());
        }
    })
});

//jquery to create tabs and delete tabs when the save table button is clicked
$(function(){
    $("#myTabs").tabs();    // initialize the tabs (will start empty)

    $("#saveTable").click(function() {  // if save table is clicked get each of the values from the input boxes
        var row_start = parseInt($('#rowstart').val());
        var row_end = parseInt($('#rowend').val());
        var column_start = parseInt($('#columnstart').val());
        var column_end = parseInt($('#columnend').val());

        var tab_name = "table_" + row_start + "_" + row_end + "_" + column_start + "_" + column_end;    // create the name for the tab
        var rand = Math.floor(Math.random() * 100);  // create a unqiue id so duplicate table do not break 
        var tab_name_random = tab_name + rand;   // ad unique id to table name for element id name

        // append the tab name to the ul list in mytabs so the tab will appear and link it to the table. Also add a closing icon to the table
        $("#myTabs ul").append("<li><a href='#" + tab_name_random + "'>" + tab_name + "</a><span class='ui-icon ui-icon-circle-close close_btn'></span></li>");
        
        // create a new table and get the html for the table
        table_layout = new Table_Params(row_start, row_end, column_start, column_end);
        var table = table_layout.calculate_table();

        // add the table wrapped in a div to the mytable so it can be accessed by the tab
        $("#myTabs").append("<div class='tabtable' id='" + tab_name_random + "'><table>" + table + "</table></div>");
        $("#myTabs").tabs("refresh");
    })

    // if the closing icon is clicked then remove the table and its tab 
    $("#myTabs").on( "click", ".close_btn", function() {
        var table_id = $(this).closest("li").remove().attr("aria-controls");
        $("#"+table_id).remove();
        $("#myTabs").tabs("refresh");
    })
});

function process_table(){
    // get each value from the form for the table indexes
    var row_start = parseInt(document.getElementById('rowstart').value);
    var row_end = parseInt(document.getElementById('rowend').value);
    var column_start = parseInt(document.getElementById('columnstart').value);
    var column_end = parseInt(document.getElementById('columnend').value);

    // construct the table object
    table_layout = new Table_Params(row_start, row_end, column_start, column_end);
    var table = document.getElementById('multTable'); // get the table from the page
    table.innerHTML = table_layout.calculate_table();   // put the html table into the page
}
