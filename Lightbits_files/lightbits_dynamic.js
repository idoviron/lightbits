const default_url = "http://192.168.16.212/api/v1/";
let current_url_id = 0;
//const default_url = "http://192.168.16.177/api/v1/";

let nodes = {};
let volumes = {};
let volumes_in_node = {};
let devices = {};
let devices_in_node = {};
let current_system = 1;
let current_node = "";
let current_node_index = -1;
let fetchInterval = null;
let in_volumes = false;
let current_menu = 1;
let update_volumes = false;
let show_volumes_delay = 10;

function GetNodes() {
    if (settings != undefined && settings != null && settings.urls.length > 0) {
        url = settings.urls[current_url_id] + "nodes";
    } else {
        url = default_url + "nodes";
    }
    cFunction = GetNodesCallback;
    //if (nodes.nodes == undefined) {
        var xhttp;
        xhttp=new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            cFunction(this);
        }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    //}
  }
  
  function GetNodesCallback(xhttp) {
    let curr_nodes = JSON.parse(xhttp.responseText);
    nodes = curr_nodes;
    createNodes('nodes_parent' + current_system, curr_nodes);
  }

  function forceUpdateVolumes() {
    update_volumes = true;
  }

  function GetVolumes() {
    if (settings != undefined && settings != null && settings.urls.length > 0) {
        url = settings.urls[current_url_id] + "volumes";
    } else {
        url = default_url + "volumes";
    }
    cFunctionV = GetVolumesCallback;
    if (volumes.volumes == undefined || update_volumes) {
        update_volumes = false;
        var xhttp;
        xhttp=new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            cFunctionV(this);
        }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
  }
  
  function GetVolumesCallback(xhttp) {
    let curr_volumes = JSON.parse(xhttp.responseText);
    volumes = curr_volumes;
    //createVolumes('volumes_parent', curr_volumes);
  }

  //blockdevices
  function GetDevices() {
    if (settings != undefined && settings != null && settings.urls.length > 0) {
        url = settings.urls[current_url_id] + "blockdevices";
    } else {
        url = default_url + "blockdevices";
    }
    cFunctionD = GetDevicesCallback;
    if (devices.devices == undefined) {
        var xhttp;
        xhttp=new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        //alert(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            cFunctionD(this);
        }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
  }
  
  function GetDevicesCallback(xhttp) {
    let curr_devices = JSON.parse(xhttp.responseText);
    devices = curr_devices;
    createDevices('devices_parent');
  }

function CreateVolume()
{
    if (settings != undefined && settings != null && settings.urls.length > 0) {
        url = settings.urls[current_url_id] + "volumes";
    } else {
        url = default_url + "volumes";
    }
    let success_message = "A new volume was created";
    if (settings != undefined && settings != null && settings.create_volume_success_msg.length > 0) {
        success_message = settings.create_volume_success_msg;
    }
    let failure_message = "The volume wasn't deleted";
    if (settings != undefined && settings != null && settings.create_volume_failure_msg.length > 0) {
        failure_message = settings.create_volume_failure_msg;
    }
    
    var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
			//alert(xmlHttp.responseText);
			
            if(xmlHttp.readyState == 4)
            {                
                    if (xmlHttp.status == 200) {            
                    volumes = {};
                    GetVolumes();
                    //createVolumes('volumes_parent');
                    createDynamicVolumes('volumes_parent');
                    //showSystems(0);
                    //showVolumes(0);
                    setTimeout(function(){ 
                        alert(success_message);
                        showVolumes(0);
                    }, 1000);
                } else {
                    alert (failure_message + "\n\n" + xmlHttp.responseText);
                }
            }
        }
        xmlHttp.open("POST", url);
		let data = {
			'name': 'nodeName',
			'nodeID': 'nodeID',
			'applicationType': 'NVMeOF',
			'totalCapacity': '1gib'
		};
		data.name = document.getElementById("theName").value;
		data.nodeID = current_node.ID;
		data.totalCapacity = document.getElementById("theSize").value;
        xmlHttp.send(JSON.stringify(data));
}

