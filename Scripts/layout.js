Dom = YAHOO.util.Dom,
Event = YAHOO.util.Event,
Connect = YAHOO.util.Connect,
Calendar = YAHOO.widget.Calendar,
Button = YAHOO.widget.Button,
Class = YAHOO.example;

Event.onDOMReady(onLoadFunction);
meClass = Class;
var paginationDirection = null;
var paginationNo = 0;
var textBoxValue=null;
var newCols = true; 
var  myContextMenu ='';
var  myContextForum ='';
var  myContextForumMatch ='';

function onLoadFunction() {

}

//************************************************
//POPUP MESSAGE
//************************************************
function mePopup() {
var mePopup = arguments[0];
Popup = new YAHOO.widget.Panel(mePopup[0]+'_popup', { visible:false, draggable:true, fixedcenter:true, modal:true, close:true } );
Popup.render("container");
return Popup;
}


var meObjForRequest = null;
// ************************************************
// Liste
// ************************************************
meClass.list = function() {
  this.listClass = 'GeoSocials List';
  this.id = '';
  this.url = '';
  this.actionURL = '';
  this.page = null;
  this.builder = null;
  this.request = null;
  this.requestSort = '';
  this.rowclick = null;
  this.rowdbclick = null;
  this.cancel = null;
  this.myConfig = null;
  this.myDataSource = null;
  this.myDataTable = null;
  this.deleteElement = new Array();
  this.rowFormatter = null;
  this.settingsDialog = null;
  this._totalRecords = 0;
  this._results = 100;
  this.isContextMenu = false;
  this.isContextForum = false;
  this.isContextForumMatch = false;
  this.mouseOverToolTip = null;
}
meClass.list.prototype.id_setter = function() {this.id = arguments[0];} 
meClass.list.prototype.url_setter = function() {this.url = arguments[0];}
meClass.list.prototype.actionURL_setter = function() {this.actionURL = arguments[0];}
meClass.list.prototype.contextMenu_setter = function() {this.isContextMenu = arguments[0];}
meClass.list.prototype.contextForum_setter = function() {this.isContextForum = arguments[0];}
meClass.list.prototype.contextForumMatch_setter = function() {this.isContextForumMatch = arguments[0];}
meClass.list.prototype.toolTip_setter = function() {this.mouseOverToolTip = arguments[0];}
meClass.list.prototype.builder_setter = function() {this.builder = arguments[0];}
meClass.list.prototype.request_setter = function() {this.request = arguments[0];}
meClass.list.prototype.rowclick_setter = function() {this.rowclick = arguments[0];}
meClass.list.prototype.rowdbclick_setter = function() {this.rowdbclick = arguments[0];}
meClass.list.prototype.cancel_setter = function() {this.cancel = arguments[0];}
meClass.list.prototype.rowFormatter_setter = function() {this.rowFormatter = arguments[0];}


