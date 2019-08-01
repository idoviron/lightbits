
/* function GetNodes(url, cFunction) {
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cFunction(this);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function GetNodesCallback(xhttp) {
  let text = "";
  let nodes = JSON.parse(xhttp.responseText);
  for (let i = 0; i < nodes.nodes.length; i++) {
	text += nodes.nodes[i].name + ", ID:" + nodes.nodes[i].ID + ", total capacity:" + nodes.nodes[i].stats.totalCapacity + "\n";
  }
  document.getElementById("response1").innerText = text;
} */

/* function GetVolumes(url, cFunction) {
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cFunction(this);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function GetVolumesCallback(xhttp) {
  let text = "";
  let volumes = JSON.parse(xhttp.responseText);
  for (let i = 0; i < volumes.volumes.length; i++) {
	text += volumes.volumes[i].name + ", ID:" + volumes.volumes[i].ID + ",\nnodeID:" + volumes.volumes[i].nodeID +",total capacity:" + volumes.volumes[i].totalCapacity + "\n\n";
  }
  document.getElementById("response3").innerText = text;
} */

/* function CreateVolume()
{
    var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
			//alert(xmlHttp.responseText);
			
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                alert(xmlHttp.responseText);
            }
        }
        xmlHttp.open("POST", "http://192.168.16.155/api/v1/volumes"); 
		let data = {
			'name': 'nodeName',
			'nodeID': 'nodeID',
			'applicationType': 'NVMeOF',
			'totalCapacity': '1gib'
		};
		data.name = document.getElementById("nodeName").value;
		data.nodeID = document.getElementById("nodeID").value;
		data.totalCapacity = document.getElementById("totalCapacity").value;
        xmlHttp.send(JSON.stringify(data));
} */

function UpdateVolume()
{
    var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
			//alert(xmlHttp.responseText);
			
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                alert(xmlHttp.responseText);
            }
        }
        xmlHttp.open("PUT", "http://192.168.16.155/api/v1/volumes/" + document.getElementById("nodeName").value); 
		let data = {
			'name': 'nodeName',
			'totalCapacity': '1gib'
		};
		data.name = document.getElementById("nodeName").value;
		//data.ID = document.getElementById("nodeID").value;
		data.totalCapacity = document.getElementById("totalCapacity").value;
        xmlHttp.send(JSON.stringify(data));
}

/* function DeleteVolume()
{
    var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
			//alert(xmlHttp.responseText);
			
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                alert(xmlHttp.responseText);
            }
        }
        xmlHttp.open("DELETE", "http://192.168.16.155/api/v1/volumes/" + document.getElementById("nodeName").value); 
		let data = {
			'name': 'nodeName'
		};
		data.name = document.getElementById("nodeName").value;
		//data.ID = document.getElementById("nodeID").value;
		//data.totalCapacity = document.getElementById("totalCapacity").value;
        xmlHttp.send(JSON.stringify(data));
} */