function DeleteVolume()
{
    if (settings != undefined && settings != null && settings.urls.length > 0) {
        url = settings.urls[current_url_id] + "volumes/";
    } else {
        url = default_url + "volumes/";
    }
    let success_message = "The volume was deleted";
    if (settings != undefined && settings != null && settings.delete_volume_success_msg.length > 0) {
        success_message = settings.delete_volume_success_msg;
    }
    let failure_message = "The volume wasn't deleted";
    if (settings != undefined && settings != null && settings.delete_volume_failure_msg.length > 0) {
        failure_message = settings.delete_volume_failure_msg;
    }

    var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
			//alert(xmlHttp.responseText);
			
            if(xmlHttp.readyState == 4)
            {                
                    if (xmlHttp.status == 200) {
                    volumes = {};
                    GetVolumes();
                    //createVolumes('volumes_parent');
                    createDynamicVolumes('volumes_parent');
                    //showSystems(0)
                    //showVolumes(current_node_index);
                    setTimeout(function(){ 
                        alert(success_message);
                        showVolumes(0);
                    }, 1000);
                } else {
                    alert (failure_message + "\n\n" + xmlHttp.responseText);
                }
            }
        }
        xmlHttp.open("DELETE", url + document.getElementById("theName").value); 
		let data = {
			'name': 'nodeName'
		};
		data.name = document.getElementById("theName").value;
		xmlHttp.send(JSON.stringify(data));
}

function createNodes(parentElement, curr_nodes) {
    let node_counter = 10;
    let parent = document.getElementById(parentElement);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    curr_nodes.nodes.forEach(node => {
        //alert(node.name);
        node_counter++;
        var nn = document.createElement("div");
        nn.id = node_counter;
        nn.className = "nn";
        
        var nn_a = document.createElement("div");
        nn_a.className = "nn_a";
        var nn_b = document.createElement("div");
        nn.appendChild(nn_a);
        nn_b.className = "nn_b";
        let volume_id = node_counter - 11;
        let system_id_str = parent.parentElement.parentElement.parentElement.id;
        system_id_str = system_id_str.substr(system_id_str.length - 1);
        nn_b.onclick = function() { updateCurrentSystem(system_id_str, volume_id);}//showVolumes(volume_id); }
        nn_b.innerHTML = node.name;
        nn.appendChild(nn_b);
        parent.appendChild(nn);
    });
    //n_a//###
    parent.parentElement.childNodes[0].nextElementSibling.style.height = (16 + (25*(curr_nodes.nodes.length)) + "px");
    GetVolumes();
}
function updateCurrentSystem(x, volume_id) {
    var val = parseInt(x);
    val--;
    if (current_url_id != val) {
        show_volumes_delay = 500;
    } else {
        show_volumes_delay = 10;
    }
    current_url_id = val;current_system = val+1;
    forceUpdateVolumes();
    GetVolumes();
    setTimeout(() => {
        showVolumes(volume_id);
    }, show_volumes_delay);
    //###showVolumes(volume_id);
}

