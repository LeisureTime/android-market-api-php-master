<?php
if(isset($_GET["dir"]) && $_GET["dir"]!='' && isset($_GET["sort"]) && $_GET["sort"]!='')	{
	include("tablelist.php");
}else{
	include("local.php");
	include("../proto/protocolbuffers.inc.php");
	include("../proto/market.proto.php");
	include("../Market/MarketSession.php");

	$session = new MarketSession();
	$session->login(GOOGLE_EMAIL, GOOGLE_PASSWD);
	$session->setAndroidId(ANDROID_DEVICEID);

	$ar = new AppsRequest();
	$orderType = 0;
	if(isset($_GET["orderType"]) && !empty($_GET["orderType"])) $orderType = $_GET["orderType"];
	$ar->setOrderType($orderType);

	$viewType = 0;
	if(isset($_GET["viewType"]) && !empty($_GET["viewType"])) $viewType = $_GET["viewType"];
	$ar->setViewType($viewType);

	$start = 0;
	if(isset($_GET["start"]) && !empty($_GET["start"])) $start = $_GET["start"];
	$ar->setStartIndex($start);

	$ar->setEntriesCount(10);
	if(isset($_GET["keyword"]) && !empty($_GET["keyword"])) {
	$ar->setQuery($_GET["keyword"]);
	}else {
		if(isset($_GET["categoryList"]) && !empty($_GET["categoryList"]))
		$ar->setCategoryId(strtoupper($_GET["categoryList"]));
	}
	$ar->setWithExtendedInfo(true);
	//$ar->setAppType(0);
	$reqGroup = new Request_RequestGroup();
	$reqGroup->setAppsRequest($ar);

	//$gir = new GetImageRequest();
	//$gir->setImageUsage(GetImageRequest_AppImageUsage::SCREENSHOT);
	//$reqGroup->setImageRequest($gir);
	$response = $session->execute($reqGroup);

	$groups = $response->getResponsegroupArray();
	$appData = array();

	$link = mysqli_connect("localhost","root","","android-market-analyser");
	/* check connection */
	if (mysqli_connect_errno()) {
		printf("Connect failed: %s\n", mysqli_connect_error());
		exit();
	}
	$isTruncated = false;
	if(!$start){
		if(mysqli_query($link,"TRUNCATE TABLE `market-analyser`") or die (mysqli_error())){
			$isTruncated = true;
		}
	}

	foreach ($groups as $rg) {
		//$imageResponse = $rg->getImageResponse();
		$appsResponse = $rg->getAppsResponse();
		$apps = $appsResponse->getAppArray();
		foreach ($apps as $app) {
			//echo $app->getTitle()." (".$app->getId().")<br/>";
			//echo "</div>";
			$row = array();

			$row["id"] = $app->getId();
			$row["name"] = $app->getTitle();
			$row["rating"] = ($app->hasRatingsCount())?$app->getRatingsCount():'';
			$row["price"] = ($app->hasPrice())?$app->getPrice():'';
			$row["downloads"] = ($app->getExtendedInfo()->hasDownloadsCountText())?$app->getExtendedInfo()->getDownloadsCountText():'';
			$row["star_rating"] = ($app->hasRating())?$app->getRating():'';
			$row["package"] = ($app->hasPackageName())?$app->getPackageName():'';
			$row["desc"] = ($app->getExtendedInfo()->hasDescription())?$app->getExtendedInfo()->getDescription():'';
			$row["promotext"] = ($app->getExtendedInfo()->hasPromoText())?$app->getExtendedInfo()->getPromoText():'';
			//array_push($appData, $row);
			//unset($row["desc"]);
			//file_put_contents("../".$row["id"]."_1.png", $imageResponse->getImageData());
			mysqli_report (MYSQLI_REPORT_OFF);
				

			if ($stmt = mysqli_prepare($link, "INSERT INTO  `market-analyser` (
			`id` ,
			`name` ,
			`rating` ,
			`price` ,
			`downloads` ,
			`star_rating` ,
			`package` ,`desc` ,
			`promotext`
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
			mysqli_stmt_bind_param($stmt, "sssssssss", $row["id"], $row["name"], $row["rating"],
			$row["price"], $row["downloads"], $row["star_rating"],
			$row["package"], $row["desc"], $row["promotext"]);
			mysqli_stmt_execute($stmt);
			/* close statement */
			mysqli_stmt_close($stmt);
			}
		}

		if($start == 20){
			/* If we have to retrieve large amount of data we use MYSQLI_USE_RESULT */
			if ($result = mysqli_query($link, "SELECT * FROM `market-analyser`")) {
				while ($row = mysqli_fetch_object($result)){
					$data = array();
					$data["id"] = $row->id;
					$data["name"] = $row->name;
					$data["rating"] = $row->rating;
					$data["price"] = $row->price;
					$data["downloads"] = $row->downloads;
					$data["star_rating"] = $row->star_rating;
					$data["package"] = $row->package;
					$data["desc"] = $row->desc;
					$data["promotext"] = $row->promotext;
					array_push($appData, $data);
				}
				mysqli_free_result($result);
			}
		}
		/* close connection */
		mysqli_close($link);
		echo '
		      {      
		      "totalRecords" : ' . 30 . ',
		      "startIndex" : ' . 0 . ',
		      "data" : ' . json_encode($appData) . '
		      }';
	}
}