meClass.list.prototype.build = function() {
  meObj = (this.listClass) ? this : arguments[1][0];
  var myTable = meObj.builder();
  // DATASOURCE  
  meObj.myDataSource = new YAHOO.util.DataSource(
    meObj.url,
    {
      responseType : YAHOO.util.DataSource.TYPE_JSON,
      connXhrMode : "queueRequests",
      responseSchema : myTable.mySchema
    }
  );  
  
  //SET JUMP TO PAGE TEXTBOX FOR PAGINATION // USE {JumpToPageTextBox} in template
  
  // FOLLOWING METHOD CAN BE UNCOMMENTTED FOR PAGINATION  IF, WE NEED GO TO PAGE DROPDOWN
  //SET JUMP TO PAGE DROPDOWN FOR PAGINATION // USE {JumpToPageDropdown} in template
  //meObj.JumpToPageDropdown();
  /*PAGINATION*/
  
	

 
  

  //INITIAL CONFIGURATION
  meObj.myConfigs = {
          initialRequest: meObj.requestBuilder(meObj),
          dynamicData: true,          
          paginator:meObj.page,
          generateRequest : meObj.dynamicRequestBuilder,
          selectionMode: "standard",
          draggableColumns:false
      };

  // DATATABLE
  meObj.myDataTable = new YAHOO.widget.DataTable(meObj.id, myTable.myColumnDefs, meObj.myDataSource, meObj.myConfigs);
//Set up editing flow 
	var highlightEditableCell = function(oArgs) { 
	    var elCell = oArgs.target; 
	    if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) { 
	        this.highlightCell(elCell); 
	    } 
	}; 
  meObj.myDataTable.subscribe("cellMouseoverEvent", highlightEditableCell);   
  meObj.myDataTable.subscribe("cellMouseoutEvent", meObj.myDataTable.onEventUnhighlightCell);
  
 
  
  meObj.myDataTable.on(
    'rowClickEvent',
    function (oArgs) {
      meObj = this.obj;    
      var cell = oArgs.target;
      var record = this.getRecord(cell);
      var column = this.getColumn(cell);
	  meObj.rowclick(record.getData(),column,record);
      }	    
	);
  
  meObj.myDataTable.on('beforeRenderEvent',function() {
	//  $('input:checkbox').each(function() { $(this).remove(); }); 
		for (var i = 0; i<pbs.length; i++) {
			pbs[i].destroy();
		}
		pbs = [];
	});
  
  meObj.myDataTable.on(
		    'rowDblclickEvent',
		    function (oArgs) {
		      meObj = this.obj;
		    
		      var cell = oArgs.target;
		      var record = this.getRecord(cell);
		      var column = this.getColumn(cell);
		      var row = this.getTrEl(oArgs.target),
		      rec = this.getRecord(row);
              var isSelected = false;
				  if (row && rec) {
				      if (this.isSelected(rec)) {
				          this.unselectRow(rec);
				          isSelected = false;
				      } else {
				          this.selectRow(rec);
				          isSelected = true;
				      }
				  }
		      
		      meObj.rowdbclick(record.getData(),isSelected );
		      }	 
	);
  	

	/**********************************/
	//PAYLOAD DATA RETURNED FROM PARSER
	/**********************************/
	meObj.myDataTable.handleDataReturnPayload = function(oRequest, oResponse, oPayload) {
		if (oPayload == undefined) {
	        oPayload = {};
	    }
		 oPayload.totalRecords = oResponse.meta.totalRecords;
		//document.getElementById("total_records").innerHTML = oPayload.totalRecords;
	    return oPayload;
	}

  

  meObj.myDataTable.obj = meObj;
  meObj.myDataSource.obj = meObj;

  return true;  
}


meClass.list.prototype.onContextForumClick = function(p_sType, p_aArgs, meobj) {
	var task = p_aArgs[1];	
    if(task) {
    		var elRow = this.contextEventTarget;
	        elRow = meobj.myDataTable.getTrEl(elRow);
	        var oRecord = meobj.myDataTable.getRecord(elRow);
	        
	        if(!(oRecord.getData("ORDER_ID"))){
	        	Dom.get("forumTrans").value = oRecord.getData("PURCHASEID");
	        }else
	        	{        	
	        	Dom.get("forumTrans").value = oRecord.getData("PURCHASE_ID");  
	        	Dom.get("forumTransMatch").value = oRecord.getData("ORDER_ID");
	        	Dom.get("forumTransEbay").value = oRecord.getData("SUPPLIER_COMPANY_NAME");
	        	
	        }
	        customerRelation();
	 }
}


//PAGINATION DYNAMIC REQUEST 
meClass.list.prototype.dynamicRequestBuilder = function(oState,oSelf){
 oState = oState || {pagination:null, sortedBy:null};
  var sort ='';
  if(oState.sortedBy)  sort = oState.sortedBy.key;
  var dir = (oState.sortedBy && oState.sortedBy.dir === YAHOO.widget.DataTable.CLASS_DESC) ? "desc" : "asc";
  var startIndex = (oState.pagination != null) ? oState.pagination.recordOffset : 0;
  var results = (oState.pagination != null) ? oState.pagination.rowsPerPage : 10;
    
	var requestArray = new Array();
	requestArray.push((oSelf.obj.request()=='') ? 'null' : oSelf.obj.request());
	return "?sort="+sort+"&dir="+dir+"&startIndex="+startIndex+"&results="+results+"&"+requestArray.join("&");
}

