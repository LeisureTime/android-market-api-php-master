Dom = YAHOO.util.Dom,
Event = YAHOO.util.Event,
Connect = YAHOO.util.Connect,
JSON = YAHOO.lang.JSON;
Event.onDOMReady(meOnload);
var temp = {};
var pbs = [];
var start = 10;
var int=0;
var intervalId = null;
function meOnload() {
	 // 
	  meSupplierDtlsPopup = mePopup(['appDetails']);
	  meSupplierDtlsPopup.cfg.setProperty("height","700px");
	  meSupplierDtlsPopup.cfg.setProperty("width","800px");
	  meSupplierDtlsPopup.cfg.setProperty("close",true);
	  meSupplierDtlsPopup.cfg.setProperty("modal",true);
	  
	  meAppExtraPopup = mePopup(['appExtra']);
	 // meAppExtraPopup.cfg.setProperty("height","700px");
	  meAppExtraPopup.cfg.setProperty("close",true);
	  meAppExtraPopup.cfg.setProperty("modal",true);
	 // QUESTIONLIST	
	  analyserListClass = new Class.list();
	  analyserListClass.id_setter(analyserListObject.id); 
	  analyserListClass.url_setter(analyserListObject.url);
	  analyserListClass.actionURL_setter(analyserListObject.actionURL);
	  analyserListClass.contextForum_setter(analyserListObject.contextForum);
	  analyserListClass.builder_setter(analyserListObject.builder);
	  analyserListClass.request_setter(analyserListObject.request);
	  analyserListClass.rowclick_setter(analyserListObject.rowclick);
	  analyserListClass.rowdbclick_setter(analyserListObject.rowdbclick);
	  analyserListClass.cancel_setter(analyserListObject.cancel);	  
	  //analyserListClass.build();
	  Event.addListener("searchBt", "click", getAndroidMarketList);
	  //Event.addListener("analyser", "click", function(){ meSupplierDtlsPopup.show();});
	  Event.addListener("analyser", "click", showPopup);
	  
	  //Event.addListener("popupBt", "click", showPopup );
	  //Event.addListener("deleteBt", "click", deleteBtById);
	 // Event.addListener("filterByLogoNameBt", "click", filterByLogoName);
}

function checkBoxAll(){
	var chk_arr =  document.getElementsByName("appid[]");
	 var chklength = chk_arr.length;
	 var isChecked = false;
	
	 if (Dom.get("checkAll").checked) isChecked = true;
	 for(k=0;k< chklength;k++){
		 chk_arr[k].checked = isChecked;
	 }
}

function extraPopUp(){
    var meHandler = {
      		success: function(o) {
    			var data = arguments[0].responseText;
    			Dom.get("extraData").innerHTML = data;
    			meAppExtraPopup.show();
    		},
      		failure: function(o) {alert("failed to Call pop up");},
      		timeout:10000
      	};
      	Dom.get("id").value=arguments[0];
      	Dom.get("type").value=arguments[1];
      	Dom.get("deviceType").value = Dom.getRadioElementValue("group1");
      	
      	Connect.setForm('meForm');
      	Connect.asyncRequest('POST','examples/extra_search.php', meHandler);
}

function showPopup(){
	 var meHandler = {
	      		success: function(o) {
	    			var data = arguments[0].responseText;
	    			//if (data.retour) {
	    			Dom.get("AnalyserData").innerHTML = data;
	    				meSupplierDtlsPopup.show();
	      		  	//}
	    		},
	      		failure: function(o) {alert("failed to Call pop up");},
	      		timeout:10000
	      	};
	 var appId = new Array();    	
	 var chk_arr =  document.getElementsByName("appid[]");
	 var chklength = chk_arr.length;
	 for(k=0;k< chklength;k++){
		 if(chk_arr[k].checked) appId.push(temp[chk_arr[k].value]);
	 }
	 
	Dom.get("txt").value=appId.getUnique().toString();
  	Connect.setForm('meForm');
  	Connect.asyncRequest('POST','examples/descAnalyser.php', meHandler);
}