function createDynamicVolumes(parentElement) {


    let volume_counter = -1;
    let parent = document.getElementById(parentElement);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    var el_br = document.createElement("br");
    var volumes_headline = document.createElement("div");
    volumes_headline.innerHTML = "System Volumes";
    volumes_headline.id = volumes_headline;
    parent.appendChild(el_br);
    parent.appendChild(volumes_headline);
    parent.appendChild(el_br);
    parent.appendChild(el_br);
    var v = document.createElement("div");
    v.className = "v";
    volumes_in_node = volumes_in_node.sort(function(a, b){
        if (a.name > b.name) {
            return 1;
        }
        if (b.name > a.name) {
            return -1;
        }
        return 0;
    });
    volumes_in_node.forEach(volume => {
        volume_counter++;
        var v_id = document.createElement("div");
        v_id.id = "v0" + volume_counter.toString();
        v_id.className = "v_id";
        v.appendChild(v_id);
        var v_id_a = document.createElement("div");
        v_id_a.className = "v_id_a";
        v_id.appendChild(v_id_a);
        var v_id_b = document.createElement("div");
        v_id_b.className = "v_id_b";
        v_id_a.appendChild(v_id_b);
        //var v_canvas = document.createElement("canvas");
        //v_canvas.id = "c0" + volume_counter.toString();
        //v_canvas.className = "v_canvas";
        //v_id_b.appendChild(v_canvas);
        var v_pie = document.createElement("div");
        v_pie.id = "pie" + volume_counter.toString();
        v_id_b.appendChild(v_pie);

        var v_name = document.createElement("div");
        //v_name.className = "v_name tooltip";
        v_name.classList.add("v_name");
        v_name.classList.add("tooltip");
        v_name.innerHTML = volume.name.toString().substring(0,16);
        if (volume.name.length > 16) {
            v_name.innerHTML += "...";
        }
        //v_name.innerHTML = volume.name;
        //<span class="tooltiptext">Tooltip text</span>
        var v_name_tooltip = document.createElement("span");
        v_name_tooltip.className = "tooltiptext";
        v_name_tooltip.innerHTML = volume.name;// + "<br><br>";

        if (volume.name.length > 16) {
            v_name_tooltip.style.marginLeft = "-150px";
        } else {
            var tooltip_margin_left = -7 * volume.name.length;
            v_name_tooltip.style.marginLeft = (tooltip_margin_left + (volume.name.length * -0.5)) + "px";//"-30px";
        }
        v_name.appendChild(v_name_tooltip);
        v_id_a.appendChild(v_name);
        usage[volume_counter - 100] = volume.physicalUsedStorage / volume.totalCapacity * 100;
    });
    var v_end1 = document.createElement("div");
    v_end1.className = "v_end1";
    //v_end1.innerHTML = "Paging";
    
    parent.appendChild(v);
    parent.appendChild(v_end1);

    var counter = -1;
    var div = [];
    volumes_in_node.forEach(volume => {
        counter++;
        div[counter] = d3.select("#pie"+counter).append("div").attr("class", "toolTip_pie");
        var usedStorate = 0;
        if (volume.physicalUsedStorage != undefined && volume.physicalUsedStorage > 0) {
            usedStorate = volume.physicalUsedStorage;
        }
        var dataset = [
            { name: 'Occupied', total: usedStorate, percent: (usedStorate / volume.totalCapacity * 100) },
            { name: 'Free', total: (volume.totalCapacity - usedStorate), percent: (100-(usedStorate / volume.totalCapacity * 100)) }
        ];

        var width = 110,
            height = 80,
            radius = Math.min(width, height) / 2;
    
        var color = d3.scale.ordinal()
            .range(["#D5CCE9", "#9A7EA4"]);
    
        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 25);
    
        var pie = d3.layout.pie()
            .sort(null)
             .startAngle(0.0*Math.PI)
            .endAngle(2.0*Math.PI)
            .value(function(d) { return d.total; });
    
        var svg = d3.select("#pie"+counter).append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    
         var g = svg.selectAll(".arc")
              .data(pie(dataset))
            .enter().append("g")
              .attr("class", "arc");
    
          g.append("path")
            .style("fill", function(d) { return color(d.data.name); })
            .transition().delay(function(d,i) {
            return i * 500; }).duration(500)
            .attrTween('d', function(d) {
                var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                return function(t) {
                    d.endAngle = i(t); 
                    return arc(d)
                    }
                }); 
          //g.append("text")
            //  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            //  .attr("dy", ".35em")
            //  .transition()
            //  .delay(1000)
            //  .text(function(d) { return d.data.name; });
    
             d3.selectAll("path").on("mousemove", function(d) {
                div[counter].style("left", (d3.event.pageX -500 + 25) +"px");
                //div[counter].style("top", d3.event.pageY-25+"px");
                div[counter].style("display", "inline-block");
                div[counter].html((d.data.name)+"<br>"+(d.data.total) + "<br>"+(Math.round(d.data.percent)) + "%");
            });
              
        d3.selectAll("path").on("mouseout", function(d){
            div[counter].style("display", "none");
        }); 
              
              
        //d3.select("volumes_parent2").transition().style("background-color", "#d3d3d3");
        function type(d) {
          d.total = +d.total;
          return d;
        }
    });
}

