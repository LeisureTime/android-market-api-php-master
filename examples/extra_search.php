<?php
include("local.php");
include("../proto/protocolbuffers.inc.php");
include("../proto/market.proto.php");
include("../Market/MarketSession.php");

$session = new MarketSession();
$session->login(GOOGLE_EMAIL, GOOGLE_PASSWD);
$session->setAndroidId(ANDROID_DEVICEID);

if(isset($_POST["type"]) && ($_POST["type"] =='SC' || $_POST["type"] =='I')){
	$appId		= $_POST["id"];
	$imageId	= 1;
	
	
	$gir = new GetImageRequest();
	if($_POST["type"]=='SC') $gir->setImageUsage(GetImageRequest_AppImageUsage::SCREENSHOT);
	else $gir->setImageUsage(GetImageRequest_AppImageUsage::ICON);
	$gir->setAppId($appId);
	$gir->setImageId($imageId);
	
	
	$reqGroup = new Request_RequestGroup();
	$reqGroup->setImageRequest($gir);
	$response = $session->execute($reqGroup);
	
	$groups = $response->getResponsegroupArray();
	#echo "<xmp>".print_r($groups, true)."</xmp>";
	
	foreach ($groups as $rg) {
		$imageResponse = $rg->getImageResponse();
		$imageData = $imageResponse->getImageData();		
		if($imageData){
			$appId = substr(md5(microtime()),0,15);
		if($_POST["type"] =='SC'){
			file_put_contents("../".$appId."_".$imageId."_SC.png", $imageData);
			?><img  src="<?php echo $appId."_".$imageId."_SC.png"; ?>" /><?php
		}else {
			file_put_contents("../".$appId."_".$imageId."_I.png", $imageData);
			?><img  src="<?php echo $appId."_".$imageId."_I.png"; ?>" /><?php
		}
		}else echo "This id:".$appId." Not supported to get image data";
		$imageId++;
	}
}else if(isset($_POST["type"]) && ($_POST["type"] =='D' || $_POST["type"] =='PR')){
	$ar = new AppsRequest();
	$appId		= $_POST["id"];
	$ar->setAppId($appId);
	$ar->setWithExtendedInfo(true);
	$reqGroup = new Request_RequestGroup();
$reqGroup->setAppsRequest($ar);

$response = $session->execute($reqGroup);

$groups = $response->getResponsegroupArray();
foreach ($groups as $rg) {
	$appsResponse = $rg->getAppsResponse();
	$apps = $appsResponse->getAppArray();
	foreach ($apps as $app) {
		if($_POST["type"] =='PR') echo ($app->getExtendedInfo()->hasPromoText())?$app->getExtendedInfo()->getPromoText():'';		
		else if($_POST["type"] =='D') echo nl2br ($app->getExtendedInfo()->getDescription());
	}
}
}