var analyserListObject = {
		  id : 'analyserList',
		  url : 'examples/analyser_top_search.php',
		  actionURL : '#',
		  contextForum : false,
		  paginator : true,
		  builder : function () {
		    myIdRowElement = 'id';
		    myColumnDefs=[							
		                  	{ key: "desc",label:'...',formatter:function(elLiner, oRecord, oColumn, oData) {
								var desc = oRecord.getData('desc');	 
								var id = oRecord.getData('id');	 
								elLiner.innerHTML = '<input type="checkbox" name="appid[]" value="'+id+'" />';	
								temp[id] = desc;
							}},
		                  	{ key: "package", label:"Link",formatter:setLink, width:300},
		                  	{ key: "price", label:"Price", sortable:true},
							{ key: "name",label:"App name", sortable:true, width:400},
							{ key: "rating",label:"Total Ratings", sortable:true},
							{ key: "downloads",label:"Downloads", sortable:true},
							{ key: "star_rating",label:"Stars",sortable:true,  formatter:ratingFormatter},							
							{ key:"desc", label:"-", formatter:function(elLiner, oRecord, oColumn, oData) {
								var id = oRecord.getData('id');	 
								elLiner.innerHTML = '<a href="javascript: extraPopUp(\''+id+'\',\'D\');">Description </a>';	
							}},
							{ key:"screenshots", label:"--", formatter:function(elLiner, oRecord, oColumn, oData) {
								var id = oRecord.getData('id');	 
								elLiner.innerHTML = '<a href="javascript: extraPopUp(\''+id+'\',\'SC\');">ScreenShot</a>';	
							}},
							/*{key:"keywords", label:"-", formatter:function(elLiner, oRecord, oColumn, oData) {
								var id = oRecord.getData('id');	 
								//elLiner.innerHTML = '<a href="javascript: extraPopUp(\''+id+'\',\'KW\');">KW</a>';
								elLiner.innerHTML = 'KW';
							}},*/
							{ key:"icon", label:"--", formatter:function(elLiner, oRecord, oColumn, oData) {
								var id = oRecord.getData('id');	 
								elLiner.innerHTML = '<a href="javascript: extraPopUp(\''+id+'\',\'I\');">Icon</a>';	
							}},
							{ key:"promotext", label:"--", formatter:function(elLiner, oRecord, oColumn, oData) {
								var id = oRecord.getData('id');	 
								elLiner.innerHTML = '<a href="javascript: extraPopUp(\''+id+'\',\'PR\');">PR</a>';
							}}
		                  ];
		     mySchema = {
		      resultsList: "data", 
		      fields: ["id", "name","rating","price","downloads", "star_rating","package", "desc", "promotext"],
		      metaFields: {totalRecords: "totalRecords"}
		    };
		    return  {
		      myColumnDefs: myColumnDefs,
		      mySchema: mySchema,
		      myIdRowElement : myIdRowElement
		    }
		  },
		  request : function() {
		    var requestArray = new Array();
		    if(Dom.get("keyword").value !='')   requestArray.push("keyword="+Dom.get("keyword").value);
		    if(Dom.get("categoryList").value !='')   requestArray.push("categoryList="+Dom.get("categoryList").value);
		    if(Dom.get("viewType").value !='')   requestArray.push("viewType="+Dom.get("viewType").value);
		    if(Dom.get("orderType").value !='')   requestArray.push("orderType="+Dom.get("orderType").value);
		    if(Dom.get("start").value !='')   requestArray.push("start="+Dom.get("start").value);
		    //if(Dom.get("end").value !='')   requestArray.push("end="+Dom.get("end").value);
		    if(Dom.getRadioElementValue("group1")!='')   requestArray.push("deviceType="+Dom.getRadioElementValue("group1"));
		    return requestArray.join("&");		   
		  },
		  rowclick : function() {
		    var meData = arguments[0];	
		    //Dom.get("extraData").innerHTML = meData["promotext"];
		    //meAppExtraPopup.show();
		    //alert(meData["package"] +" "+arguments[1]);
		  },
		  rowdbclick : function() {},
		  validate: function() {}
};


var ratingFormatter = function (elLiner, oRecord, oColumn, oData) {
	var pb = new YAHOO.widget.ProgressBar({
		width:'90px',
		height:'18px',
		maxValue:5,
		className:'ratings',
		value:Math.round(oData*10)/10
	}).render(elLiner);
	pbs.push(pb);
};

function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
}
function checkit(){
	if(int==3) {
		clearInterval(intervalId); 
		int =0;
		Dom.get("start").value = '';
		Dom.get("analyserList").style.display="block";
		Dom.get("ajaxloading").style.display="none";
		Dom.get("analyser").style.display="block";
	}
	else {
		//alert(int +" "+start);
		Dom.get("start").value = int*start;
		analyserListClass.build();
	}
	int++;
}

getAndroidMarketList = function(){
	Dom.get("ajaxloading").style.display="block";
	Dom.get("analyserList").style.display="none";
	Dom.get("analyser").style.display="none";
	int =0;
	//meSupplierDtlsPopup.show();
	Event.addListener("checkAll", "click", checkBoxAll);
	temp = [];	
	checkit();
	intervalId = setInterval(checkit, 5000);
};



setLink = function(elLiner, oRecord, oColumn, oData) {
		elLiner.innerHTML = '<a href="https://play.google.com/store/apps/details?id='+oData+'" target="_new" >'+oRecord.getData('name')+'</a>';	
};

Array.prototype.getUnique = function(){
	   var u = {}, a = [];
	   for(var i = 0, l = this.length; i < l; ++i){
	      if(u.hasOwnProperty(this[i])) {
	         continue;
	      }
	      a.push(this[i]);
	      u[this[i]] = 1;
	   }
	   return a;
};