//JUMPTO PAGE TEXTBOX
meClass.list.prototype.JumpToPageTextBox = function () { 
	 var Paginator = YAHOO.widget.Paginator;
	  var  l         = YAHOO.lang;	 
	  Paginator.ui.JumpToPageTextBox = function (p) {
	      this.paginator = p;
	      p.subscribe('rowsPerPageChange',this.rebuild,this,true);
	      p.subscribe('rowsPerPageOptionsChange',this.rebuild,this,true);
	      p.subscribe('pageChange',this.update,this,true);
	      p.subscribe('totalRecordsChange',this.rebuild,this,true);
	      p.subscribe('destroy',this.destroy,this,true);
	  };

	  Paginator.ui.JumpToPageTextBox.init = function (p) {
	      p.setAttributeConfig('jumpToPageTextBoxClass', {
	          value : 'yui-pg-jtp-text',
	          validator : l.isNumber
	      });
	  };

	  Paginator.ui.JumpToPageTextBox.prototype = {
	      textbox  : null,    
	      render : function (id_base) {
	          this.textbox = document.createElement('Input');
	          this.textbox.type ="text";
	          this.textbox.id        = id_base + '-jtp';
	          this.textbox.className = this.paginator.get('jumpToPageTextBoxClass');
	          this.textbox.title = 'Jump to page';
	          YAHOO.util.Event.on(this.textbox,'keypress',this.onKeyPress,this,true);
	          this.rebuild();
	          return this.textbox;
	      },  
	      rebuild : function (e) {
	          this.update();
	      },
	      update : function (e) {
	          if (e && e.prevValue === e.newValue) {
	              return;
	          }
	          var cp      = this.paginator.getCurrentPage();
	          this.textbox.value=cp;
	      },
	      onKeyPress : function (event) {
	      	    var key = window.event ? event.keyCode : event.which;
	      	    if((key<48||key>57)&&(key!=8)&&(key!=9)&&(key!=46)&&(key!=13)) {
	      	     // event.returnValue=false; event.cancelBubble=true;
	      	      //event.preventDefault(); event.stopPropagation();
	      	    	YAHOO.util.Event.stopEvent(event);
	      	    }
	      	    if (key==13) {
	      	    	var p=this.paginator;
	      	    	var pageNb=parseInt(this.textbox.value,10);
	      	    	var nbPage=parseInt(p.getTotalPages(),false);
	      	    	if (nbPage<pageNb) this.textbox.value = nbPage;
	      	    	if (pageNb<1)this.textbox.value =1;
	      	    	this.paginator.setPage(parseInt(this.textbox.value,false));
	      	    }
	      },
	      destroy : function () {
	          YAHOO.util.Event.purgeElement(this.textbox);
	          this.textbox.parentNode.removeChild(this.textbox);
	          this.textbox = null;
	      }
	  };
}

//JUMPTO PAGE DROPDOWN
meClass.list.prototype.JumpToPageDropdown = function () {
	 var Paginator = YAHOO.widget.Paginator;
	  var  l         = YAHOO.lang;
	Paginator.ui.JumpToPageDropdown = function (p) {
		    this.paginator = p;

		    p.subscribe('rowsPerPageChange',this.rebuild,this,true);
		    p.subscribe('rowsPerPageOptionsChange',this.rebuild,this,true);
		    p.subscribe('pageChange',this.update,this,true);
		    p.subscribe('totalRecordsChange',this.rebuild,this,true);
		    p.subscribe('destroy',this.destroy,this,true);
	};
	Paginator.ui.JumpToPageDropdown.init = function (p) {
		    p.setAttributeConfig('jumpToPageDropdownClass', {
		        value : 'yui-pg-jtp-options',
		        validator : l.isNumber
		    });
	};		
	Paginator.ui.JumpToPageDropdown.prototype = {
		    select  : null,
		    render : function (id_base) {
		        this.select = document.createElement('select');
		        this.select.id        = id_base + '-jtp';
		        this.select.className = this.paginator.get('jumpToPageDropdownClass');
		        this.select.title = 'Jump to page';
		        YAHOO.util.Event.on(this.select,'change',this.onChange,this,true);
		        this.rebuild();
		        return this.select;
		    },
		    rebuild : function (e) {
		        var p       = this.paginator,
		            sel     = this.select,
		            numPages = p.getTotalPages(),
		            opt,cfg,val,i,len;
		        this.all = null;
		        for (i = 0, len = numPages; i < len; ++i ) {
		            opt = sel.options[i] ||
		                  sel.appendChild(document.createElement('option'));
		            opt.innerHTML = i + 1;                                  
		            opt.value = i + 1;                                      
		        }
		        for ( i = numPages, len = sel.options.length ; i < len ; i++ ) {
		            sel.removeChild(sel.lastChild);
		        }
		        this.update();
		    },
		    update : function (e) {
		        if (e && e.prevValue === e.newValue) {
		            return;
		        }
		        var cp      = this.paginator.getCurrentPage()+'',
		            options = this.select.options,
		            i,len;
		        for (i = 0, len = options.length; i < len; ++i) {
		            if (options[i].value === cp) {
		                options[i].selected = true;
		                break;
		            }
		        }
		    },
		    onChange : function (e) {
		        this.paginator.setPage(
		                parseInt(this.select.options[this.select.selectedIndex].value,false));
		    },
		    destroy : function () {
		        YAHOO.util.Event.purgeElement(this.select);
		        this.select.parentNode.removeChild(this.select);
		        this.select = null;
		    }
		};
}

