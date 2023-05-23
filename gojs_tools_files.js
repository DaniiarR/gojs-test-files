
let fileHandle;
let dirHandle;

const options = {
   types: [
     {
       description: "json file",
       accept: {
         "data/json": ".json",
       },
     },
   ],
   excludeAcceptAllOption: true,
 };

 const options_2 = {
   types: [
     {
       description: "svg file",
       accept: {
         "image/svg": ".svg",
       },
     },
   ],
   excludeAcceptAllOption: true,
 };


const onConfirmRefresh = function (event) {
  event.preventDefault();
  return event.returnValue = "Are you sure you want to leave the page?";
}

window.addEventListener("beforeunload", onConfirmRefresh, { capture: true });


function download(filename, text) {
	  var element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	  element.setAttribute('download', filename);

	  element.style.display = 'none';
	  document.body.appendChild(element);
	  element.click();
	  document.body.removeChild(element);
	}


document.getElementById('openFile').onclick = async () => {

  [fileHandle] = await window.showOpenFilePicker(options);
  const file = await fileHandle.getFile();
  const content = await file.text();
  myDiagram.model = go.Model.fromJson(content);
  document.getElementById('filename').innerHTML = file.name;
};

document.getElementById('saveFile').onclick = async () => {

 if (typeof fileHandle == 'undefined') {
   fileHandle = await window.showSaveFilePicker(options);
    const file = await fileHandle.getFile();
    document.getElementById('filename').innerHTML = file.name;
 }
 const writable = await fileHandle.createWritable();
 const jsonModel = myDiagram.model.toJson()
 await writable.write(jsonModel);
 download("data.json",jsonModel);
 await writable.close();

};

document.getElementById('saveAsFile').onclick = async () => {

 fileHandle = await window.showSaveFilePicker(options);
 const file = await fileHandle.getFile();
 document.getElementById('filename').innerHTML = file.name;

 const writable = await fileHandle.createWritable();
 const jsonModel = myDiagram.model.toJson()
 await writable.write(jsonModel);
 download("data.json",jsonModel);
 await writable.close();

};

document.getElementById('save2svg').onclick = async () => {

  fileHandleSVG = await window.showSaveFilePicker(options_2);
  const file = await fileHandleSVG.getFile();

  const writable = await fileHandleSVG.createWritable();
  const svg = new XMLSerializer().serializeToString(myDiagram.makeSvg());

  await writable.write(svg);
  download("data.svg",svg);
  await writable.close();

};




// const writable = await fileHandle.createWritable();

