<?php
header('Content-type: text/plain');

if ($_FILES["file"]["error"] > 0)
{
  echo "Error: " . $_FILES["file"]["error"] . "\n";
} else {
  
  // echo "Upload: " . $_FILES["file"]["name"] . "\n";
  // echo "Type: " . $_FILES["file"]["type"] . "\n";
  // echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb\n";
  // echo "Stored in: " . $_FILES["file"]["tmp_name"] . "\n";
  move_uploaded_file($_FILES['file']['tmp_name'], './process/src.amr');
  $rome = $_POST['rome'];

  exec('./process/process.sh');
  exec('./process/caculate.py');

  $result = json_decode(file_get_contents('./process/final.out'), true);
  if (strcmp($rome,$result['rome']) == 0) {
  	$wow = 1;
  } else {
  	$wow = 0;
  }
  $json = array('score' => $result['score'], 'wow' => $wow,'rome'=>$result['rome']);
  echo json_encode($json);
}