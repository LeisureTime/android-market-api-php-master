<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Android Market Analyzer</title>
<script type="text/javascript" src="Scripts/yui.js"></script>
<script type="text/javascript" src="Scripts/layout.js"></script>
<script type="text/javascript" src="Scripts/analyser.js"></script>

<script type="text/javascript" src="Scripts/jquery.min.js"></script>
<script type="text/javascript" src="Scripts/jquery.rateit.js"></script>

<link rel="stylesheet" href="Styles/yui.css" />
<link rel="stylesheet" href="Styles/css.css" />
<link rel="stylesheet" href="Styles/rateit.css" />

<style type="text/css">
.yui-skin-sam .align-right {
	text-align: right;
}

.alignCenter yui-dt0-col-image_name yui-dt-col-image_name {
	text-align: center;
}
</style>
<link href="style.css" rel="stylesheet">

<style type="text/css">
.yui-skin-sam .ratings {
	background: transparent url(Styles/star-bg.png) repeat-x 0 0;
	border:0;
}
.yui-skin-sam .ratings .yui-pb-mask {
	border:0;
}
.yui-skin-sam .ratings .yui-pb-bar  {
	background: transparent url(Styles/star.png) repeat-x 0 0;
}

/* Just a little decoration for the page, not relevant to the usage of the progress bar */

.dp-highlighter th, .dp-highlighter td {
	border:0;
	padding:0;
}
.dp-highlighter .line1, .dp-highlighter  .line2 {
	padding-left:10px;
	white-space:nowrap;
}
</style>

</head>

<body class="yui-skin-sam">
<h1>Android Market Analyser</h1>
	<div class="wrap">
		<div class="header1">
			<div class="keywordArea">KeyWord:<input type="text" name="keyword"  id="keyword" /></div>
			<div class="deviceHeader">
			<label for="op1">Galaxy Tab</label> <input type="radio" id="op1" name="group1" value="GL"/>
			<!-- <label for="op2">Samsung Mid</label> <input type="radio" id="op2" name="group1" value="SL"/> -->
			<label for="op3">Samsung Galaxy S</label> <input type="radio" id="op3" name="group1" value="SH"/>
			</div>	 
		</div>
		<h1>OR</h1>
		<div class="header2">
			Category:<select id="categoryList" name="categoryList">
			<!-- <option value="APPLICATION">All applications</option> -->
			<option value="BOOKS_AND_REFERENCE">Books & Reference</option>
			<option value="BUSINESS">Business</option>
			<option value="COMMUNICATION">Communication</option>
			<option value="HEALTH_AND_FITNESS">Health & Fitness</option>
			
			<option value="FINANCE">Finance</option>
			<option value="LIFESTYLE">Lifestyle</option>
			
			<option value="PHOTOGRAPHY">Photography</option>
			<option value="PRODUCTIVITY">Productivity</option>
			<option value="SHOPPING">Shopping</option>
			<option value="SOCIAL">Social</option>
			<option value="SPORTS">Sports</option>
			
			<option value="TOOLS">Tools</option>
			<option value="TRANSPORTATION">Transportation</option>
			<option value="TRAVEL_AND_LOCAL">Travel & Local</option>
			<option value="APP_WIDGETS">Widgets</option>
			<option value="LIBRARIES_AND_DEMO">Libraries & Demo</option>
			</select>
					
		</div>
		<div class="header3">
			<div class="header3_top1">
				<div class="header3_top1_title">Filters:</div>
				<div class="viewTypeArea">
					View Type:<select id="viewType" name="viewType">
						<option value="0">ALL</option>
						<option value="1">FREE</option>
						<option value="2">PAID</option>
					</select>
				</div>
				<div class="orderTypeArea">
					Order Type:
					<select id="orderType" name="orderType">
						<option value="0">NONE</option>
						<option value="1">POPULAR</option>
						<option value="2">NEWEST</option>
						<option value="3">FEATURED</option>
					</select>
				</div>
			</div>

			<div class="header3_top2">
				<div class="header3_top2_title"></div>
				<div class="startArea">
					<input type="hidden" name="start" id="start" />
				</div>
				<div class="endArea">
					<!-- End<input type="text" name="end" id="end" /> (Optional) -->
				</div>
				<div class="searchArea">
					<input type="button" value="Search" name="searchBt" id="searchBt" />
					
				</div>
			</div>
		</div>
	</div>
<div style="padding: 20px 0px 20px;">check All:<input type="checkbox" name="checkAll" id="checkAll" value="fff"/></div>
	<div class="resultTable">
		<div id="ajaxloading" style="display: none;"><img src="image/ajax-loader2.gif" /></div>
		<div id="analyserList" class="table"></div>
		
	</div>

<div id="analyserArea"><input type="button" name="analyser" id="analyser" value="Analyser"/></div>
<!--  column popup for hide and show -->
<div id="appDetails_popup" class="Detaildata" style="width: 700px;list-style-type: none;">
	<div class="hd">Android Market Analyser</div>
       <div class="DataField" id="AnalyserData">
    	
      </div>
 </div>
 
 <!--  column popup for hide and show -->
<div id="appExtra_popup" class="Detaildata" style="width: 700px;list-style-type: none;">
	<div class="hd">Extra Details</div>
       <div class="DataField" id="extraData">
    	
      </div>
 </div>
 <form name="meForm" id="meForm" method="post">
 <input type="hidden" name="txt" id="txt" value=""/>
 
  <input type="hidden" name="id" id="id" value=""/>
   <input type="hidden" name="type" id="type" value=""/>
    <input type="hidden" name="deviceType" id="deviceType" value=""/>
 </form>
</body>
</html>