function createVolumes(parentElement) {
    //curr_volumes.volumes[0].physicalUsedStorage / curr_volumes.volumes[0].totalCapacity * 100
    let volume_counter = 100;
    let parent = document.getElementById(parentElement);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    var el_br = document.createElement("br");
    var volumes_headline = document.createElement("div");
    volumes_headline.innerHTML = "System Volumes";
    volumes_headline.id = volumes_headline;
    parent.appendChild(el_br);
    parent.appendChild(volumes_headline);
    parent.appendChild(el_br);
    parent.appendChild(el_br);
    var v = document.createElement("div");
    v.className = "v";
    volumes_in_node = volumes_in_node.sort(function(a, b){
        if (a.name > b.name) {
            return 1;
        }
        if (b.name > a.name) {
            return -1;
        }
        return 0;
    });
    volumes_in_node.forEach(volume => {
        volume_counter++;
        var v_id = document.createElement("div");
        v_id.id = "v0" + volume_counter.toString();
        v_id.className = "v_id";
        v.appendChild(v_id);
        var v_id_a = document.createElement("div");
        v_id_a.className = "v_id_a";
        v_id.appendChild(v_id_a);
        var v_id_b = document.createElement("div");
        v_id_b.className = "v_id_b";
        v_id_a.appendChild(v_id_b);
        var v_canvas = document.createElement("canvas");
        v_canvas.id = "c0" + volume_counter.toString();
        v_canvas.className = "v_canvas";
        v_id_b.appendChild(v_canvas);
        var v_name = document.createElement("div");
        //v_name.className = "v_name tooltip";
        v_name.classList.add("v_name");
        v_name.classList.add("tooltip");
        v_name.innerHTML = volume.name.toString().substring(0,16);
        if (volume.name.length > 16) {
            v_name.innerHTML += "...";
        }
        //v_name.innerHTML = volume.name;
        //<span class="tooltiptext">Tooltip text</span>
        var v_name_tooltip = document.createElement("span");
        v_name_tooltip.className = "tooltiptext";
        v_name_tooltip.innerHTML = volume.name;// + "<br><br>";
        //for(var key in volume){
        //    v_name_tooltip.innerHTML += (key + ":" + volume[key] + "<br>");
        // }
        /*
ID
applicationType
compression
creationTime
etag
nodeID
nsid
totalCapacity
uuid
        */
        if (volume.name.length > 16) {
            v_name_tooltip.style.marginLeft = "-150px";
        } else {
            v_name_tooltip.style.marginLeft = "-60px";
        }
        v_name.appendChild(v_name_tooltip);
        v_id_a.appendChild(v_name);
        usage[volume_counter - 100] = volume.physicalUsedStorage / volume.totalCapacity * 100;
    });
    var v_end1 = document.createElement("div");
    v_end1.className = "v_end1";
    //v_end1.innerHTML = "Paging";
    var v_script = document.createElement("script");
    v_script.src = "https://canvasjs.com/assets/script/canvasjs.min.js";
    parent.appendChild(v);
    parent.appendChild(v_end1);
    parent.appendChild(v_script);
    showCanvases();
}

