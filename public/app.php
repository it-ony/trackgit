<!DOCTYPE HTML>
<html>
<head>
    <!--
    Created with rAppid.js - a declarative RIA MVC JS Framework developed by Tony Findeisen and Marcus Krejpowicz
    Visit http://rappidjs.com for more Information.
    -->
    <link rel="stylesheet" href="app/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="app/css/trackgit.css" media="all">

    <meta charset="utf-8">
    <title>TrackGit</title>

    <!-- VERSION="${VERSION}" -->

    <script type="text/javascript" src="js/lib/require.js" data-usage="lib"></script>
    <script type="text/javascript" src="js/lib/rAppid.js" data-usage="lib"></script>

    <meta name="fragment" content="!">

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

</head>
<body>
<script type="text/javascript" data-usage="bootstrap">
    rAppid.bootStrap("app/TrackGit.xml", null, {
        accessToken: "<?php echo $_SESSION["access_token"]; ?>"
    }, null, function(err) {
        if (err) {
            console.error(err, err.stack);
        }
    });
</script>
</body>
</html>