//REBUILD FROM START 0
meClass.list.prototype.rebuild = function () {
  meObj = (this.listClass) ? this : arguments[1][0];
  meObj.myDataSource.sendRequest(
    meObj.requestBuilder(meObj),
    meObj.myDataTable.onDataReturnInitializeTable,
    meObj.myDataTable
  );
}

// INITIAL REQUESTBUILDER
meClass.list.prototype.requestBuilder = function() {	
  meObj = (this.listClass) ? this : arguments[1][0]; 
  var startIndex =0; 
  var requestArray = new Array();  
 // if (meObj.requestSort!='') requestArray.push(meObj.requestSort);
  requestArray.push((meObj.request()=='') ? 'null' : meObj.request());
  return '?startIndex='+startIndex+'&results=40&'+requestArray.join("&");
}

//COLUMN POPUP PANEL
meClass.list.prototype.showSettingsDialog = function() {
	meObj = (this.listClass) ? this : arguments[1][0];
   
if(newCols) { 
   var allColumns = meObj.myDataTable.getColumnSet().keys;
   var elPicker = YAHOO.util.Dom.get("dt-dlg-picker");
   var elTemplateCol = document.createElement("div");
   YAHOO.util.Dom.addClass(elTemplateCol, "dt-dlg-pickercol");
   var elTemplateKey = elTemplateCol.appendChild(document.createElement("span"));
   YAHOO.util.Dom.addClass(elTemplateKey, "dt-dlg-pickerkey");
   var elTemplateBtns = elTemplateCol.appendChild(document.createElement("span"));
   YAHOO.util.Dom.addClass(elTemplateBtns, "dt-dlg-pickerbtns");
   var onclickObj = {fn:meObj.handleButtonClick, obj:this, scope:false };
   
   // Create one section in the SimpleDialog for each Column
   var elColumn, elKey, elButton, oButtonGrp;
   for(var i=0,l=allColumns.length;i<l;i++) {
       var oColumn = allColumns[i];
       elColumn = elTemplateCol.cloneNode(true);
       elKey = elColumn.firstChild;
       elKey.innerHTML = oColumn.label;
       //elKey.innerHTML = oColumn.getKey();
       oButtonGrp = new YAHOO.widget.ButtonGroup({ 
                       id: "buttongrp"+i, 
                       name: oColumn.getKey(), 
                       container: elKey.nextSibling
       });
       oButtonGrp.addButtons([
           { label: "Show", value: "Show", checked: ((!oColumn.hidden)), onclick: onclickObj},
           { label: "Hide", value: "Hide", checked: ((oColumn.hidden)), onclick: onclickObj}
       ]);             
       elPicker.appendChild(elColumn);
   }
   newCols = false;
}
    mecolumnPopup.show();
}

//HIDE COLUMN PANEL 
meClass.list.prototype.hideDlg = function(e) {this.hide();}

//BUTTON ON COLUMN PANEL
meClass.list.prototype.handleButtonClick = function() {
          var sKey = this.get("name");
          if(this.get("value") === "Hide") {
        	  meObj.myDataTable.hideColumn(sKey);        	  
        	//  Dom.addClass(Dom.getElementsByClassName(sKey),"hideColumn");
          }          else {meObj.myDataTable.showColumn(sKey);
        	  		 //     Dom.removeClass(Dom.getElementsByClassName(sKey),"hideColumn");
          }
}