function createDevices(parentElement) {
    let num_devices_in_node = 0;
    devices_in_node = [];
    devices.devices.forEach(device => {
        if (device.nodeID == current_node.ID) {
            num_devices_in_node++;
            devices_in_node.push(device);
        }
    });

    let device_counter = 100;
    let parent = document.getElementById(parentElement);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    var el_br = document.createElement("br");
    parent.appendChild(el_br);
    parent.appendChild(el_br);
    parent.appendChild(el_br);
    var v = document.createElement("div");
    v.className = "v";
    devices_in_node = devices_in_node.sort(function(a, b){
        if (a == undefined || b == undefined || a.blockDevice == undefined || b.blockDevice == undefined || a.blockDevice.name == undefined || b.blockDevice.name == undefined) {
            return 0;
        }
        if (a.blockDevice.name > b.blockDevice.name) {
            return 1;
        }
        if (b.blockDevice.name > a.blockDevice.name) {
            return -1;
        }
        return 0;
    });
    devices_in_node.forEach(device => {
        device_counter++;
        var vd_id = document.createElement("div");
        vd_id.id = "d0" + device_counter.toString();
        vd_id.className = "vd_id";
        v.appendChild(vd_id);
        var v_id_a = document.createElement("div");
        v_id_a.className = "v_id_a";
        vd_id.appendChild(v_id_a);
        var v_id_b = document.createElement("div");
        v_id_b.className = "v_id_b";
        v_id_a.appendChild(v_id_b);
        var v_canvas = document.createElement("canvas");
        v_canvas.id = "cd0" + device_counter.toString();
        v_canvas.className = "v_canvas";
        v_id_b.appendChild(v_canvas);
        var v_name = document.createElement("div");
        //v_name.className = "v_name tooltip";
        v_name.classList.add("v_name");
        v_name.classList.add("tooltip");
        if (device.blockDevice != undefined && device.blockDevice.name != undefined) {
            
            //v_name.innerHTML = device.blockDevice.name.toString().substring(0,16);
            if (device.blockDevice.length > 16) {
                //v_name.innerHTML += "...";
            }
            //<span class="tooltiptext">Tooltip text</span>
            var v_name_tooltip = document.createElement("span");
            v_name_tooltip.className = "tooltiptext";
            v_name_tooltip.innerHTML = device.blockDevice.name;
            if (device.blockDevice.nameh > 16) {
                v_name_tooltip.style.marginLeft = "-150px";
            } else {
                v_name_tooltip.style.marginLeft = "-80px";
            }
            v_name.appendChild(v_name_tooltip);
            v_id_a.appendChild(v_name);
        } else {
            //v_name.innerHTML = "undefined";
            v_id_a.appendChild(v_name);
        }
        device_statuses[device_counter - 100] = device.status;
        //usage[device_counter - 100] = volume.physicalUsedStorage / volume.totalCapacity * 100;
    });
    var v_end1 = document.createElement("div");
    v_end1.className = "v_end1";
    //v_end1.innerHTML = "Paging";
    var v_script = document.createElement("script");
    v_script.src = "https://canvasjs.com/assets/script/canvasjs.min.js";
    parent.appendChild(v);
    parent.appendChild(v_end1);
    parent.appendChild(v_script);

    showDevices();

    //create legend
    if (settings != undefined && settings != null && settings.device_statuses.length > 0) {
        let legend_parent = document.getElementById("device_legend");
        while (legend_parent.firstChild) {
            legend_parent.removeChild(legend_parent.firstChild);
        }
        settings.device_statuses.forEach(device_status => {
            let legend_status = document.createElement("div");
            legend_status.innerText = " " + device_status.status;
            let legend_space = document.createElement("span");
            legend_space.innerText = " ";
            legend_status.appendChild(legend_space);
            let legend_color = document.createElement("span");
            legend_color.innerText = "● ";
            legend_color.style.color = device_status.color;
            legend_status.appendChild(legend_color);
            legend_parent.appendChild(legend_status);
        });
        let br_elem = document.createElement("br");
        legend_parent.appendChild(br_elem);
        
    }
}

function showSystem(x) {
    document.getElementById("open_s" + x).style.display = "inline";
    document.getElementById("btn_open_s" + x).innerText = "";
    document.getElementById("btn_open_s" + x).onclick = "";
    document.getElementById("s" + (x+1)).style.display = "inline";
    document.getElementById("btn_open_s" + x+1).innerText = "+";
}

function fetchIntervalTick() {
    //console.log("fetching nodes");
    GetNodes();
    if (volumes.volumes != undefined) {
        //console.log("fetching volumes");
        GetVolumes();
        if (current_node) {
            if (in_volumes) {
              showVolumes(current_node_index);
            }
        }
    }
    if (devices.devices != undefined) {
        //console.log("fetching devices");
        GetDevices();
    }
  }
  
  function fetchIntervalStop() {
    clearInterval(fetchInterval);
  }

function show(x) {
    if (current_menu != x) {
        current_menu = x;
        if (x == 2) {
            if (document.getElementById("submenu").style.display != "inline") {
                document.getElementById("submenu").style.display = "inline";
                //document.getElementById("submenu").classList.add('animated', 'fadeIn');
            }
        } else {
            if (document.getElementById("submenu").style.display != "none") {
                //document.getElementById("submenu").classList.add('animated', 'fadeOut');
                //setTimeout(() => {
                    document.getElementById("submenu").style.display = "none";
                //}, 1000);
            }
        }
        for (i = 1; i <= 3; i++) {
            if (i != x) {
                document.getElementById("a" + i).style.display = "none";
                document.getElementById("m" + i).style.fontWeight = "normal";
            }
        }
        document.getElementById("a" + x).style.display = "inline";
        document.getElementById("a" + x).classList.add('animated', 'fadeIn');
        document.getElementById("m" + x).style.fontWeight = "bold";
    }
}

