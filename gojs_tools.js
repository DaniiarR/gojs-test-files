function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
}

function load() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}

function openSVG() {
  var newWindow = window.open("","newWindow");
  if (!newWindow) return;
  var newDocument = newWindow.document;
  var svg = myDiagram.makeSvg({
    document: newDocument,  // create SVG DOM in new document context
    scale: 1,
    maxSize: new go.Size(800, NaN)
  });
//  output = new XMLSerializer().serializeToString(svg);
  newDocument.body.appendChild(svg);
}

function pasteSVG() {
  navigator.clipboard.writeText(new XMLSerializer().serializeToString(myDiagram.makeSvg()));
}