//************************************************
//CALENDAR
//************************************************
meClass.calendar = function() {
this.id = "meCalendar";
}
meClass.calendar.prototype.init = function() {
var idCalendar = this.id;
var navConfig = {
 strings : {
   month: "Choose the Month",
   year: "Enter the Year",
   submit: "Ok",
   cancel: "Cancel",
   invalidYear: "this is not a valid year"
 },
 monthFormat: Calendar.MONTHS_LONG,
 initialFocus: "year"
};

var calendarEffect =  function() {
 var title = Dom.getElementsByClassName('title', 'div', cal.oDomContainer)[0];
 var dd = new YAHOO.util.DD(idCalendar);
 dd.setHandleElId(title);
}
var calendarDate = function() {
 Dom.get(cal.inputToSet).value = cal.getSelectedDates()[0].dateFormat();
 cal.hide();
}

var cal = new Calendar(idCalendar, idCalendar, {navigator:navConfig});
cal.cfg.setProperty("close", true);
cal.cfg.setProperty("DATE_FIELD_DELIMITER", "/");
cal.cfg.setProperty("MDY_DAY_POSITION", 1);
cal.cfg.setProperty("MDY_MONTH_POSITION", 2);
cal.cfg.setProperty("MD_DAY_POSITION", 1);
cal.cfg.setProperty("MDY_YEAR_POSITION", 3);
cal.cfg.setProperty("MD_MONTH_POSITION", 2);
cal.cfg.setProperty("MONTHS_LONG", ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
cal.cfg.setProperty("WEEKDAYS_SHORT", ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
cal.renderEvent.subscribe(calendarEffect);
cal.selectEvent.subscribe(calendarDate); 
cal.render();
return cal;
}
meClass.calendar.prototype.build = function() {
var meCal = this.init();
var imgClick = new Array();
for (var i=0; i< arguments[0].length; i++) {	
 Event.addListener(arguments[0][i], "click",this.show,[meCal,arguments[0][i]],true);
 Event.addListener(arguments[0][i], "mouseover",this.show,[meCal,arguments[0][i]],true);
 Event.addListener(arguments[0][i]+"_delete", "click",this.resetdate,[meCal,arguments[0][i]],true);
 imgClick.push(Dom.get(arguments[0][i]));
}
Event.addListener(document,"click",this.hide,[meCal,imgClick],true);
meCal.hide();
return meCal;
}
meClass.calendar.prototype.hide = function() {
var kedEl = Event.getTarget(arguments[0]);
var calEl = Dom.get(arguments[1][0].id);
var imgBool = new Boolean(true);
for (var i=0; i< arguments[1][1].length; i++) { imgBool = imgBool && kedEl!=arguments[1][1][i] && !Dom.isAncestor(arguments[1][1][i],kedEl); }
if (kedEl != calEl && !Dom.isAncestor(calEl, kedEl) && imgBool) {arguments[1][0].hide();}
}
meClass.calendar.prototype.resetdate = function() {
this[0].hide();
Dom.get(this[1]).value='';
}
meClass.calendar.prototype.show = function() {
var meXY = Dom.getXY(this[1]);
meXY[0] = meXY[0]-108;
meXY[1] = meXY[1]+20;
this[0].inputToSet = this[1];
var meDate = (Dom.get(this[1]).value.dateVide()) ? new Date():new Date(Dom.get(this[1]).value.toDate());
this[0].cfg.setProperty("pagedate",meDate, true);
this[0].render();
this[0].show();
Dom.setXY(Dom.getElementsByClassName("meCalendar"),meXY);
Dom.setStyle(Dom.getElementsByClassName("meCalendar"),"zIndex",1000);
}

//************************************************
//Date & String PROTOTYPE
//************************************************
String.prototype.date = function() {
var datePat = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
var matchArray = this.toString().match(datePat);
if (matchArray != null) { return new Date(matchArray[5],(matchArray[3]-1),matchArray[1]); }
else { return new Date(); } 
}
String.prototype.toDate = function() {
var datePat = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
var matchArray = this.toString().match(datePat);
if (matchArray == null) { return new Date(); }
else { return matchArray[3]+"/"+matchArray[1]+"/"+matchArray[5]; } 
}
String.prototype.dateVide = function() {
var datePat = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
var matchArray = this.toString().match(datePat);
if (matchArray == null||matchArray[5]=='0000') { return true; }
else { return false; } 
}
Date.prototype.dateFormat = function() {
var dateValue = this;
var format = (arguments.length==1) ? arguments[0].toString() : "MM-DD-YYYY";
var fmt = format.toUpperCase();
var re = /^(M|MM|D|DD|YYYY)([\-\/]{1})(M|MM|D|DD|YYYY)(\2)(M|MM|D|DD|YYYY)$/;
if (!re.test(fmt)) { fmt = "MM-DD-YYYY"; }
if (fmt.indexOf("M") == -1) { fmt = "MM-DD-YYYY"; }
if (fmt.indexOf("D") == -1) { fmt = "MM-DD-YYYY"; }
if (fmt.indexOf("YYYY") == -1) { fmt = "MM-DD-YYYY"; }

var M = "" + (dateValue.getMonth()+1);
var MM = "0" + M;
MM = MM.substring(MM.length-2, MM.length);
var D = "" + (dateValue.getDate());
var DD = "0" + D;
DD = DD.substring(DD.length-2, DD.length);
var YYYY = "" + (dateValue.getFullYear());

var sep = "-";
if (fmt.indexOf("-") != -1) { sep = "-"; }
var pieces = fmt.split(sep);
var result = "";

switch (pieces[0]) {
 case "M" : result += M + sep; break;
 case "MM" : result += MM + sep; break;
 case "D" : result += D + sep; break;
 case "DD" : result += DD + sep; break;
 case "YYYY" : result += YYYY + sep; break;
}
switch (pieces[1]) {
 case "M" : result += M + sep; break;
 case "MM" : result += MM + sep; break;
 case "D" : result += D + sep; break;
 case "DD" : result += DD + sep; break;
 case "YYYY" : result += YYYY + sep; break;
}
switch (pieces[2]) {
 case "M" : result += M; break;
 case "MM" : result += MM; break;
 case "D" : result += D; break;
 case "DD" : result += DD; break;
 case "YYYY" : result += YYYY; break;
}
return result;
}

//************************************************
//DOM YUI EXTEND
//************************************************
Dom.getElementsByName = function() {return document.getElementsByName(arguments[0]);}
Dom.getRadio = function() {
var meReturn = null;
var meRadio = document.getElementsByName(arguments[0]);
for (var i=0; i<meRadio['length']; i++) {
 if (meRadio[i].checked) meReturn = meRadio[i];
}
return meReturn;
}
Dom.getRadioElementValue = function() {
var meReturn = null;
var meRadio = document.getElementsByName(arguments[0]);

for (var i=0; i<meRadio['length']; i++) {
 if (meRadio[i].checked) meReturn = meRadio[i].value;
}
return meReturn;
}

var checkPrice = function (event) {
    var key = window.event ? event.keyCode : event.which;
    if((key<48||key>57)&&(key!=8)&&(key!=9)&&(key!=46)&&(key!=13)) {
      event.returnValue=false; event.cancelBubble=true;
      event.preventDefault(); event.stopPropagation();
    }
}   

//mail ?
function isEmail(str) {
  var re = /^([a-zA-Z0-9]+(([\.\-\_]?[a-zA-Z0-9]+)+)?)\@(([a-zA-Z0-9]+[\.\-\_])+[a-zA-Z]{2,4})$/
  return re.test(str);
}

/*
//French phone number
function isPhoneNumber(str) {
  var re = /^(0[1-9][-.\s]?(\d{2}[-.\s]?){3}\d{2})$/
  return re.test(str);
}*/


//UNIQUE ARRAY VALUE
Array.prototype.unique = function () {
	var r = new Array();
	o:for(var i = 0, n = this.length; i < n; i++){
		for(var x = 0, y = r.length; x < y; x++){
			if(r[x]==this[i]){continue o;}
		}
		r[r.length] = this[i];
	}
	return r;
}

//REMOVE VALUE FROM ARRAY
Array.prototype.removeByValue = function(val) {
	for(var i=0; i<this.length; i++) {
		if(this[i] == val) {
			this.splice(i, 1);
			break;
		}
	}
}


