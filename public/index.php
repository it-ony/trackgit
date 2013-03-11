<?php

$_CONFIG = array();

include "config.php";

$clientId = $_CONFIG["clientId"];
$clientSecret = $_CONFIG["clientSecret"];

session_start();

if (isset($_SESSION["access_token"])) {
    showApp();
} else if (isset($_GET["state"]) && isset($_SESSION["state"]) && $_GET["state"] === $_SESSION["state"]) {

    $data = array(
        "client_id" => $clientId,
        "client_secret" => $clientSecret,
        "code" => $_GET["code"]
    );

    try {
        $result = CurlPost("https://github.com/login/oauth/access_token", $data);

        $data = array();
        parse_str($result, $data);

        if (array_key_exists("access_token", $data)) {
            // authentication success
            $_SESSION["access_token"] = $data["access_token"];
            showApp();
        } else {
            throw new Exception("access_token not found\n".$result);
        }

    } catch (Exception $e) {
        die($e);
    }

} else {
    $state = md5(time() * rand() . "trackGit");
    $_SESSION["state"] = $state;

    $url = "https://github.com/login/oauth/authorize";
    $url .= "?client_id=" . $clientId;
    $url .= "&redirect_uri=" . "http://trackgit.js/";
    $url .= "&scope=" . "user,repo";
    $url .= "&state=" . $state;

    header("HTTP/1.1 302 Found");
    header("Location: $url");

}

function showApp() {
    include "app.php";
}

function CurlPost($sURL, $data = "")
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_URL, $sURL);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    $sResult = curl_exec($ch);
    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    } else {
        curl_close($ch);
        return $sResult;
    }
}

?>