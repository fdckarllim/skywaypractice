<html>
<head>
	<meta charset="utf-8">
	<title>SkyWay - Video chat example</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" href="./webroot/css/styles.css">
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="//cdn.webrtc.ecl.ntt.com/skyway-latest.js"></script>
	<script type="text/javascript" src="https://inn-localhost.nativecamp.net:3002/socket.io/socket.io.js"></script>
	<script type="text/javascript" src="./webroot/js/connector.js"></script>
	<script type="text/javascript" src="./webroot/js/key.js"></script>
	<script type="text/javascript" src="./webroot/js/script.js"></script>
</head>

<body>
	<br>
	<div class="container-fluid" style="max-width: 1000px; min-width: 800px;">
		<div class="row">
			<div class="col-xs-4" style="padding: 0px;">
				<div class="container-fluid">
		    		<div class="row" style="padding-right: 10px;">
		    			<div class="col-xs-12 panel panel-info" style="padding:0px; border-radius:0px;">
		    				<div class="panel-heading">
								<h3 class="panel-title" style="text-align: center;">- VIEWER CONFIG -</h3>
							</div>
							<div class="panel-body">
								<form action="" method="POST" role="form">
									<p>PEER ID: <b><span id="my-id">...</span></b></p>
									<div class="form-group">
										<label for="">Broadcast Hash</label>
										<input type="text" class="form-control" id="broadcast_hash" placeholder="Broadcast Hash" value="<?php echo isset($_GET["room_name"]) ? $_GET["room_name"] : ""; ?>">
									</div>
									<div class="form-group">
										<label for="">User ID</label>
										<input type="text" class="form-control" id="broadcast_user_id" placeholder="User ID" value=2>
									</div>
									<div class="form-group">
										<label for="">User Name</label>
										<input type="text" class="form-control" id="broadcast_user_name" placeholder="User Name" value="Viewer #1">
									</div>
									<div class="form-group">
										<label for="">User Image URL*</label>
										<input type="text" class="form-control" id="broadcast_user_image" placeholder="User Image URL" value="https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg">
									</div>
									<div class="form-group">
										<label for="">Video Source</label>
										<select id="videoSource" class="form-control"></select>
									</div>
									<div class="form-group">
										<label for="">Audio Source</label>
										<select id="audioSource" class="form-control"></select>
									</div>
									<button type="button" class="btn btn-primary btn-block btn-connect-socket">CONNECT</button>
									<button type="button" class="btn btn-primary btn-block btn-request-2shot">REQUEST 2SHOT</button>
								</form>
							</div>
		    			</div>
		    		</div>
				</div>
			</div>
			<div class="col-xs-5" style="padding: 0px;">
	        	<div class="container-fluid">
	        		<div class="row" style="">
	        			<div class="col-xs-12 frame">
	        				<ul></ul>
				            <div>
				                <div class="msj-rta macro" style="margin:auto">                        
				                    <div class="text text-r" style="background:whitesmoke !important">
				                        <input class="mytext" placeholder="Type a message"/>
				                    </div> 
				                </div>
				            </div>
	        			</div>
	        		</div>
	        	</div>
	        </div>
			<div class="col-xs-3" style="padding: 0px;">
	        	<div class="container-fluid">
					<div class="row" style="padding: 0px; padding-right: 10px;">
						<div class="col-xs-12" style="border-radius: 0px; margin: 0px; background-color: black; position:relative !important; ">
								<div class="pure-u-2-3" id="video-container">
									<video id="my-video" muted="true" autoplay playsinline></video>
									<div id="their-videos"></div>
								</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
    <script>
    	//MARK: - prototype
		var PortalAPI = inn.PortalAPI.prototype;
		var broadcast_hash = "<?php echo isset($_GET["
		"]) ? $_GET["room_name"] : ""; ?>";
		var broadcast_user_id = "";
		var broadcast_user_name = "";
		var broadcast_user_image = "https://lh3.googleusercontent.com/-SQHx3SlsnH8/WJgaOVfHK7I/AAAAAAAAAB8/LS3hyHZPU9k50vi-ny7HEO9lNuqQA9f5gCEwYBhgL/w140-h140-p/13557850_1043964722306441_5482256636181946744_n.jpg";
    </script>
</body>
</html>