function showNodes(x) {
    //start fetch interval
    if (fetchInterval == null) {
        if (settings != undefined && settings != null && settings.api_fetch_interval_ms > 0) {
            fetchInterval = setInterval(fetchIntervalTick, settings.api_fetch_interval_ms);
        } else {
            fetchInterval = setInterval(fetchIntervalTick, 5000);
        }
    }

    var c = "n" + x + "";
    document.getElementById(c).style.display = "inline";
    current_url_id = x - 1;
    current_system = x;
    GetNodes();
}

function showVolumes(x) {
    current_node = nodes.nodes[x];
    current_node_index = x;
    let num_volumes_in_node = 0;
    volumes_in_node = [];
    volumes.volumes.forEach(volume => {
        if (volume.nodeID == current_node.ID) {
            num_volumes_in_node++;
            volumes_in_node.push(volume);
        }
    });
    
    createDynamicVolumes('volumes_parent');
    //createVolumes('volumes_parent');
    document.getElementById('curr_node_volumes').innerHTML = num_volumes_in_node;
    document.getElementById('curr_node_prov').innerHTML = getCapacityStr(current_node.stats.provisionedStorage);//Math.round( current_node.stats.provisionedStorage / 1073741824 );
    document.getElementById('curr_node_unprov').innerHTML = getCapacityStr(current_node.stats.provisionedStorage - current_node.stats.physicalUsedStorage);//Math.round( (current_node.stats.provisionedStorage - current_node.stats.physicalUsedStorage) / 1073741824 );
    //document.getElementById('curr_node_prov').innerHTML = Math.round( current_node.stats.provisionedStorage / 1073741824 );
    //document.getElementById('curr_node_unprov').innerHTML = Math.round( (current_node.stats.provisionedStorage - current_node.stats.physicalUsedStorage) / 1073741824 );
    //alert(current_node);
    document.getElementById('systems').style.display = "none";
    document.getElementById("left_bar").classList.add('animated', 'fadeIn');
    document.getElementById('volumes').style.display = "inline";
    document.getElementById('volumes').classList.add('animated', 'fadeIn');
    document.getElementById('volume_data').style.display = "inline";
    document.getElementById('volume_data').classList.add('animated', 'fadeIn');
    //showCanvases();
    GetDevices();
}
function showSystems(x) {
    document.getElementById('systems').style.display = "inline";
    document.getElementById('volumes').style.display = "none";
    document.getElementById('volume_data').style.display = "none";
    //document.getElementById("left_bar").style.display = "inline";
    //document.getElementById("left_bar").classList.add('animated', 'fadeIn');
}

function getCapacityStr(num) {
    let pow1 = 1024;
    let pow2 = 1048576;
    let pow3 = 1073741824;
    let pow4 = 1099511627776;
    if (num >= pow4) {
        return Math.round(num/pow4).toString() + " TB";
    } else if (num >= pow3) {
        return Math.round(num/pow3).toString() + " GB";
    } else if (num >= pow2) {
        return Math.round(num/pow2).toString() + " MB";
    } else if (num >= pow1) {
        return Math.round(num/pow1).toString() + " KB";
    } else {
        return num.toString() + " B";
    }
}

var colors = ["dummy", "#D5CCE9", "#D5CCE9", "#D5CCE9", "#D5CCE9", "#D5CCE9", "#D5CCE9", "#D5CCE9", "#D5CCE9", "#D5CCE9", "#D5CCE9", "#D5CCE9"];
var usage = [0,35,90,100,40,70,100,50,60,90]
var device_statuses = ["missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing","missing"];

