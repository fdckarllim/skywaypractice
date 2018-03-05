"use strict"

window.inn = window.inn || {};
var inn = window.inn;

inn.PortalAPI = function() {
	this.host = null;
	this.namespace = null;
	this.room = null;
	this.socket = null;
	this.user_config = {};
	this.initializeEvents = null;
};

inn.PortalAPI.prototype = {
	socket: function(){
		return socket;
	},
	init: function(options) {
		var self = this;

		//MARK: - namespace
		self.namespace = options.namespace || self.namespace;
		self.host = "https://inn-localhost.nativecamp.net:3002";
		self.initializeEvents = options.initializeEvents || self.initializeEvents;
		self.user_config = options.user_config || self.user_config;
		self.room = options.room || self.room;
		
		//MARK: - trigger connect
		console.warn(self.host + '/local');
		self.socket = io.connect(self.host + '/local');

		//MARK: - initialize events
		self.initializeEvents()
	},
	deinit: function() {
		//MARK: - if socket is null
		if (inn.PortalAPI.prototype.socket == null) {
			return false;
		}

		//MARK: - if undefined
		if (typeof inn.PortalAPI.prototype.socket.disconnect === 'undefined') {
			return false;
		}

		console.warn("disconnect");

		//MARK: - disconnection
		inn.PortalAPI.prototype.socket.disconnect();
	},
	sendCommand: function(params){
		//MARK: - if socket is null
		if (inn.PortalAPI.prototype.socket == null) {
			return false;
		}

		//MARK: - if undefined
		if (typeof inn.PortalAPI.prototype.socket.disconnect === 'undefined') {
			return false;
		}
		
		//MARK: - params
		var command = typeof params.command == 'undefined' ? null : params.command;
		var content = typeof params.content == 'undefined' ? {} : params.content;
		var mode = typeof params.mode == 'undefined' ? "in_room" : params.mode;

		//MARK: - send command
		inn.PortalAPI.prototype.socket.emit(command, {
			broadcast_hash: inn.PortalAPI.prototype.room,
			user_config: inn.PortalAPI.prototype.user_config, 
			content: content,
			mode: mode
		});
	},
	sendGeneralCommand: function(params){
		//MARK: - if socket is null
		if (inn.PortalAPI.prototype.socket == null) {
			return false;
		}

		//MARK: - if undefined
		if (typeof inn.PortalAPI.prototype.socket.disconnect === 'undefined') {
			return false;
		}

		//MARK: - params
		var command = typeof params.command == 'undefined' ? null : params.command;
		var content = typeof params.content == 'undefined' ? {} : params.content;
		var mode = typeof params.mode == 'undefined' ? "in_room" : params.mode;

		//MARK: - send command
		inn.PortalAPI.prototype.socket.emit("broadcast_general_command", {
			command: command,
			broadcast_hash: inn.PortalAPI.prototype.room,
			user_config: inn.PortalAPI.prototype.user_config, 
			content: content,
			mode: mode
		});
	}
}