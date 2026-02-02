/**
* A plugin that pops up a dialog for pasting foreign-format web content, filters out most formatting, 
* and inserts its filtered contents at the caret.
* <p>Copyright (C) 2012 UNICONNECT LC. All rights reserved. Confidential and proprietary information.
* @constructor
* @extends {goog.editor.plugins.AbstractDialogPlugin}
*/

goog.provide('uniflow.editor');

uniflow.editor.FilterDialogPlugin = function() {
  goog.base(this, uniflow.editor.FilterDialogPlugin.COMMAND);
};

goog.inherits(uniflow.editor.FilterDialogPlugin, goog.editor.plugins.AbstractDialogPlugin);

uniflow.editor.FilterDialogPlugin.prototype.getTrogClassId = function() {
  return 'FilterDialogPlugin';
};

//Command implemented by the plugin.
uniflow.editor.FilterDialogPlugin.COMMAND = 'filterPluginCommand';

/**
* Creates a new instance of the dialog and registers a listener for * the ok event.
* @param {goog.dom.DomHelper} dom The dom helper to use to build
* the dialog.
* @return {goog.ui.editor.AbstractDialog} The newly created dialog. * @override
* @protected
*/
uniflow.editor.FilterDialogPlugin.prototype.createDialog = function(dom) {
  var dialog = new uniflow.editor.FilterDialog(dom); 
  dialog.addEventListener(goog.ui.editor.AbstractDialog.EventType.OK,this.handleOk_, false, this); 
  return dialog;
};

/**
*Triggers dialog, Fires on command-1
*/
uniflow.editor.FilterDialogPlugin.prototype.handleKeyboardShortcut = function(e, key, isModifierPressed) {
  if (key == 1) {
    //console.dir(this);
    var dialog = this.createDialog();
    dialog.show();
    return true;
  }
  return false;
}

/**
* Handles the OK event from the dialog.
* Inserts the image with the src provided by the user. * @param {goog.events.Event} e The ok event.
* @private
*/
uniflow.editor.FilterDialogPlugin.prototype.handleOk_ = function(e) {
  //Notify the editor that we are about to make changes. 
  this.fieldObject.dispatchBeforeChange();
  var text = visitSetup(e.pastedNode_);
  //We want to insert the text in place of the user's selection. // So we restore it first, and then use it for insertion. 
  this.restoreOriginalSelection();
  var range = this.fieldObject.getRange();
  text = range.replaceContentsWithNode(text);
  //Done making changes, notify the editor. 
  this.fieldObject.dispatchChange();
  //Put the user's selection right after the newly inserted text.   
  goog.editor.range.placeCursorNextTo(text, false);
  //Dispatch selection change event because we just moved the selection.
  this.fieldObject.dispatchSelectionChangeEvent();
};

uniflow.editor.FilterDialogPlugin.prototype.cleanHTMLFormat = function(pasteNode) {
  return text;
}

function visitSetup(n) {
  var parent = goog.dom.createDom(goog.dom.TagName.DIV);
  visit(n, parent);
  //document.getElementById('pastedHTML').value = n.innerHTML;
  //document.getElementById('cleanedHTML').value = parent.innerHTML;
  return parent.firstChild;
}

function visit(n, parent) {
  var nodeName = n.nodeName;
  var nodeValue = n.nodeValue;
  log(n.nodeType + "||" + nodeName + "||" + nodeValue);
  
  var newNode = null;
  switch(n.nodeType)
  {
    case 1:
      var newNodeName = nodeName;
      if (goog.string.caseInsensitiveStartsWith(nodeName, 'o:')) {
        return;
      }
      newNode = goog.dom.createDom(newNodeName,null,nodeValue);
      if (nodeName == 'A') {
        newNode.setAttribute('href', n.getAttribute('href'));
      } else if (nodeName == 'IMG') {
        newNode.setAttribute('src', n.getAttribute('src'));
        newNode.setAttribute('height', n.getAttribute('height'));
        newNode.setAttribute('width', n.getAttribute('width'));
      }
      break;
    case 3:
      var s = goog.string.collapseWhitespace(nodeValue);
      if (s.length > 0) {
        log('has length {' + nodeValue + '}');
        newNode = goog.dom.createTextNode(nodeValue);
      }
      break;
    default:
      return;
  }
  if (newNode) {
    parent.appendChild(newNode);
    for (var next = n.firstChild; next != null; next = next.nextSibling) {
      visit(next, newNode);
    }
  }
}

function log(s) {
  //var log = document.getElementById('cleanHTMLlog');
  //log.appendChild(goog.dom.createTextNode(s));
  //log.appendChild(goog.dom.createDom('BR'));
}

//****************************************
//Dialog

/**
* Creates a dialog that allows the user to paste foreign-format web content and filters unwanted formatting. 
* @constructor
* @extends {goog.ui.editor.AbstractDialog}
*/
uniflow.editor.FilterDialog = function(dom) {
  goog.ui.editor.AbstractDialog.call(this, dom);
  this.createDialogControl();
};

goog.inherits(uniflow.editor.FilterDialog, goog.ui.editor.AbstractDialog);


uniflow.editor.FilterDialog.prototype.createDialogControl = function() {
  //We just want a default goog.ui.Dialog, so use the provided builder.
  var builder = new goog.ui.editor.AbstractDialog.Builder(this);
  /** @desc Title of the dialog. */
  var DIALOG_TITLE = goog.getMsg('Filter Dialog');
  // Add a custom title and content.
  builder.setTitle(DIALOG_TITLE).setContent(this.createContent_());
  return builder.build();
};

/**
* contentEditable div where user will paste foreign-format text
*/
uniflow.editor.FilterDialog.prototype.pastedNode_;

/**
* Creates the DOM structure that makes up the dialog's content area.
* @return {Element} The DOM structure that makes up the dialog's content area. * @private
*/
uniflow.editor.FilterDialog.prototype.createContent_ = function() {
  this.pastedNode_ = goog.dom.createDom(goog.dom.TagName.DIV, {id: 'formatCleanerPasteDiv', contentEditable: true, style: 'border: solid blue; background-color:white;width:300px;height:200px;'});
  var MSG_DIALOG_PROMPT = goog.getMsg('Paste the text to be inserted'); 
  return goog.dom.createDom(goog.dom.TagName.DIV, null, [MSG_DIALOG_PROMPT, this.pastedNode_]);
};

/**
* Returns the image URL typed into the dialog's input.
* @return {?string} The image URL currently typed into the dialog's input. 
*/
uniflow.editor.FilterDialog.prototype.getTextareaValue_ = function() {
  return this.pastedNode_ && this.pastedNode_.value;
};

/**
* Creates and returns the event object to be used when dispatching the OK
*/
uniflow.editor.FilterDialog.prototype.createOkEvent = function(e) {
  var event = new goog.events.Event(goog.ui.editor.AbstractDialog.EventType.OK);
  event.pastedNode_ = this.pastedNode_;
  return event;
};