function showDevices() {
    //set text
    let data_element = document.getElementById("devices_headline");
    var text = document.createElement("div");
    //for(var key in current_node){
    //    text.innerHTML += (key + ":" + current_node[key] + "<br>");
    //}
    //ID:56a91f33-072d-4805-8e4d-135e0569e6a9
    text.innerHTML += "<br>Name: ";
    text.innerHTML += current_node.name;
    //text.innerHTML += "<br>Network Interfaces:<br>";
    //text.innerHTML += current_node.networkInterfaces;
    text.innerHTML += "<br>State: ";
    text.innerHTML += current_node.state;
    text.innerHTML += "<br>Boot State: ";
    text.innerHTML += current_node.bootState;
    text.innerHTML += "<br>GC: ";
    text.innerHTML += current_node.GC;
    text.innerHTML += "<br>MD: ";
    text.innerHTML += current_node.MD;
    text.innerHTML += "<br><br>Preformance Threshold: <br>";
    text.innerHTML += current_node.overProvisioningPerformanceThreshold;
    text.innerHTML += "<br>Logical Used Storage: <br>";
    text.innerHTML += getCapacityStr(current_node.stats.logicalUsedStorage);
    text.innerHTML += "<br>Physical Used Storage: <br>";
    text.innerHTML += getCapacityStr(current_node.stats.physicalUsedStorage);
    text.innerHTML += "<br>Provisioned Storage: <br>";
    text.innerHTML += getCapacityStr(current_node.stats.provisionedStorage);
    text.innerHTML += "<br>System Provisioned Storage: <br>";
    text.innerHTML += getCapacityStr(current_node.stats.systemProvisionedStorage);
    text.innerHTML += "<br>Total Capacity: <br>";
    text.innerHTML += getCapacityStr(current_node.stats.totalCapacity);
    text.innerHTML += "<br>Total Effective Capacity: <br>";
    text.innerHTML += getCapacityStr(current_node.stats.totalEffectiveCapacity);
    text.innerHTML += "<br>Total Raw Capacity: <br>";
    text.innerHTML += getCapacityStr(current_node.stats.totalRawCapacity);
    text.innerHTML += "<br>";
    data_element.appendChild(text);

    //draw SSDs
    for (i = 1; i <= 100; i++) {
        var j = i / 24;
        k = "01";
        if (j > 1) {
            k = "02";
        }
        l = i % 24;
        if (l == 0) l = 24;
        if (l < 10) {
            l = "0" + l;
        }
        var cd = document.getElementById("cd"+k+""+l+"");
        if (cd != null) {
            var ctx = cd.getContext("2d");
            //ctx.fillstyle = "#5f305e";
            //Valid / Missing
            ctx.fillStyle = "gray";
            if (settings != undefined && settings != null && settings.device_statuses.length > 0) {
                settings.device_statuses.forEach(status => {
                    if (status.status == device_statuses[i]) {
                        ctx.fillStyle = status.color;
                    }
                });
            } else {
                if (device_statuses[i] == "Valid") {
                    ctx.fillStyle = "green";
                } else if (device_statuses[i] == "Missing") {
                    ctx.fillStyle = "red";
                }
            }
            
            ctx.fillRect(0, 0, 27, 41);
            ctx.fillStyle = "#5f305e";
            ctx.fillRect(4, 6, 27-8, 41-12);
        }
    }
}

function showCanvases() {
    for (i = 1; i <= 9; i++) {
    //for (i = 1; i <= 2; i++) {
        var j = i / 8;
        k = "01";
        if (j > 1) {
            k = "02";
        }
        l = i % 8;
        if (l == 0) l = 8;
        l = "0" + l;
        var c = document.getElementById("c"+k+""+l+"");
        if (c != null) {
            var ctx = c.getContext("2d");
            //ctx.fillstyle = "#5f305e";
            //ctx.fillRect(0, 0, canvas.width/2, canvas.height/2);
            //ctx.translate(canvas.width/2,canvas.height/2);
            //ctx.rotate(Math.PI/8);
            ctx.beginPath();
            ctx.fillstyle = "black";
            ctx.arc(44, 37, 32, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.strokeStyle = '#000000';
            ctx.moveTo(44, 37);
            var x = (usage[i] / 100.0) * 2.0;
            ctx.arc(44, 37, 32, 0, x * Math.PI);
            ctx.lineTo(44, 37);
            ctx.closePath();
            //ctx.stroke();
            ctx.fill();
            //ctx.rotate(-Math.PI/2);
            //ctx.translate(-canvas.width/2,-canvas.height/2);
        }
    }
}

/*function showCanvas1() {
    var c = document.getElementById("c0102");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.moveTo(44, 37);
    ctx.arc(44, 37, 32, 0, 1.5 * Math.PI);
    ctx.lineTo(44, 5);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}*/