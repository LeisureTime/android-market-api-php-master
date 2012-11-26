<?php
function getAMAList() {
	$con = mysql_connect("localhost","root","");
	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("android-market-analyser", $con);

	if(isset($_GET["startIndex"])) $startIndex = $_GET["startIndex"];
	else $startIndex = 0;
	if(isset($_GET["pageSize"])) $pageSize = $_GET["pageSize"];
	else $pageSize = 100;
	if(isset($_GET["dir"]) && $_GET["dir"]!='' && isset($_GET["sort"]) && $_GET["sort"]!='')	{
		$dir = $_GET["dir"];
		$sort = $_GET["sort"];
	}
	else {
		$dir = "";
		$sort = "";
	}
	
	 $qry="SELECT SQL_CALC_FOUND_ROWS `id` ,
			`name` ,
			`rating` ,
			`price` ,
			`downloads` ,
			`star_rating` ,
			`package` ,`desc` ,
			`promotext` FROM `market-analyser` ORDER BY $sort $dir LIMIT $startIndex,$pageSize";
	$result = mysql_query($qry);
	$temp = array();
	while($row = mysql_fetch_array($result))
	{
		
		array_push($temp, $row);
	}

	$query_result= mysql_query("SELECT FOUND_ROWS() AS totalRecords ");
	$query_count = mysql_fetch_array($query_result);

	$data = array(0=>$temp,
	1=>$query_count[0],
	2=>$sort,
	3=>$dir);
	return $data;
}




	$data = getAMAList();
	echo '
		      {      
		      "totalRecords" : ' . $data[1] . ',
		      "startIndex" : ' . $_GET['startIndex'] . ',      
		      "sort" : "' . $data[2] . '",
		      "dir" : "' . $data[3] . '",
		      "pageSize" : ' . $_GET['results'] . ',
		      "data" : ' . json_encode($data[0]) . '
		      }';


