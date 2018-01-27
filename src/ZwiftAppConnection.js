'use strict';
const os = require("os")
const zwiftProtobuf = require('./zwiftProtobuf')
const EventEmitter = require('events')
const net = require('net')
const fs = require("fs")
const PhoneToGame = zwiftProtobuf.lookup('PhoneToGame')
const GameToPhone = zwiftProtobuf.lookup('GameToPhone')

let index = 1
function savePacket(data) {
  while (fs.existsSync(`packet.${index++}`));
  fs.writeFileSync(`packet.${index++}`, data)
}

function localIpAddress() {
  const ifaces = os.networkInterfaces()
  let address

  for (let dev in ifaces) {
    const iface = ifaces[dev].filter(function(details) {
      return details.family === 'IPv4' && details.internal === false;
    });

    if(iface.length > 0){
      address = iface[0].address
      break
    }
  }
  return address
}

class LPDataHandler extends EventEmitter {
  constructor() {
    super()
    this._partialMessage = null
    this._messageLen = 0
  }

  _deliverMessage(msg) {
    this.emit('data', msg)
  }

  addData(data) {
    let buf = data
    if (this._partialMessage) {
      const lenNeeded = this._messageLen - this._partialMessage.length
      if (this._messageLen <= (this._partialMessage.len() + data.len())) {
        this._deliverMessage(Buffer.concat([this._partialMessage, buf.slice(0, lenNeeded)]))
        this._partialMessage = null
        buf = buf.slice(lenNeeded)
      } else {
        this._partialMessage = Buffer.concat(this._partialMessage)
        buf = buf.slice(buf.length)
      }
    }
    while (buf.length){
      this._messageLen = buf.readUInt32BE(0)
      buf = buf.slice(4)
      if (buf.length < this._messageLen) {
        this._partialMessage = buf
        buf = buf.slice(buf.length)
      } else {
        this._deliverMessage(buf.slice(0, this._messageLen))
        buf = buf.slice(this._messageLen)
      }
    }
  }
}

class ZwiftAppConnection extends EventEmitter {
  constructor (request, playerId) {
    super()
    this._seqno = 1
    this._packetNo = 0
    this._playerId = playerId
    this._request = request
    this._lpDataHandler = new LPDataHandler()
    this._lpDataHandler.on('data', (data) => this._handleData(data))
    this._server = net.createServer((socket) => {
    }).on('error', (err) => {
      throw err
    }).on('listening', () => {
      this._registerPhone(localIpAddress(), this._server.address().port)
    }).on('connection', (socket) => {
      if (this._socket){
        this._socket.pause()
        this._socket.end()
        this._socket = null
      }
      this._socket = socket
      this._socket.on('data', (data) => {
        this._lpDataHandler.addData(data)
      })
      this._handleConnection()
    })
    this._server.listen(0, '0.0.0.0')
  }

  stop() {
    if (this._socket) {
      this._socket.pause()
      this._socket.end()
      this._socket = null
    }
    this._server.close()
  }

  _registerPhone(address, port) {
    const data = {
      "mobileEnvironment": {
        "appBuild": 355,
        "appDisplayName": "Mobile Link",
        "appVersion": "2.1.11",
        "systemHardware": "iphone 10,6",
        "systemOS": "iOS",
        "systemOSVersion": "11.2.1"
      },
      "phoneAddress": address,
      "port": port,
      "protocol": "TCP"
    }
    this._request.send('/relay/profiles/me/phone', 'PUT', data, 'application/json', 'json')
  }

  _handleConnection() {
    console.log("sending message 1")
    this._sendMessage({
      'id': this._playerId,
      command: {
        'seqno': this._seqno++,
        'command': 28,
        'subject': 0,
        'f5': 0,
        'f6': '',
        'f7': 0,
        'playerId': this._playerId
      },
      'packetNo': this._packetNo++
    })
    console.log("sending message 2")
    this._sendMessage({
      'id': this._playerId,
      command: {
        'seqno': this._seqno++,
        'command': 29,
        'subject': 0,
        'f5': 0,
        'f6': '',
        'f7': 0,
        'capabilities': {
          'f1': 4,
          'info': {
            'appVersion': '2.1.1 (355)',
            'systemOSVersion': '11.2.1',
            'systemOS': 'iOS',
            'systemHardware': 'iPhone'
          }
        }
      },
      'packetNo': this._packetNo++
    })
    this.emit('connected')
  }

  _sendMessage(phoneToGameMessage){
    if (this._socket) {
      const lenBuf = Buffer.allocUnsafe(4)
      const buf = PhoneToGame.encode(phoneToGameMessage).finish()
      lenBuf.writeUInt32BE(buf.length, 0)
      this._socket.write(Buffer.concat([lenBuf, buf], buf.length + 4))
    }
  }

  _handleData(data) {
    try {
      let msg = GameToPhone.decode(data)
      this.emit('msg', msg)
      for (let command of msg.commands) {
        if (command.gtpc21 && command.gtpc21.gtpc21_6 && command.gtpc21.gtpc21_6.gtpc21_6_1) {
          for (let gtpc21_6_1 of command.gtpc21.gtpc21_6.gtpc21_6_1) {
            for (let info of gtpc21_6_1.playerInfos) {
              this.emit('playerInfo', info)
            }
          }
        }
      }
    } catch (err) {
      console.log(err)
      savePacket(data)
    }
  }
}

module.exports = ZwiftAppConnection
