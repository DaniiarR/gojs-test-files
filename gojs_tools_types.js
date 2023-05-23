
function hSL(h){
  return(hsl(h,80,80));
}

function hsl(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  var r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = function(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = function(x) {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#'+toHex(r)+toHex(g)+toHex(b);
}



function shiftclass(parentclass) {
    var newcolor = "type 1";
    switch (parentclass) {
      case "type 1": newcolor = "type 2"; break;
      case "type 2": newcolor = "type 3"; break;
      case "type 3": newcolor = "type 4"; break;
      case "type 4": newcolor = "type 5"; break;
      case "type 5": newcolor = "type 6"; break;
      case "type 6": newcolor = "type 1"; break;
    }
    return newcolor;
}

function shiftclass2(parentclass) {
    var newcolor = "type 1";
    switch (parentclass) {
      case "type 1": newcolor = "type 6"; break;
      case "type 6": newcolor = "type 5"; break;
      case "type 5": newcolor = "type 4"; break;
      case "type 4": newcolor = "type 3"; break;
      case "type 3": newcolor = "type 2"; break;
      case "type 2": newcolor = "type 1"; break;
    }
    return newcolor;
}


function changeColor(e, obj) {
        var diagram = e.diagram;
        diagram.startTransaction("changed color");
        // get the context menu that holds the button that was clicked
        var contextmenu = obj.part;
        // get the node data to which the Node is data bound
        var nodedata = contextmenu.data;
        // compute the next color for the node
        var newcolor = "question";

        switch (nodedata.rootclass) {
          case "question": newcolor = "idea"; break;
          case "idea": newcolor = "arg_pro"; break;
          case "arg_pro": newcolor = "arg_cons"; break;
          case "arg_cons": newcolor = "arg_neutral"; break;
          case "arg_neutral": newcolor = "decision"; break;
          case "decision": newcolor = "question"; break;
        }
        newcolor = shiftclass(nodedata.rootclass);

        // modify the node data
        // this evaluates data Bindings and records changes in the UndoManager
        diagram.model.setDataProperty(nodedata, "rootclass", newcolor);
        diagram.commitTransaction("changed color");
    }


    function setColor1(e, obj) {
        var diagram = e.diagram;
        diagram.startTransaction("changed color");
        // get the context menu that holds the button that was clicked
        var contextmenu = obj.part;
        // get the node data to which the Node is data bound
        var nodedata = contextmenu.data;
        // compute the next color for the node
        var newcolor = "type 2";
        // modify the node data
        // this evaluates data Bindings and records changes in the UndoManager
        diagram.model.setDataProperty(nodedata, "rootclass", newcolor);
        diagram.commitTransaction("changed color");
    }



// -----

function setColor(diagram, color) {
    // Always make changes in a transaction, except when initializing the diagram.
    diagram.startTransaction("change color");
    diagram.selection.each(node => {
      if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
        // Examine and modify the data, not the Node directly.
        var data = node.data;
        // Call setDataProperty to support undo/redo as well as
        // automatically evaluating any relevant bindings.
        diagram.model.setDataProperty(data, "color", color);
      }
    });
    diagram.commitTransaction("change color");
  }

// clicking the button inserts a new node to the right of the selected node,
    // and adds a link to that new node
    function addNodeAndLink(e, obj) {
      var adornment = obj.part;
      var diagram = e.diagram;
      diagram.startTransaction("Add State");
      // get the node data for which the user clicked the button
      var fromNode = adornment.adornedPart;
      var fromData = fromNode.data;
      // create a new "State" data object, positioned off to the right of the adorned Node
      var toData = { text: "new node", rootclass: fromData.rootclass, visibility:true, folded:false};
      var p = fromNode.location.copy();
      p.x += 300;
      toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
      // add the new node data to the model
      var model = diagram.model;
      model.addNodeData(toData);
      // create a link data from the old node data to the new node data
      var linkdata = {
        from: model.getKeyForNodeData(fromData),  // or just: fromData.id
        to: model.getKeyForNodeData(toData),
        text: "" //"is_a"
      };
      // and add the link data to the model
      model.addLinkData(linkdata);
      // select the new Node
      var newnode = diagram.findNodeForData(toData);
      diagram.select(newnode);
      diagram.commitTransaction("Add State");
      // if the new node is off-screen, scroll the diagram to show the new node
      diagram.scrollToRect(newnode.actualBounds);
    }

   function addNodeAndLink2(e, obj) {
      var adornment = obj.part;
      var diagram = e.diagram;
      diagram.startTransaction("Add State");
      // get the node data for which the user clicked the button
      var fromNode = adornment.adornedPart;
      var fromData = fromNode.data;
      // create a new "State" data object, positioned off to the right of the adorned Node
      var toData = { text: "new node", rootclass: shiftclass(fromData.rootclass), visibility:true, folded:false};
      var p = fromNode.location.copy();
      p.x += 300;
      toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
      // add the new node data to the model
      var model = diagram.model;
      model.addNodeData(toData);
      // create a link data from the old node data to the new node data
      var linkdata = {
        from: model.getKeyForNodeData(fromData),  // or just: fromData.id
        to: model.getKeyForNodeData(toData),
        text: ""
      };
      // and add the link data to the model
      model.addLinkData(linkdata);
      // select the new Node
      var newnode = diagram.findNodeForData(toData);
      diagram.select(newnode);
      diagram.commitTransaction("Add State");
      // if the new node is off-screen, scroll the diagram to show the new node
      diagram.scrollToRect(newnode.actualBounds);
    }

  function addNodeAndLink3(e, obj) {
      var adornment = obj.part;
      var diagram = e.diagram;
      diagram.startTransaction("Add State");
      // get the node data for which the user clicked the button
      var toNode = adornment.adornedPart;
      var toData = toNode.data;
      // create a new "State" data object, positioned off to the right of the adorned Node
      var fromData = { text: "new node", rootclass: toData.rootclass, visibility:true, folded:false};
      var p = toNode.location.copy();
      p.x -= 300;
      fromData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
      // add the new node data to the model
      var model = diagram.model;
      model.addNodeData(fromData);
      // create a link data from the old node data to the new node data
      var linkdata = {
        from: model.getKeyForNodeData(fromData),  // or just: fromData.id
        to: model.getKeyForNodeData(toData),
        text: ""
      };
      // and add the link data to the model
      model.addLinkData(linkdata);
      // select the new Node
      var newnode = diagram.findNodeForData(fromData);
      diagram.select(newnode);
      diagram.commitTransaction("Add State");
      // if the new node is off-screen, scroll the diagram to show the new node
      diagram.scrollToRect(newnode.actualBounds);
    }

  function addNodeAndLink4(e, obj) {
      var adornment = obj.part;
      var diagram = e.diagram;
      diagram.startTransaction("Add State");
      // get the node data for which the user clicked the button
      var toNode = adornment.adornedPart;
      var toData = toNode.data;
      // create a new "State" data object, positioned off to the right of the adorned Node
      var fromData = { text: "new node", rootclass: shiftclass2(toData.rootclass), visibility:true, folded:false};
      var p = toNode.location.copy();
      p.x -= 300;
      fromData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
      // add the new node data to the model
      var model = diagram.model;
      model.addNodeData(fromData);
      // create a link data from the old node data to the new node data
      var linkdata = {
        from: model.getKeyForNodeData(fromData),  // or just: fromData.id
        to: model.getKeyForNodeData(toData),
        text: ""
      };
      // and add the link data to the model
      model.addLinkData(linkdata);
      // select the new Node
      var newnode = diagram.findNodeForData(fromData);
      diagram.select(newnode);
      diagram.commitTransaction("Add State");
      // if the new node is off-screen, scroll the diagram to show the new node
      diagram.scrollToRect(newnode.actualBounds);
    }




