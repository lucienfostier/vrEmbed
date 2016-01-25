/**
  Copyright 2015 Bhautik J Joshi

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
**/

var VRLogos = require('./VRIcons.js');
var VRDeviceManager = require('./VRDeviceManager.js');

var createDialogTextStyle = function(t) {
  t.width = '300px';
  t.position = 'relative';
  t.margin = '10px auto';
  t.padding = '5px 20px 10px 20px';
  t.borderRadius = '5px';
  t.background = '#fff';
  // t.pointerEvents = 'auto';
}

function VROptionsCore() {
  var self = this;
  this.vrDeviceManager = VRDeviceManager;
  this.deviceButtons = [];

  this.init = function() {
    this.dialog = document.createElement('div');
    var s = this.dialog.style;
    s.position = 'fixed';
    s.top = '0';
    s.right = '0';
    s.bottom = '0';
    s.left = '0';
    s.background = 'rgba(0,0,0,0.8)';
    s.zIndex = '99999';
    s.opacity = '1';
    //s.pointerEvents = 'none';
    s.pointerEvents = 'auto';
    s.color = '#000';
    s.fontFamily = '"Lucida Console",Monaco,monospace';

    this.dialogText = document.createElement('div');
    var t = this.dialogText.style;
    createDialogTextStyle(t);
    t.minHeight = '100px';

    this.dialogDevices = document.createElement('div');
    var u = this.dialogDevices.style;
    createDialogTextStyle(u);
    u.maxHeight = '100px';
    u.overflow = 'scroll';

    this.dialog.appendChild(this.dialogText);
    this.dialog.appendChild(this.dialogDevices);
    this.dialog.addEventListener('click', this.onClickLeft_.bind(this));
    this.dialog.addEventListener('touchstart', this.onClickLeft_.bind(this));

    this.setupDialogOptions();
    this.setupDialogDevices();
  }

  this.setupDialogOptions = function() {
    var tex = "";
    tex += '<a href="http://vrEmbed.org" target="_blank" style="color: inherit; text-decoration: none;">'
    tex += '<img src=' + VRLogos.logoVrEmbed + ' width=100px style="float: right; margin: 0 0 2px 2px;"/>';
    tex += '<br/>vrEmbed<br/> (c) Bhautik Joshi 2015-16</a><div style="clear:left;">';
    this.dialogText.innerHTML = tex;
  }

  this.createRadio = function(objDiv){
    var devices = this.vrDeviceManager.getDeviceList();
    for(deviceit = 0;deviceit<devices.length; deviceit++) {
      var deviceName = devices[deviceit];
      var device = this.vrDeviceManager.getDevice(deviceName);

      var radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = "deviceSelector";
      radioButton.id = "device" + deviceit;
      radioButton.value = deviceName;
      radioButton.addEventListener("click", this.radioClick);

      //var deviceLabelText = '<img src=' + device.icon + ' width=100px"/>' + ;
      var radioImgNode = document.createElement("img");
      radioImgNode.setAttribute('src', device.icon);
      radioImgNode.setAttribute('height', '25px');
      var radioTextNode = document.createTextNode(device.name);

      var radioLabel = document.createElement("label");
      radioLabel.htmlFor = radioButton.id;
      radioLabel.appendChild(radioButton);
      radioLabel.appendChild(radioImgNode);
      radioLabel.appendChild(radioTextNode);
      radioLabel.appendChild(document.createElement("br"));

      this.deviceButtons[deviceName] = [radioButton, radioLabel];

      objDiv.appendChild(radioLabel);
    }
  }

  this.radioClick = function() {
    // console.log("BLERGH");
    self.syncManagerToDeviceButtons();
  }

  this.syncDeviceButtonsToManager = function() {
    var currentDevice = this.vrDeviceManager.currentDeviceName;
    //console.log(currentDevice.name);
    for (var key in this.deviceButtons) {
      if (key === 'length' || !this.deviceButtons.hasOwnProperty(key)) continue;

      //console.log(this.vrDeviceManager.getDevice(key).name, currentDevice.name);
      if (key == currentDevice){
        this.deviceButtons[key][0].checked = true;
        //this.deviceButtons[key][1].style.border = "2px solid #F00";
      }
      else
        this.deviceButtons[key][0].checked = false;
        //this.deviceButtons[key][1].style.border = "2px solid transparent";
    }
  }

  this.syncManagerToDeviceButtons = function() {
    for (var key in this.deviceButtons) {
      if (key === 'length' || !this.deviceButtons.hasOwnProperty(key)) continue;
        if (this.deviceButtons[key][0].checked == true) {
          this.vrDeviceManager.setCurrentDevice(key);
          break;
        }
    }
  }

  this.setupDialogDevices = function() {
    var tex = "";
    tex += 'Choose device:<br/>';
    this.dialogDevices.innerHTML = tex;
    this.createRadio(this.dialogDevices);
    this.syncDeviceButtonsToManager();
  }

  this.showDialog = function() {
    document.body.appendChild(this.dialog);
    this.syncDeviceButtonsToManager();
  }

  this.hideDialog = function() {
    document.body.removeChild(this.dialog);
    this.syncManagerToDeviceButtons();
  }

  this.onClickLeft_ = function(e) {
    var go = false;
    if (e.target == this.dialog)
      go = true;

    if (e.target == this.dialogText)
      go = true;

    if (go == false)
      return;

    e.stopPropagation();
    e.preventDefault();
    this.hideDialog();
  }

}

var VROptionsFactory = (function () {
    var instance;

    function createInstance() {
        var object = new VROptionsCore();
        object.init();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


VROptions = function() {
  this.options = VROptionsFactory.getInstance();
}

module.exports = VROptions;
