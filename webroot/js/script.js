var peer = null;
let localStream;
let room;

$(document).ready(function(){
	initializePeer();
	//MARK: - button socket connection
    $('.btn-connect-socket').on('click', function(){
        //MARK: - set variables
        broadcast_hash = $("#broadcast_hash").val();
        broadcast_user_id = $("#broadcast_user_id").val();
        broadcast_user_name = $("#broadcast_user_name").val();
        broadcast_user_image = $("#broadcast_user_image").val();

        const roomName = broadcast_hash;
		if (!roomName) {
		  return;
		}
		room = peer.joinRoom('mesh_video_' + roomName, {stream: localStream});

		// $('#room-id').text(roomName);
		startVideoChat(room);
        //MARK: - disconnect from socket
        if ($(this).html().toLowerCase() == "disconnect") {
            //MARK: - deinitialize
            PortalAPI.deinit();
            return false;
        }

        //MARK: - deinitialize
        PortalAPI.deinit();

        //MARK: - set namespace
        PortalAPI.init({
            host: location.origin,
            namespace: "/local",
            room: broadcast_hash,
            socket: null,
            initializeEvents: initializeEvents,
            user_config: {
                "user_type":"registered_viewer",
                "user_id": broadcast_user_id,
                "user_name": broadcast_user_name,
                "user_image": broadcast_user_image,
                "ip_address": "192.168.0.1",
                "device_type": "pc",
                "chat_mode": "open",
                "service_id": 1
            }
        });
    });

        //MARK: - catch when a key was just pressed
    $(".mytext").on("keyup", function(e){
        if (e.which == 13){
            var text = $(this).val();
            console.warn(text);
            if (text !== ""){
                insertChat("me", text);              
                $(this).val('');
                PortalAPI.sendGeneralCommand({
                    command: "broadcast_channel_message",
                    content: {
                        "message": text,
                        "message_type": "viewer",
                        "message_image": broadcast_user_image,
                        "message_user_name": broadcast_user_name,
                    },
                    mode: "to_room"
                });
            }
        }
    });
});

function initializeEvents(){
	var socket = PortalAPI.socket;

	//MARK: - on connect
	socket.on('connect', function(){
		console.warn("I'm connected")

		changeStatus("connected");
		PortalAPI.sendCommand({
			command: "broadcast_connect_to_room",
			content: {something: "hehe"}
		});
	})
	//MARK: - on connect
	socket.on('text_chat_user', function(){
		console.warn('something');
	})
	//MARK: - on error
	.on('error', function(err){
		changeStatus("connected");
	})

	//MARK: - on disconnect
	.on('disconnect', function(){
		changeStatus("disconnected");
	})

	//MARK: - catch when connected to room
	.on('broadcast_receive_conected_to_room', function(data){
		console.warn(data);
	})

	//MARK: - catch when a user connects
	.on('broadcast_general_command', function(data){
		var command = data.command;

		//MARK: - debug
		console.warn(data);

		//MARK: - switch through the commands
		switch (command) {
			case "broadcast_channel_message":
				insertChat(data.content.message_type, data.content.message, 0, data.content);
				break;


			case "broadcast_2shot_response":
				receive2ShotResponse(data);
				break;
		}
	});
}

//MARK: - change status
function changeStatus(status = "disconnected"){
    $('.btn-connect-socket').removeClass('btn-primary');
    $('.btn-connect-socket').removeClass('btn-danger');
    $('.btn-request-2shot').hide();

    if (status == "connected") {
        $('.btn-connect-socket').addClass('btn-danger');
        $('.btn-connect-socket').html("DISCONNECT");
        $('.btn-request-2shot').show();

    } else {
        $('.btn-connect-socket').addClass('btn-primary');
        $('.btn-connect-socket').html("CONNECT");

    }
}
//MARK: - insert chat message
function insertChat(who, text, time = 0, content = {}){
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ $("#broadcast_user_image").val() +'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';       

    } else if (who == "info") {
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" style="width:100%;" src="https://cdn3.iconfinder.com/data/icons/user-2/100/9-512.png" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';

    } else {
        control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+ content.message_image+'" /></div>' +                                
                  '</li>';
    }

    //MARK: - add timeout
    setTimeout(function(){                        
            $("ul").append(control);

    }, time);
}
//MARK: - format AMPM
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}  

function initializePeer(){
	peer = new Peer({
		key:   window.__SKYWAY_KEY__,
		debug: 3,
	});

	peer.on('open', () => {
		console.log(peer);
		$('#my-id').text(peer.id);
		loadMediaSources();
	});

	const audioSelect = $('#audioSource');
	const videoSelect = $('#videoSource');
	const selectors = [audioSelect, videoSelect];

	navigator.mediaDevices.enumerateDevices()
		.then(deviceInfos => {
			const values = selectors.map(select => select.val() || '');
			selectors.forEach(select => {
				const children = select.children(':first');
				while (children.length) {
					select.remove(children);
				}
			});

			for (let i = 0; i !== deviceInfos.length; ++i) {
				const deviceInfo = deviceInfos[i];
				const option = $('<option>').val(deviceInfo.deviceId);

				if (deviceInfo.kind === 'audioinput') {
					option.text(deviceInfo.label ||
						'Microphone ' + (audioSelect.children().length + 1));
					audioSelect.append(option);
				} else if (deviceInfo.kind === 'videoinput') {
					option.text(deviceInfo.label ||
						'Camera ' + (videoSelect.children().length + 1));
					videoSelect.append(option);
				}
			}

			selectors.forEach((select, selectorIndex) => {
				if (Array.prototype.slice.call(select.children()).some(n => {
					return n.value === values[selectorIndex];
				})) {
					select.val(values[selectorIndex]);
				}
			});

			videoSelect.on('change', loadMediaSources);
			audioSelect.on('change', loadMediaSources);
		});
}

function loadMediaSources(){
    // Get audio/video stream
    const audioSource = $('#audioSource').val();
    const videoSource = $('#videoSource').val();
    const constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined},
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      $('#my-video').get(0).srcObject = stream;
      localStream = stream;

	if (room) {
		room.replaceStream(stream);
		return;
	}

	$('#their-videos').empty();
    }).catch(err => {
      $('#step1-error').show();
      console.error(err);
    });
}

function startVideoChat(room) {
	// Wait for stream on the call, then set peer video display
	room.on('stream', stream => {
	const peerId = stream.peerId;
	const id = 'video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '');

	$('#their-videos').append($(
	'<div class="video_' + peerId +'" id="' + id + '">' +
		'<label>' + stream.peerId + ':' + stream.id + '</label>' +
		'<video class="remoteVideos" autoplay playsinline>' +
	'</div>'));
	const el = $('#' + id).find('video').get(0);
	el.srcObject = stream;
	el.play();
	});

	room.on('removeStream', function(stream) {
		const peerId = stream.peerId;
		$('#video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '')).remove();
	});

	// UI stuff
	// room.on('close', step2);
	room.on('peerLeave', peerId => {
		$('.video_' + peerId).remove();
	});
}