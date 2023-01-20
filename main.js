parameters_x="";
paramater_width="";
parameter_height="";
parameters_y="";
objects=[];
objects_time=[];
function setup(){
    canvas=createCanvas(380,380);
    video = createCapture(VIDEO);
    video.hide();
    video.size(450,380); 
    video.center();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Object";
    var search = document.getElementById("locator");
    search.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
            var objFound = false;
            for(i=0; i<objects_time.length; i++) {
                var objName = objects_time[i].label;
                if ( objName.toUpperCase().includes(search.value.toUpperCase())) {
                    objFound = true;
                    document.getElementById("search_results").innerHTML = (capitalizeFirstLetter(objects_time[i].label) + " was last found at "+ objects_time[i].time);
                }
            }
            if (!objFound) {
                document.getElementById("search_results").innerHTML = (search.value + " not found");
            }
            search.value =""; // clear search text
        }
    });
}
function modelLoaded(){
    console.log("Model Loaded");
}
function draw(){
    image(video,0,0,380,380);
    objectDetector.detect(video, gotResults);
    for(i=0; i<objects.length; i++) {
        document.getElementById("status").innerHTML = "Status: Detected Object";
        fill("red");
        percent=floor(objects[i].confidence*100);
        text(capitalizeFirstLetter(objects[i].label) + " "+ percent+"%",parameters_x+15,parameters_y+15);
        noFill();
        stroke("red");
        rect(parameters_x, parameters_y, paramater_width, parameter_height);
       
    }

}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function gotResults(error, results){
    if(error){
        console.log(error);
    }
    else{
        
        objects=results;
        const timeNow = new Date();
        //console.log(timeNow); // shows current date and time";
        for(i=0; i<objects.length; i++) {
            objects_time.push({"label": objects[i].label, "time": timeNow});
            //console.log(objects_time);
        }
        //console.log(objects);
        document.getElementById("status").innerHTML = "Status: Detected Object";
        document.getElementById("printName").innerHTML = ("Name"+ ": " + capitalizeFirstLetter(results[0].label));
        parameters_x = results[0].x;
        parameters_y = results[0].y;
        parameter_height = results[0].height;
        paramater_width = results[0].width;
    }
}
