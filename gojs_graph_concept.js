

  function init_concept(panel_id,jData) {

    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
      $(go.Diagram, panel_id,  // must name or refer to the DIV HTML element
        {
         allowDrop : true,  // permit accepting drag-and-drops

          // start everything in the middle of the viewport
          initialContentAlignment: go.Spot.TopLeft,

          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,

          // support double-click in background creating a new node
          "clickCreatingTool.archetypeNodeData": { text: "new node", rootclass:"type 1", visibility:true, folded:false },

          // allow Ctrl-G to call groupSelection()
            "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },

          // enable undo & redo
          "undoManager.isEnabled": true,
//          layout: $(go.LayeredDigraphLayout)
        });


  // Node template

    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        { resizable: true },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("width").makeTwoWay(),
        new go.Binding("heigth").makeTwoWay(),
        // define the node's outer shape, which will surround the TextBlock

        new go.Binding("visible", "visible"),
        $(go.Shape, "RoundedRectangle",
          {
            parameter1: 20,  // the corner has a large radius
            fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
            cursor: "pointer"
          },
//          new go.Binding("fill", "color")
          new go.Binding("stroke", "folded", function(v) { return v ? "grey" : "black"; }),
          new go.Binding("fill", "rootclass", function(v)
            {
            var newcolor = hSL(45);
            switch (v) {
              case "type 2": newcolor = hSL(105); break;
              case "type 3": newcolor = hSL(165); break;
              case "type 4": newcolor = hSL(225); break;
              case "type 5": newcolor = hSL(285); break;
              case "type 6": newcolor = hSL(345); break;
            }

            return newcolor;
            })
        ),
        $(go.TextBlock,
          {
            font: "10pt helvetica, bold arial, sans-serif",
            editable: true,  // editing the text automatically updates the model data,
            textAlign : "center",
			      wrap: go.TextBlock.WrapFit
          },
          new go.Binding("text").makeTwoWay(),
          new go.Binding("stroke", "folded", function(v) { return v ? "grey" : "black"; })),
          {
            contextMenu:     // define a context menu for each node
              $(go.Adornment, "Vertical",  // that has one button
                $("ContextMenuButton",$(go.TextBlock, "Increase type"),{ click: changeColor }),
                $("ContextMenuButton",$(go.TextBlock, "to type 1"),{ click: setColor1}),
                $("ContextMenuButton",$(go.TextBlock, "hide children"),{ click: hideChildren}),
                $("ContextMenuButton",$(go.TextBlock, "show children"),{ click: showChildren})
                // more ContextMenuButtons would go here
               )  // end Adornment
          }
  //      ) // end panel
      );

     function hideChildren(e, obj) {
        var diagram = e.diagram;
        diagram.startTransaction("hide children");
        // get the context menu that holds the button that was clicked
        var node = obj.part.adornedPart;
        // get the node data to which the Node is data bound
        rSetChildren(diagram,node,false);
        // this evaluates data Bindings and records changes in the UndoManager
        diagram.model.setDataProperty(node.data, "folded", true);
        diagram.commitTransaction("hide children");
     }

     function showChildren(e, obj) {
        var diagram = e.diagram;
        diagram.startTransaction("show children");
        // get the context menu that holds the button that was clicked
        var node = obj.part.adornedPart;
        // get the node data to which the Node is data bound
        rSetChildren(diagram,node,true);
        // this evaluates data Bindings and records changes in the UndoManager
        diagram.model.setDataProperty(node.data, "folded", false);
        diagram.commitTransaction("show children");
     }

    function rSetChildren(diagram,node,visibility){
      node.findNodesOutOf().each(function(n) {
        pNodes = n.findNodesInto();
        pNodes = pNodes.filter(function(item) {
          return item.data.visibility & (item.data.key!=node.data.key);
        });
        if (pNodes.count===0) {
          diagram.model.setDataProperty(n.data, "visible", visibility);
          rSetChildren(diagram,n,visibility);
        }
      });
    }


  // Link template in the linkTemplateMap

    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {                                             // remove for oriented diagram
          curve: go.Link.Bezier, // adjusting: go.Link.Stretch,
          reshapable: true, relinkableFrom: true, relinkableTo: true,
          toShortLength: 5
        },
        new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness"),
        $(go.Shape,  // the link shape
          { strokeWidth: 1.5 }),
        $(go.Shape,  // the triangle
          { toArrow: "Triangle", stroke: null }),
		    $(go.TextBlock, "",  // the label text
            {
              textAlign: "center",
              font: "8pt helvetica, arial, sans-serif",
              margin: 4,
              background : "white",
              segmentIndex: 2,
              segmentFraction: 0.5,
              segmentOrientation: go.Link.OrientUpright,
              segmentOffset: new go.Point(0, -10),
              editable: true  // enable in-place editing
            },
            // editing the text automatically updates the model data
            new go.Binding("text").makeTwoWay()
         ), // end texblock
          {
            contextMenu:     // define a context menu for each node
              $(go.Adornment, "Vertical",  // that has one button
                $("ContextMenuButton",$(go.TextBlock, "change link to is_a"),{ click: changeColor }),
                $("ContextMenuButton",$(go.TextBlock, "change link to is_part"),{ click: changeColor }),
                $("ContextMenuButton",$(go.TextBlock, "change link to needs"),{ click: changeColor })
                // more ContextMenuButtons would go here
               )  // end Adornment
          }
      );

  // Group template

      myDiagram.groupTemplate =
        $(go.Group, "Vertical",
          {
      //      layout: null,
            selectionObjectName: "PANEL",  // selection handle goes around shape, not label
            ungroupable: true  // enable Ctrl-Shift-G to ungroup a selected Group
          },
          $(go.TextBlock,
            {
              //alignment: go.Spot.Right,
              font: "bold 14px sans-serif",
              isMultiline: false,  // don't allow newlines in text
              editable: true  // allow in-place editing by user
            },
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("stroke", "color")),
          $(go.Panel, "Auto",
            { name: "PANEL" },
            $(go.Shape, "Rectangle",  // the rectangular shape around the members
              {
                fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 3,
                portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
                // allow all kinds of links from and to this port
                fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
              }),
            $(go.Placeholder, { margin: 10, background: "transparent" })  // represents where the members are
          )
        );



  // Context menu for the diagram's background

   myDiagram.contextMenu =
    $(go.Adornment, "Vertical",
      $("ContextMenuButton",
        $(go.TextBlock, "Undo"),
        { click: function(e, obj) { e.diagram.commandHandler.undo(); } },
        new go.Binding("visible", "", function(o) {
                                          return o.diagram.commandHandler.canUndo();
                                        }).ofObject()),
      $("ContextMenuButton",
        $(go.TextBlock, "Redo"),
        { click: function(e, obj) { e.diagram.commandHandler.redo(); } },
        new go.Binding("visible", "", function(o) {
                                          return o.diagram.commandHandler.canRedo();
                                        }).ofObject()),
      // no binding, always visible button:
      $("ContextMenuButton",
        $(go.TextBlock, "New Node"),
        { click: function(e, obj) {
          var diagram = e.diagram;
          diagram.startTransaction('new node');
          var data = {text: "new node"};
          diagram.model.addNodeData(data);
          part = diagram.findPartForData(data);
          part.location = diagram.toolManager.contextMenuTool.mouseDownPoint;
          diagram.commitTransaction('new node');
        } })
    );

  // Diagram init

    myDiagram.model = new go.GraphLinksModel(jData.nodeDataArray, jData.linkDataArray);

  }

