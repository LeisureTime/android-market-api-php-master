<?php
//$txt = (isset($_POST["txt"]) && !empty($_POST["txt"]))?$_POST["txt"]:'';

$stopwords = "I 
a 
about 
an 
are 
as 
at 
be 
by 
com 
de 
en
for 
from
how
in 
is 
it 
la 
of 
on 
or 
that
the 
this
to 
was 
what 
when
where
who 
will 
with
und
the
www
you
and
your
can
*
&
.";

$stopwords = explode("\n", $stopwords);
for($i = 0; $i < count($stopwords); $i++){
    $stopwords[$i] = trim($stopwords[$i]);
}

if (isset($_POST['txt'])){


    $in = $_POST['txt'];
    $in = str_replace(Array(".", ",", "-", '"', ")", "("), " ", $in);
    $in = str_replace("'", '', $in);
    $in = strip_tags($in);
    
    $tok = strtok($in, " \n");

    $toks = Array();

    while($tok !== false){
        if (trim($tok) && !in_array(trim($tok), $stopwords)){
            $toks[] = trim($tok);
        }
        $tok = strtok(" \n");
    }
    
    $totalcount = count($toks);

    //wordcount - 1 word
    $wordcount = Array();
    foreach($toks AS $word){
        $word = strtolower($word);
        if (!isset($wordcount[$word])){
            $wordcount[$word]=1;
        } else {
            $wordcount[$word]++;
        }
    }
    
    //wordcount = 2, 3 & 4 words
    $toks2 = Array();
    $toks3 = Array();
    $toks4 = Array();
    
    for($i = 0; $i < count($toks); $i++){
        if (isset($toks[$i]) && isset($toks[$i+1]) && trim($toks[$i]) && trim($toks[$i+1])){
            $toks2[] = strtolower(trim($toks[$i])." ".trim($toks[$i+1]));
        }
        if (isset($toks[$i]) && isset($toks[$i+1]) && isset($toks[$i+2]) && trim($toks[$i]) && trim($toks[$i+1]) && trim($toks[$i+2])){
            $toks3[] = strtolower(trim($toks[$i])." ".trim($toks[$i+1])." ".trim($toks[$i+2]));
        }
        if (isset($toks[$i]) && isset($toks[$i+1]) && isset($toks[$i+2]) && isset($toks[$i+3]) && trim($toks[$i]) && trim($toks[$i+1]) && trim($toks[$i+2]) && trim($toks[$i+3])){
            $toks4[] = strtolower(trim($toks[$i])." ".trim($toks[$i+1])." ".trim($toks[$i+2])." ".trim($toks[$i+3]));
        }
    }
   /* foreach($toks2 AS $phrase){
        if (!isset($wordcount[$phrase])){
            $wordcount[$phrase]=1;
        }
        else {
            $wordcount[$phrase]++;
        }
    }
    foreach($toks3 AS $phrase){
        if (!isset($wordcount[$phrase])){
            $wordcount[$phrase]=1;
        }
        else {
            $wordcount[$phrase]++;
        }
    }    
    foreach($toks4 AS $phrase){
        if (!isset($wordcount[$phrase])){
            $wordcount[$phrase]=1;
        }
        else {
            $wordcount[$phrase]++;
        }
    }
    */
    $densities = Array();
    foreach($wordcount AS $word => $num){
        //calculate densities
        $phrasecount = count(explode(" ", $word));
        $density = number_format(  ($num / $totalcount) * $phrasecount * 100, 2);
        $densities[$word] = $density;
    }
        
        
    arsort($densities);
    ob_start();
    ?>
    Total Wordcount: <?php echo $totalcount; ?>
    
    <?php $head = '<div class="wordCount"><table border=1><tr><td><b>Phrase</b></td><td><b>Occurrences</b></td><td><b>Density</b></td></tr>'; 
    $table = array();
    $tr = '';
    ?>
    <div>
    <?php $i =0; foreach ($densities AS $word => $density){
    	$i++;
        $tr.="<tr><td>{$word}</td><td>".$wordcount[$word]."</td><td>{$density}%</td></tr>";
        if($i%20==0){array_push($table,$head.$tr.'</table></div>'); $tr = '';}
    	
        if($i==60){break;}
    }
    echo implode('',$table);
    ?>
    </div>
    
    <?php
    $out = ob_get_contents();
    ob_end_clean();

}

?>

<?php echo isset($out) ? $out : ''; ?>